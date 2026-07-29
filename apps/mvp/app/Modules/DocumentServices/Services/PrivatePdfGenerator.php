<?php

namespace App\Modules\DocumentServices\Services;

use App\Modules\DocumentServices\Models\DocumentRequest;
use Illuminate\Support\Facades\Storage;

class PrivatePdfGenerator
{
    /**
     * @return array{path: string, checksum: string}
     */
    public function generate(
        DocumentRequest $request,
        string $serialNumber,
        string $verificationUrl,
        int $revision,
    ): array {
        $request->loadMissing(['templateVersion.template', 'resident']);
        $body = $this->renderBody(
            $request->templateVersion->body_template,
            $request->request_data,
        );
        $lines = [
            'BARANGAY iSERVE',
            $request->templateVersion->title,
            "Document No.: {$serialNumber}",
            "Request No.: {$request->request_number}",
            "Revision: {$revision}",
            '',
            ...(preg_split('/\R/', wordwrap($body, 86)) ?: []),
            '',
            'Verification:',
            ...(preg_split('/\R/', wordwrap($verificationUrl, 80, "\n", true)) ?: []),
        ];
        $pdf = $this->minimalPdf($lines);
        $path = "document-services/{$request->barangay_code}/{$request->public_id}/revision-{$revision}.pdf";

        Storage::disk(config('document_services.pdf_disk'))->put($path, $pdf);

        return ['path' => $path, 'checksum' => hash('sha256', $pdf)];
    }

    private function renderBody(string $template, array $data): string
    {
        return preg_replace_callback(
            '/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/',
            static function (array $match) use ($data): string {
                $value = data_get($data, $match[1], '');

                return is_scalar($value) ? (string) $value : '';
            },
            $template,
        ) ?? $template;
    }

    /** @param list<string> $lines */
    private function minimalPdf(array $lines): string
    {
        $pages = array_chunk($lines, 48);
        $pageCount = max(1, count($pages));
        $fontObject = 3 + ($pageCount * 2);
        $pageObjects = [];
        $objects = [
            '<< /Type /Catalog /Pages 2 0 R >>',
            '',
        ];

        foreach ($pages ?: [[]] as $pageIndex => $pageLines) {
            $pageObject = 3 + ($pageIndex * 2);
            $contentObject = $pageObject + 1;
            $pageObjects[] = "{$pageObject} 0 R";
            $content = "BT\n/F1 10 Tf\n48 792 Td\n";

            foreach ($pageLines as $lineIndex => $line) {
                if ($lineIndex > 0) {
                    $content .= "0 -15 Td\n";
                }
                $content .= '('.$this->escape((string) $line).") Tj\n";
            }
            $content .= "ET\n";
            $objects[] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] "
                ."/Resources << /Font << /F1 {$fontObject} 0 R >> >> "
                ."/Contents {$contentObject} 0 R >>";
            $objects[] = '<< /Length '.strlen($content)." >>\nstream\n{$content}endstream";
        }
        $objects[1] = '<< /Type /Pages /Kids ['.implode(' ', $pageObjects)."] /Count {$pageCount} >>";
        $objects[] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
        $pdf = "%PDF-1.4\n";
        $offsets = [0];

        foreach ($objects as $index => $object) {
            $offsets[] = strlen($pdf);
            $number = $index + 1;
            $pdf .= "{$number} 0 obj\n{$object}\nendobj\n";
        }

        $xref = strlen($pdf);
        $objectCount = count($objects);
        $pdf .= "xref\n0 ".($objectCount + 1)."\n0000000000 65535 f \n";
        foreach (array_slice($offsets, 1) as $offset) {
            $pdf .= sprintf("%010d 00000 n \n", $offset);
        }
        $pdf .= 'trailer'."\n<< /Size ".($objectCount + 1)
            ." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF\n";

        return $pdf;
    }

    private function escape(string $value): string
    {
        $plain = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: '';

        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $plain);
    }
}

<?php

namespace App\Modules\DocumentServices\Services;

use App\Models\User;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Models\IssuedDocument;

class DocumentResponse
{
    /** @var array<int, bool> */
    private array $operationalViewerCache = [];

    public function request(DocumentRequest $request, ?User $viewer = null): array
    {
        $request->loadMissing(['templateVersion.template', 'resident']);
        $canSeeOperationalDetails = $this->canSeeOperationalDetails($viewer);

        return [
            'public_id' => $request->public_id,
            'request_number' => $request->request_number,
            'status' => $request->status,
            'template' => [
                'code' => $request->templateVersion->template->code,
                'name' => $request->templateVersion->template->name,
                'version' => $request->templateVersion->version_number,
                'title' => $request->templateVersion->title,
            ],
            ...($canSeeOperationalDetails ? [
                'purpose' => $request->purpose,
                'resident' => [
                    'public_id' => $request->resident->public_id,
                    'resident_number' => $request->resident->resident_number,
                    'display_name' => trim(
                        "{$request->resident->last_name}, {$request->resident->first_name} "
                        .$request->resident->middle_name,
                    ),
                ],
                'request_data' => $request->request_data,
                'requirement_evidence' => $request->requirement_evidence,
            ] : []),
            'fee_reference' => $request->fee_reference,
            'barangay_code' => $request->barangay_code,
            'created_at' => $request->created_at?->toIso8601String(),
            'updated_at' => $request->updated_at?->toIso8601String(),
        ];
    }

    public function issued(IssuedDocument $issued): array
    {
        return [
            'public_id' => $issued->public_id,
            'serial_number' => $issued->serial_number,
            'revision' => $issued->revision,
            'status' => $issued->status,
            'pdf_checksum' => $issued->pdf_checksum,
            'generated_at' => $issued->generated_at?->toIso8601String(),
            'released_at' => $issued->released_at?->toIso8601String(),
            'voided_at' => $issued->voided_at?->toIso8601String(),
        ];
    }

    private function canSeeOperationalDetails(?User $viewer): bool
    {
        if ($viewer === null) {
            return false;
        }

        return $this->operationalViewerCache[$viewer->getKey()] ??= array_intersect(
            $viewer->permissionCodes(),
            ['document.update', 'document.approve', 'document.export'],
        ) !== [];
    }
}

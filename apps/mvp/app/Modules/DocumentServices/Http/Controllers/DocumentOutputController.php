<?php

namespace App\Modules\DocumentServices\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Models\IssuedDocument;
use App\Services\ScopedAuthorization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentOutputController extends Controller
{
    public function download(
        Request $request,
        DocumentRequest $documentRequest,
        IssuedDocument $issuedDocument,
        ScopedAuthorization $authorization,
    ): StreamedResponse {
        $authorization->authorize($request, 'document.export', $documentRequest);
        abort_unless($issuedDocument->document_request_id === $documentRequest->getKey(), 404);

        return Storage::disk(config('document_services.pdf_disk'))->download(
            $issuedDocument->pdf_path,
            $issuedDocument->serial_number.'.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }
}

<?php

namespace App\Modules\DocumentServices\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DocumentServices\Models\IssuedDocument;
use Illuminate\Http\JsonResponse;

class PublicVerificationController extends Controller
{
    public function show(string $token): JsonResponse
    {
        abort_unless(preg_match('/^[a-f0-9]{64}$/', $token) === 1, 404);
        $issued = IssuedDocument::query()
            ->with('request.templateVersion.template')
            ->where('verification_token_hash', hash('sha256', $token))
            ->firstOrFail();
        $publicStatus = $issued->status === 'valid' && $issued->released_at === null
            ? 'not_released'
            : $issued->status;

        return response()->json([
            'data' => [
                'verified' => true,
                'serial_number' => $issued->serial_number,
                'revision' => $issued->revision,
                'status' => $publicStatus,
                'document_type' => $issued->request->templateVersion->template->name,
                'issuing_barangay_code' => $issued->request->barangay_code,
                'generated_at' => $issued->generated_at?->toIso8601String(),
                'released_at' => $issued->released_at?->toIso8601String(),
                'voided_at' => $issued->voided_at?->toIso8601String(),
            ],
        ]);
    }
}

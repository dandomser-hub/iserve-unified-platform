<?php

namespace App\Modules\DocumentServices\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Services\DocumentResponse;
use App\Modules\DocumentServices\Services\DocumentWorkflow;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DocumentWorkflowController extends Controller
{
    public function submit(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.update', $documentRequest);

        return response()->json([
            'data' => $response->request(
                $workflow->submit($documentRequest, $request->user()),
                $request->user(),
            ),
        ]);
    }

    public function checkRequirements(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.requirements.check', $documentRequest);
        $validated = $request->validate([
            'requirement_evidence' => ['required', 'array', 'max:50'],
            'requirement_evidence.*.code' => ['required', 'string', 'max:64', 'distinct'],
            'requirement_evidence.*.status' => [
                'required',
                'string',
                Rule::in(config('document_services.requirement_statuses')),
            ],
            'requirement_evidence.*.reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        return response()->json([
            'data' => $response->request(
                $workflow->checkRequirements(
                    $documentRequest,
                    $request->user(),
                    $validated['requirement_evidence'],
                    $validated['notes'] ?? null,
                ),
                $request->user(),
            ),
        ]);
    }

    public function referenceFee(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.fee.reference', $documentRequest);
        $validated = $request->validate([
            'exemption_code' => [
                'nullable',
                'string',
                Rule::in(config('document_services.exemption_codes')),
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        return response()->json([
            'data' => $response->request(
                $workflow->referenceFee(
                    $documentRequest,
                    $request->user(),
                    $validated['exemption_code'] ?? null,
                    $validated['notes'] ?? null,
                ),
                $request->user(),
            ),
        ]);
    }

    public function decide(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $authorization->authorize($request, 'document.approve', $documentRequest);
        $validated = $request->validate([
            'decision' => ['required', 'string', Rule::in(['approve', 'return'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $item = $workflow->decide(
            $documentRequest,
            $request->user(),
            $validated['decision'],
            $validated['notes'] ?? null,
        );
        $audit->record(
            $request->user(),
            $validated['decision'] === 'approve'
                ? 'document.approved'
                : 'document.returned',
            'success',
            $request,
            'document.approve',
            'document_request',
            $item->public_id,
        );

        return response()->json(['data' => $response->request($item, $request->user())]);
    }

    public function generate(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $authorization->authorize($request, 'document.export', $documentRequest);
        $result = $workflow->generate($documentRequest, $request->user(), $request->root());
        $audit->record(
            $request->user(),
            'document.generated',
            'success',
            $request,
            'document.export',
            'document_request',
            $documentRequest->public_id,
            ['serial_number' => $result['issued_document']->serial_number],
        );

        return response()->json([
            'data' => [
                'request' => $response->request($result['request'], $request->user()),
                'issued_document' => $response->issued($result['issued_document']),
                'verification_token' => $result['verification_token'],
                'verification_url' => $result['verification_url'],
                'qr_payload' => $result['verification_url'],
            ],
        ]);
    }

    public function release(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.release', $documentRequest);
        $validated = $request->validate(['notes' => ['nullable', 'string', 'max:2000']]);

        return response()->json([
            'data' => $response->request(
                $workflow->release(
                    $documentRequest,
                    $request->user(),
                    $validated['notes'] ?? null,
                ),
                $request->user(),
            ),
        ]);
    }

    public function reprint(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $authorization->authorize($request, 'document.reprint', $documentRequest);
        $validated = $request->validate(['reason' => ['required', 'string', 'max:2000']]);
        $result = $workflow->reprint(
            $documentRequest,
            $request->user(),
            $validated['reason'],
            $request->root(),
        );
        $audit->record(
            $request->user(),
            'document.reprinted',
            'success',
            $request,
            'document.reprint',
            'document_request',
            $documentRequest->public_id,
            ['revision' => $result['issued_document']->revision],
        );

        return response()->json([
            'data' => [
                'request' => $response->request($result['request'], $request->user()),
                'issued_document' => $response->issued($result['issued_document']),
                'verification_token' => $result['verification_token'],
                'verification_url' => $result['verification_url'],
                'qr_payload' => $result['verification_url'],
            ],
        ]);
    }

    public function void(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentWorkflow $workflow,
        DocumentResponse $response,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $authorization->authorize($request, 'document.void', $documentRequest);
        $validated = $request->validate(['reason' => ['required', 'string', 'max:2000']]);
        $item = $workflow->void($documentRequest, $request->user(), $validated['reason']);
        $audit->record(
            $request->user(),
            'document.voided',
            'success',
            $request,
            'document.void',
            'document_request',
            $item->public_id,
        );

        return response()->json(['data' => $response->request($item, $request->user())]);
    }
}

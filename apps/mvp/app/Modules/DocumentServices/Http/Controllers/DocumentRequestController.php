<?php

namespace App\Modules\DocumentServices\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Models\DocumentTemplateVersion;
use App\Modules\DocumentServices\Services\DocumentIdentifier;
use App\Modules\DocumentServices\Services\DocumentResponse;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DocumentRequestController extends Controller
{
    public function index(Request $request, DocumentResponse $response): JsonResponse
    {
        $query = DocumentRequest::query()->with(['templateVersion.template', 'resident']);
        if ($request->user()->barangay_code !== null) {
            $query->where('barangay_code', $request->user()->barangay_code);
        } elseif ($request->user()->municipality_code !== null) {
            $query->where('municipality_code', $request->user()->municipality_code);
        } else {
            $query->whereRaw('1 = 0');
        }
        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        return response()->json([
            'data' => $query->latest()->limit(100)->get()->map(
                fn (DocumentRequest $item) => $response->request($item, $request->user()),
            ),
        ]);
    }

    public function store(
        Request $request,
        DocumentIdentifier $identifier,
        DocumentResponse $response,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $validated = $request->validate([
            'template_code' => ['required', 'string', 'max:64'],
            'resident_public_id' => ['required', 'uuid'],
            'purpose' => ['required', 'string', 'max:500'],
            'request_data' => ['required', 'array', 'max:100'],
        ]);
        $resident = Resident::query()
            ->where('public_id', $validated['resident_public_id'])
            ->firstOrFail();
        $authorization->authorize($request, 'resident.view', $resident);
        if ($resident->status !== 'active') {
            throw ValidationException::withMessages([
                'resident_public_id' => 'The resident must be active for this document service.',
            ]);
        }

        $version = DocumentTemplateVersion::query()
            ->where('status', 'published')
            ->whereHas('template', fn ($builder) => $builder
                ->where('code', Str::upper($validated['template_code']))
                ->where('barangay_code', $request->user()->barangay_code)
                ->where('is_active', true))
            ->latest('version_number')
            ->firstOrFail();
        $this->validateRequiredFields($version, $validated['request_data']);

        $documentRequest = DB::transaction(function () use (
            $request,
            $validated,
            $version,
            $resident,
            $identifier,
        ): DocumentRequest {
            $item = DocumentRequest::query()->create([
                'public_id' => (string) Str::uuid(),
                'request_number' => $identifier->requestNumber($request->user()->barangay_code),
                'document_template_version_id' => $version->getKey(),
                'resident_id' => $resident->getKey(),
                'barangay_code' => $request->user()->barangay_code,
                'municipality_code' => $request->user()->municipality_code,
                'purpose' => $validated['purpose'],
                'request_data' => $validated['request_data'],
                'status' => 'draft',
                'created_by' => $request->user()->getKey(),
                'updated_by' => $request->user()->getKey(),
            ]);
            $item->workflowEvents()->create([
                'action' => 'intake_created',
                'to_status' => 'draft',
                'actor_user_id' => $request->user()->getKey(),
            ]);

            return $item;
        });

        $audit->record(
            $request->user(),
            'document.request_created',
            'success',
            $request,
            'document.create',
            'document_request',
            $documentRequest->public_id,
            ['template_code' => Str::upper($validated['template_code'])],
        );

        return response()->json([
            'data' => $response->request($documentRequest, $request->user()),
        ], 201);
    }

    public function show(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.view', $documentRequest);
        $documentRequest->load(['workflowEvents' => fn ($builder) => $builder->oldest()]);

        return response()->json([
            'data' => [
                ...$response->request($documentRequest, $request->user()),
                'workflow' => $documentRequest->workflowEvents->map(fn ($event) => [
                    'action' => $event->action,
                    'from_status' => $event->from_status,
                    'to_status' => $event->to_status,
                    'notes' => $event->notes,
                    'at' => $event->created_at?->toIso8601String(),
                ]),
            ],
        ]);
    }

    public function update(
        Request $request,
        DocumentRequest $documentRequest,
        ScopedAuthorization $authorization,
        DocumentResponse $response,
    ): JsonResponse {
        $authorization->authorize($request, 'document.update', $documentRequest);
        $validated = $request->validate([
            'purpose' => ['sometimes', 'string', 'max:500'],
            'request_data' => ['sometimes', 'array', 'max:100'],
        ]);
        if (isset($validated['request_data'])) {
            $this->validateRequiredFields($documentRequest->templateVersion, $validated['request_data']);
        }

        $documentRequest = DB::transaction(function () use ($documentRequest, $validated, $request): DocumentRequest {
            $locked = DocumentRequest::query()->lockForUpdate()->findOrFail($documentRequest->getKey());
            if (! in_array($locked->status, ['draft', 'returned'], true)) {
                throw ValidationException::withMessages([
                    'status' => 'Only draft or returned requests may be edited.',
                ]);
            }
            $locked->update([...$validated, 'updated_by' => $request->user()->getKey()]);

            return $locked->refresh();
        });

        return response()->json([
            'data' => $response->request($documentRequest, $request->user()),
        ]);
    }

    private function validateRequiredFields(DocumentTemplateVersion $version, array $data): void
    {
        $missing = collect($version->required_fields)
            ->reject(function (string $field) use ($data): bool {
                $value = Arr::get($data, $field);

                return Arr::has($data, $field)
                    && is_scalar($value)
                    && trim((string) $value) !== '';
            })
            ->values()
            ->all();

        if ($missing !== []) {
            throw ValidationException::withMessages([
                'request_data' => 'Missing template fields: '.implode(', ', $missing),
            ]);
        }
    }
}

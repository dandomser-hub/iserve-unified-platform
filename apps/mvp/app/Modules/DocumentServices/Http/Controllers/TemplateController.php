<?php

namespace App\Modules\DocumentServices\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\DocumentServices\Models\DocumentTemplate;
use App\Modules\DocumentServices\Models\DocumentTemplateVersion;
use App\Services\AuthorizationAudit;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class TemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = DocumentTemplate::query()->with(['versions' => fn ($builder) => $builder
            ->orderByDesc('version_number')]);

        if ($request->user()->barangay_code !== null) {
            $query->where('barangay_code', $request->user()->barangay_code);
        } elseif ($request->user()->municipality_code !== null) {
            $query->where('municipality_code', $request->user()->municipality_code);
        } else {
            $query->whereRaw('1 = 0');
        }

        return response()->json([
            'data' => $query->orderBy('name')->get()->map(fn (DocumentTemplate $template) => $this->response($template)),
        ]);
    }

    public function store(Request $request, AuthorizationAudit $audit): JsonResponse
    {
        $validated = $request->validate($this->rules(includeScope: true));
        $this->authorizeScope($request, $audit, $validated['barangay_code'], $validated['municipality_code']);

        $template = DB::transaction(function () use ($validated, $request): DocumentTemplate {
            $template = DocumentTemplate::query()->create([
                'public_id' => (string) Str::uuid(),
                'code' => Str::upper($validated['code']),
                'barangay_code' => $validated['barangay_code'],
                'municipality_code' => $validated['municipality_code'],
                'name' => $validated['name'],
                'created_by' => $request->user()->getKey(),
            ]);
            $template->versions()->create($this->versionValues($validated, $request, 1));

            return $template;
        });

        $audit->record(
            $request->user(),
            'document.template_created',
            'success',
            $request,
            'document.template.manage',
            'document_template',
            $template->public_id,
            ['code' => $template->code],
        );

        return response()->json(['data' => $this->response($template->load('versions'))], 201);
    }

    public function addVersion(
        Request $request,
        DocumentTemplate $template,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $this->authorizeScope($request, $audit, $template->barangay_code, $template->municipality_code);
        $validated = $request->validate($this->rules());

        $version = DB::transaction(function () use ($template, $validated, $request): DocumentTemplateVersion {
            $locked = DocumentTemplate::query()->lockForUpdate()->findOrFail($template->getKey());
            $next = ((int) $locked->versions()->max('version_number')) + 1;

            return $locked->versions()->create($this->versionValues($validated, $request, $next));
        });

        return response()->json(['data' => $this->versionResponse($version)], 201);
    }

    public function publish(
        Request $request,
        DocumentTemplate $template,
        DocumentTemplateVersion $version,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $this->authorizeScope($request, $audit, $template->barangay_code, $template->municipality_code);
        abort_unless($version->document_template_id === $template->getKey(), 404);

        $version = DB::transaction(function () use ($template, $version, $request): DocumentTemplateVersion {
            $lockedTemplate = DocumentTemplate::query()
                ->lockForUpdate()
                ->findOrFail($template->getKey());
            $locked = DocumentTemplateVersion::query()->lockForUpdate()->findOrFail($version->getKey());
            if ($locked->status !== 'draft') {
                abort(422, 'Only a draft template version can be published.');
            }
            $lockedTemplate->versions()
                ->where('status', 'published')
                ->update(['status' => 'retired']);
            $locked->update([
                'status' => 'published',
                'published_by' => $request->user()->getKey(),
                'published_at' => now(),
            ]);

            return $locked->refresh();
        });

        $audit->record(
            $request->user(),
            'document.template_published',
            'success',
            $request,
            'document.template.manage',
            'document_template_version',
            $version->getKey(),
            ['template_code' => $template->code, 'version' => $version->version_number],
        );

        return response()->json(['data' => $this->versionResponse($version)]);
    }

    private function rules(bool $includeScope = false): array
    {
        return [
            ...($includeScope ? [
                'code' => ['required', 'string', 'max:64', 'regex:/^[A-Za-z0-9_-]+$/'],
                'name' => ['required', 'string', 'max:255'],
                'barangay_code' => ['required', 'string', 'max:64'],
                'municipality_code' => ['required', 'string', 'max:64'],
            ] : []),
            'title' => ['required', 'string', 'max:255'],
            'body_template' => ['required', 'string', 'max:20000'],
            'required_fields' => ['required', 'array', 'max:50'],
            'required_fields.*' => ['string', 'max:64', 'distinct'],
            'requirement_codes' => ['required', 'array', 'max:50'],
            'requirement_codes.*' => ['string', 'max:64', 'distinct'],
            'fee_amount' => ['required', 'numeric', 'min:0', 'max:9999999.99'],
            'exemption_codes' => ['present', 'array', 'max:20'],
            'exemption_codes.*' => [
                'string',
                Rule::in(config('document_services.exemption_codes')),
                'distinct',
            ],
        ];
    }

    private function versionValues(array $validated, Request $request, int $number): array
    {
        return [
            'version_number' => $number,
            'status' => 'draft',
            'title' => $validated['title'],
            'body_template' => $validated['body_template'],
            'required_fields' => array_values($validated['required_fields']),
            'requirement_codes' => array_values($validated['requirement_codes']),
            'fee_amount' => $validated['fee_amount'],
            'exemption_codes' => array_values($validated['exemption_codes']),
            'created_by' => $request->user()->getKey(),
        ];
    }

    private function authorizeScope(
        Request $request,
        AuthorizationAudit $audit,
        string $barangayCode,
        string $municipalityCode,
    ): void {
        $user = $request->user();
        $allowed = $user->barangay_code !== null
            ? hash_equals($user->barangay_code, $barangayCode)
            : ($user->municipality_code !== null
                && hash_equals($user->municipality_code, $municipalityCode));

        if (! $allowed) {
            $audit->denied($user, 'document.template.manage.scope', $request);
            $request->attributes->set('authorization_denial_audited', true);
            throw new AuthorizationException('The template is outside the assigned geographic scope.');
        }
    }

    private function response(DocumentTemplate $template): array
    {
        return [
            'public_id' => $template->public_id,
            'code' => $template->code,
            'name' => $template->name,
            'barangay_code' => $template->barangay_code,
            'is_active' => $template->is_active,
            'versions' => $template->versions->map(fn (DocumentTemplateVersion $version) => $this->versionResponse($version)),
        ];
    }

    private function versionResponse(DocumentTemplateVersion $version): array
    {
        return [
            'id' => $version->getKey(),
            'version_number' => $version->version_number,
            'status' => $version->status,
            'title' => $version->title,
            'required_fields' => $version->required_fields,
            'requirement_codes' => $version->requirement_codes,
            'fee_amount' => (string) $version->fee_amount,
            'exemption_codes' => $version->exemption_codes,
            'published_at' => $version->published_at?->toIso8601String(),
        ];
    }
}

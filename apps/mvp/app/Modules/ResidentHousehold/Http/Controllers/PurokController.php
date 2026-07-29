<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Purok;
use App\Services\AuthorizationAudit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PurokController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Purok::query()->orderBy('name');

        if ($request->user()->barangay_code !== null) {
            $query->where('barangay_code', $request->user()->barangay_code);
        } elseif ($request->user()->municipality_code !== null) {
            $query->where('municipality_code', $request->user()->municipality_code);
        } else {
            $query->whereRaw('1 = 0');
        }

        return response()->json([
            'data' => $query->get()->map(fn (Purok $purok): array => $this->response($purok)),
        ]);
    }

    public function store(Request $request, AuthorizationAudit $audit): JsonResponse
    {
        $validated = $request->validate([
            'barangay_code' => [
                Rule::requiredIf($request->user()->barangay_code === null),
                'nullable',
                'string',
                'max:64',
            ],
            'code' => ['required', 'string', 'max:64'],
            'name' => ['required', 'string', 'max:120'],
            'sitio_name' => ['nullable', 'string', 'max:120'],
        ]);

        $scope = $this->scope($request, $validated['barangay_code'] ?? null, $audit);
        $purok = Purok::query()->create([
            ...$scope,
            'code' => trim($validated['code']),
            'name' => trim($validated['name']),
            'sitio_name' => isset($validated['sitio_name']) ? trim($validated['sitio_name']) : null,
            'is_active' => true,
        ]);

        $audit->record(
            $request->user(),
            'resident.reference_created',
            'success',
            $request,
            'resident.reference.manage',
            'purok',
            $purok->getKey(),
            ['barangay_code' => $purok->barangay_code, 'code' => $purok->code],
        );

        return response()->json(['data' => $this->response($purok)], 201);
    }

    public function update(
        Request $request,
        Purok $purok,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $this->assertScope($request, $purok, $audit);
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'sitio_name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'is_active' => ['sometimes', 'required', 'boolean'],
        ]);

        $purok->update($validated);
        $audit->record(
            $request->user(),
            'resident.reference_updated',
            'success',
            $request,
            'resident.reference.manage',
            'purok',
            $purok->getKey(),
            ['changed_fields' => array_keys($validated)],
        );

        return response()->json(['data' => $this->response($purok->refresh())]);
    }

    /**
     * @return array{barangay_code: string, municipality_code: string}
     */
    private function scope(
        Request $request,
        ?string $requestedBarangayCode,
        AuthorizationAudit $audit,
    ): array
    {
        $actor = $request->user();
        if ($actor->municipality_code === null) {
            $audit->denied($actor, 'resident.reference.manage', $request);
            $request->attributes->set('authorization_denial_audited', true);
            abort(403);
        }

        return [
            'barangay_code' => $actor->barangay_code ?? (string) $requestedBarangayCode,
            'municipality_code' => $actor->municipality_code,
        ];
    }

    private function assertScope(
        Request $request,
        Purok $purok,
        AuthorizationAudit $audit,
    ): void
    {
        $actor = $request->user();
        $allowed = $actor->barangay_code !== null
            ? hash_equals($actor->barangay_code, $purok->barangay_code)
            : $actor->municipality_code !== null
                && hash_equals($actor->municipality_code, $purok->municipality_code);

        if (! $allowed) {
            $audit->denied($actor, 'resident.reference.manage', $request);
            $request->attributes->set('authorization_denial_audited', true);
            abort(403);
        }
    }

    private function response(Purok $purok): array
    {
        return [
            'id' => $purok->getKey(),
            'barangay_code' => $purok->barangay_code,
            'code' => $purok->code,
            'name' => $purok->name,
            'sitio_name' => $purok->sitio_name,
            'is_active' => $purok->is_active,
        ];
    }
}

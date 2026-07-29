<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Services\DuplicateCandidateDetector;
use App\Modules\ResidentHousehold\Services\MasterDataIdentifier;
use App\Modules\ResidentHousehold\Services\PurposeLimitedResidentLookup;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ResidentController extends Controller
{
    public function index(Request $request, PurposeLimitedResidentLookup $lookup): JsonResponse
    {
        $validated = $request->validate([
            'purpose' => ['required', 'string', Rule::in(array_keys(config('resident_household.lookup_purposes')))],
            'query' => ['required', 'string', 'min:2', 'max:120'],
        ]);

        $request->attributes->set('authorization_ability', 'resident.lookup.purpose');
        $lookup->authorizePurpose($request->user(), $validated['purpose'], $request);
        $term = str_replace(['%', '_'], '', trim($validated['query']));
        abort_if(mb_strlen($term) < 2, 422, 'Enter at least two searchable characters.');

        $residents = $lookup->scopedQuery($request->user())
            ->where(function ($query) use ($term): void {
                $query
                    ->where('resident_number', 'like', "%{$term}%")
                    ->orWhere('first_name', 'like', "%{$term}%")
                    ->orWhere('last_name', 'like', "%{$term}%");
            })
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->limit(25)
            ->get()
            ->map(fn (Resident $resident): array => $this->summary($resident, $validated['purpose']))
            ->values();

        $lookup->record($request->user(), $validated['purpose'], $term, $residents->count());

        return response()->json([
            'data' => $residents,
            'meta' => [
                'purpose' => $validated['purpose'],
                'result_count' => $residents->count(),
                'limit' => 25,
            ],
        ]);
    }

    public function store(
        Request $request,
        MasterDataIdentifier $identifiers,
        DuplicateCandidateDetector $duplicates,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:120'],
            'middle_name' => ['nullable', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'suffix' => ['nullable', 'string', 'max:30'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'sex' => ['required', 'string', 'max:32'],
            'civil_status' => ['nullable', 'string', 'max:32'],
            'mobile_number' => ['nullable', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'privacy_notice.notice_version' => ['required', 'string', 'max:40'],
            'privacy_notice.purpose_code' => ['required', 'string', 'max:80'],
            'privacy_notice.acknowledgement_method' => [
                'required',
                'string',
                Rule::in(config('resident_household.privacy_acknowledgement_methods')),
            ],
            'privacy_notice.acknowledged_at' => ['required', 'date'],
            'privacy_notice.notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $actor = $request->user();
        if ($actor->barangay_code === null || $actor->municipality_code === null) {
            $audit->denied($actor, 'resident.create', $request);
            $request->attributes->set('authorization_denial_audited', true);
            abort(403);
        }

        [$resident, $candidateCount] = DB::transaction(function () use (
            $validated,
            $actor,
            $identifiers,
            $duplicates,
        ): array {
            $resident = Resident::query()->create([
                'public_id' => (string) Str::uuid(),
                'resident_number' => $identifiers->residentNumber($actor->barangay_code),
                'barangay_code' => $actor->barangay_code,
                'municipality_code' => $actor->municipality_code,
                'first_name' => trim($validated['first_name']),
                'middle_name' => isset($validated['middle_name']) ? trim($validated['middle_name']) : null,
                'last_name' => trim($validated['last_name']),
                'suffix' => isset($validated['suffix']) ? trim($validated['suffix']) : null,
                'birth_date' => $validated['birth_date'],
                'sex' => $validated['sex'],
                'civil_status' => $validated['civil_status'] ?? null,
                'mobile_number' => $validated['mobile_number'] ?? null,
                'email' => $validated['email'] ?? null,
                'status' => 'active',
                'classification' => 'confidential',
                'created_by' => $actor->getKey(),
                'updated_by' => $actor->getKey(),
            ]);

            $resident->statusHistories()->create([
                'from_status' => null,
                'to_status' => 'active',
                'effective_on' => now()->toDateString(),
                'reason' => 'initial_registration',
                'recorded_by' => $actor->getKey(),
            ]);

            $resident->privacyAcknowledgements()->create([
                ...$validated['privacy_notice'],
                'recorded_by' => $actor->getKey(),
            ]);

            return [$resident, count($duplicates->detectFor($resident))];
        });

        $audit->record(
            $actor,
            'resident.created',
            'success',
            $request,
            'resident.create',
            'resident',
            $resident->public_id,
            ['duplicate_candidate_count' => $candidateCount],
        );

        return response()->json([
            'data' => $this->detail($resident->fresh(), 'resident_service'),
            'meta' => ['duplicate_candidate_count' => $candidateCount],
        ], 201);
    }

    public function show(
        Request $request,
        Resident $resident,
        PurposeLimitedResidentLookup $lookup,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $validated = $request->validate([
            'purpose' => ['required', 'string', Rule::in(array_keys(config('resident_household.lookup_purposes')))],
        ]);

        $authorization->authorize($request, 'resident.view', $resident);
        $request->attributes->set('authorization_ability', 'resident.lookup.purpose');
        $lookup->authorizePurpose($request->user(), $validated['purpose'], $request);
        $lookup->record($request->user(), $validated['purpose'], $resident->public_id, 1);

        $resident->load([
            'memberships' => fn ($query) => $query->with('household.purok')->latest('started_on'),
            'statusHistories' => fn ($query) => $query->latest('effective_on'),
            'privacyAcknowledgements' => fn ($query) => $query->latest('acknowledged_at'),
        ]);

        return response()->json(['data' => $this->detail($resident, $validated['purpose'])]);
    }

    public function update(
        Request $request,
        Resident $resident,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
        DuplicateCandidateDetector $duplicates,
    ): JsonResponse {
        $authorization->authorize($request, 'resident.update', $resident);
        $validated = $request->validate([
            'first_name' => ['sometimes', 'required', 'string', 'max:120'],
            'middle_name' => ['sometimes', 'nullable', 'string', 'max:120'],
            'last_name' => ['sometimes', 'required', 'string', 'max:120'],
            'suffix' => ['sometimes', 'nullable', 'string', 'max:30'],
            'birth_date' => ['sometimes', 'required', 'date', 'before_or_equal:today'],
            'sex' => ['sometimes', 'required', 'string', 'max:32'],
            'civil_status' => ['sometimes', 'nullable', 'string', 'max:32'],
            'mobile_number' => ['sometimes', 'nullable', 'string', 'max:32'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
        ]);

        $resident->update([
            ...$validated,
            'updated_by' => $request->user()->getKey(),
        ]);
        $candidateCount = count($duplicates->detectFor($resident->refresh()));

        $audit->record(
            $request->user(),
            'resident.updated',
            'success',
            $request,
            'resident.update',
            'resident',
            $resident->public_id,
            [
                'changed_fields' => array_keys($validated),
                'duplicate_candidate_count' => $candidateCount,
            ],
        );

        return response()->json([
            'data' => $this->detail($resident->refresh(), 'resident_service'),
            'meta' => ['duplicate_candidate_count' => $candidateCount],
        ]);
    }

    private function summary(Resident $resident, string $purpose): array
    {
        $summary = [
            'public_id' => $resident->public_id,
            'resident_number' => $resident->resident_number,
            'name' => trim("{$resident->last_name}, {$resident->first_name} {$resident->middle_name}"),
            'sex' => $resident->sex,
            'status' => $resident->status,
        ];

        if (in_array($purpose, ['resident_service', 'case_management', 'data_quality'], true)) {
            $summary['birth_date'] = $resident->birth_date?->toDateString();
        } else {
            $summary['age'] = $resident->birth_date?->age;
        }

        return $summary;
    }

    private function detail(Resident $resident, string $purpose): array
    {
        $base = $this->summary($resident, $purpose);

        if ($purpose === 'drrm_preparedness') {
            return [
                ...$base,
                'mobile_number' => $resident->mobile_number,
                'memberships' => $this->membershipData($resident),
            ];
        }

        if (in_array($purpose, ['gad_planning', 'governance_oversight'], true)) {
            return [
                ...$base,
                'civil_status' => $resident->civil_status,
            ];
        }

        return [
            ...$base,
            'middle_name' => $resident->middle_name,
            'suffix' => $resident->suffix,
            'civil_status' => $resident->civil_status,
            'mobile_number' => $resident->mobile_number,
            'email' => $resident->email,
            'classification' => $resident->classification,
            'memberships' => $this->membershipData($resident),
            'status_history' => $resident->relationLoaded('statusHistories')
                ? $resident->statusHistories->map(fn ($history): array => [
                    'from_status' => $history->from_status,
                    'to_status' => $history->to_status,
                    'effective_on' => $history->effective_on?->toDateString(),
                    'reason' => $history->reason,
                    'notes' => $history->notes,
                ])
                : null,
            'privacy_acknowledgements' => $resident->relationLoaded('privacyAcknowledgements')
                ? $resident->privacyAcknowledgements->map(fn ($acknowledgement): array => [
                    'notice_version' => $acknowledgement->notice_version,
                    'purpose_code' => $acknowledgement->purpose_code,
                    'acknowledgement_method' => $acknowledgement->acknowledgement_method,
                    'acknowledged_at' => $acknowledgement->acknowledged_at?->toIso8601String(),
                    'withdrawn_at' => $acknowledgement->withdrawn_at?->toIso8601String(),
                ])
                : null,
        ];
    }

    private function membershipData(Resident $resident): ?Collection
    {
        if (! $resident->relationLoaded('memberships')) {
            return null;
        }

        return $resident->memberships->map(fn ($membership): array => [
            'membership_id' => $membership->getKey(),
            'household_public_id' => $membership->household?->public_id,
            'household_number' => $membership->household?->household_number,
            'address_line' => $membership->household?->address_line,
            'purok' => $membership->household?->purok?->name,
            'relationship_to_head' => $membership->relationship_to_head,
            'is_household_head' => $membership->is_household_head,
            'started_on' => $membership->started_on?->toDateString(),
            'ended_on' => $membership->ended_on?->toDateString(),
        ]);
    }
}

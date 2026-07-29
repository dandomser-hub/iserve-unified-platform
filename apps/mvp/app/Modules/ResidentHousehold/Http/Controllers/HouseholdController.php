<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Household;
use App\Modules\ResidentHousehold\Models\Purok;
use App\Modules\ResidentHousehold\Services\MasterDataIdentifier;
use App\Modules\ResidentHousehold\Services\PurposeLimitedResidentLookup;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class HouseholdController extends Controller
{
    public function index(Request $request, PurposeLimitedResidentLookup $lookup): JsonResponse
    {
        $validated = $request->validate([
            'purpose' => ['required', 'string', Rule::in(array_keys(config('resident_household.lookup_purposes')))],
            'query' => ['nullable', 'string', 'max:120'],
        ]);

        $request->attributes->set('authorization_ability', 'resident.lookup.purpose');
        $lookup->authorizePurpose($request->user(), $validated['purpose'], $request);
        $term = str_replace(['%', '_'], '', trim($validated['query'] ?? ''));

        $query = Household::query()->with('purok:id,code,name,sitio_name');
        if ($request->user()->barangay_code !== null) {
            $query->where('barangay_code', $request->user()->barangay_code);
        } elseif ($request->user()->municipality_code !== null) {
            $query->where('municipality_code', $request->user()->municipality_code);
        } else {
            $query->whereRaw('1 = 0');
        }

        if ($term !== '') {
            $query->where(function ($builder) use ($term): void {
                $builder
                    ->where('household_number', 'like', "%{$term}%")
                    ->orWhere('address_line', 'like', "%{$term}%");
            });
        }

        $households = $query->orderBy('household_number')->limit(25)->get();
        $lookup->record($request->user(), $validated['purpose'], "household:{$term}", $households->count());

        return response()->json([
            'data' => $households->map(fn (Household $household): array => $this->summary($household)),
            'meta' => ['purpose' => $validated['purpose'], 'result_count' => $households->count()],
        ]);
    }

    public function store(
        Request $request,
        MasterDataIdentifier $identifiers,
        AuthorizationAudit $audit,
    ): JsonResponse {
        $validated = $request->validate([
            'purok_id' => ['nullable', 'integer', 'exists:puroks,id'],
            'address_line' => ['required', 'string', 'max:255'],
            'landmark' => ['nullable', 'string', 'max:255'],
        ]);

        $actor = $request->user();
        if ($actor->barangay_code === null || $actor->municipality_code === null) {
            $audit->denied($actor, 'resident.create', $request);
            $request->attributes->set('authorization_denial_audited', true);
            abort(403);
        }

        if (isset($validated['purok_id'])) {
            $purok = Purok::query()->findOrFail($validated['purok_id']);
            $allowed = hash_equals($actor->barangay_code, $purok->barangay_code)
                && hash_equals($actor->municipality_code, $purok->municipality_code);

            if (! $allowed) {
                $audit->denied($actor, 'resident.create', $request);
                $request->attributes->set('authorization_denial_audited', true);
                abort(403);
            }
        }

        $household = Household::query()->create([
            'public_id' => (string) Str::uuid(),
            'household_number' => $identifiers->householdNumber($actor->barangay_code),
            'barangay_code' => $actor->barangay_code,
            'municipality_code' => $actor->municipality_code,
            'purok_id' => $validated['purok_id'] ?? null,
            'address_line' => trim($validated['address_line']),
            'landmark' => $validated['landmark'] ?? null,
            'status' => 'active',
            'classification' => 'confidential',
        ]);

        $audit->record(
            $actor,
            'household.created',
            'success',
            $request,
            'resident.create',
            'household',
            $household->public_id,
        );

        return response()->json(['data' => $this->summary($household->load('purok'))], 201);
    }

    public function show(
        Request $request,
        Household $household,
        PurposeLimitedResidentLookup $lookup,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $validated = $request->validate([
            'purpose' => ['required', 'string', Rule::in(array_keys(config('resident_household.lookup_purposes')))],
        ]);

        $authorization->authorize($request, 'resident.view', $household);
        $request->attributes->set('authorization_ability', 'resident.lookup.purpose');
        $lookup->authorizePurpose($request->user(), $validated['purpose'], $request);
        $lookup->record($request->user(), $validated['purpose'], $household->public_id, 1);

        $household->load([
            'purok',
            'memberships' => fn ($query) => $query->with('resident')->latest('started_on'),
        ]);

        return response()->json([
            'data' => [
                ...$this->summary($household),
                'landmark' => $household->landmark,
                'memberships' => $household->memberships->map(fn ($membership): array => [
                    'membership_id' => $membership->getKey(),
                    'resident_public_id' => $membership->resident?->public_id,
                    'resident_number' => $membership->resident?->resident_number,
                    'resident_name' => $membership->resident === null
                        ? null
                        : trim("{$membership->resident->last_name}, {$membership->resident->first_name}"),
                    'relationship_to_head' => $membership->relationship_to_head,
                    'is_household_head' => $membership->is_household_head,
                    'started_on' => $membership->started_on?->toDateString(),
                    'ended_on' => $membership->ended_on?->toDateString(),
                ]),
            ],
        ]);
    }

    private function summary(Household $household): array
    {
        return [
            'public_id' => $household->public_id,
            'household_number' => $household->household_number,
            'address_line' => $household->address_line,
            'status' => $household->status,
            'purok' => $household->purok === null ? null : [
                'code' => $household->purok->code,
                'name' => $household->purok->name,
                'sitio_name' => $household->purok->sitio_name,
            ],
        ];
    }
}

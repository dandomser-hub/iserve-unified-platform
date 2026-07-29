<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Household;
use App\Modules\ResidentHousehold\Models\HouseholdMembership;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Services\HouseholdMembershipManager;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HouseholdMembershipController extends Controller
{
    public function store(
        Request $request,
        Household $household,
        HouseholdMembershipManager $memberships,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $authorization->authorize($request, 'resident.update', $household);

        $validated = $request->validate([
            'resident_public_id' => ['required', 'uuid', 'exists:residents,public_id'],
            'relationship_to_head' => ['required', 'string', 'max:64'],
            'is_household_head' => ['required', 'boolean'],
            'started_on' => ['required', 'date'],
        ]);

        $resident = Resident::query()->where('public_id', $validated['resident_public_id'])->firstOrFail();
        $authorization->authorize($request, 'resident.update', $resident);
        abort_unless(
            hash_equals($household->barangay_code, $resident->barangay_code)
            && hash_equals($household->municipality_code, $resident->municipality_code),
            422,
        );

        $membership = $memberships->start(
            $household,
            $resident,
            $request->user(),
            $validated['relationship_to_head'],
            $validated['is_household_head'],
            $validated['started_on'],
        );

        $audit->record(
            $request->user(),
            'household.membership_started',
            'success',
            $request,
            'resident.update',
            'household_membership',
            $membership->getKey(),
            [
                'resident_public_id' => $resident->public_id,
                'household_public_id' => $household->public_id,
            ],
        );

        return response()->json(['data' => $this->response($membership)], 201);
    }

    public function end(
        Request $request,
        HouseholdMembership $membership,
        HouseholdMembershipManager $memberships,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $membership->loadMissing('household');
        $authorization->authorize($request, 'resident.update', $membership->household);

        $validated = $request->validate([
            'ended_on' => ['required', 'date', 'after_or_equal:'.$membership->started_on->toDateString()],
            'reason' => ['required', 'string', 'max:255'],
        ]);

        $ended = $memberships->end(
            $membership,
            $request->user(),
            $validated['ended_on'],
            $validated['reason'],
        );

        $audit->record(
            $request->user(),
            'household.membership_ended',
            'success',
            $request,
            'resident.update',
            'household_membership',
            $membership->getKey(),
            ['reason' => $validated['reason']],
        );

        return response()->json(['data' => $this->response($ended)]);
    }

    private function response(HouseholdMembership $membership): array
    {
        return [
            'membership_id' => $membership->getKey(),
            'relationship_to_head' => $membership->relationship_to_head,
            'is_household_head' => $membership->is_household_head,
            'started_on' => $membership->started_on?->toDateString(),
            'ended_on' => $membership->ended_on?->toDateString(),
            'change_reason' => $membership->change_reason,
        ];
    }
}

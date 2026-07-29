<?php

namespace App\Modules\ResidentHousehold\Services;

use App\Models\User;
use App\Modules\ResidentHousehold\Models\Household;
use App\Modules\ResidentHousehold\Models\HouseholdMembership;
use App\Modules\ResidentHousehold\Models\Resident;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HouseholdMembershipManager
{
    public function start(
        Household $household,
        Resident $resident,
        User $actor,
        string $relationship,
        bool $isHead,
        string $startedOn,
    ): HouseholdMembership {
        return DB::transaction(function () use (
            $household,
            $resident,
            $actor,
            $relationship,
            $isHead,
            $startedOn,
        ): HouseholdMembership {
            Resident::query()->lockForUpdate()->findOrFail($resident->getKey());
            Household::query()->lockForUpdate()->findOrFail($household->getKey());

            if ($resident->memberships()->whereNull('ended_on')->lockForUpdate()->first() !== null) {
                throw ValidationException::withMessages([
                    'resident_public_id' => 'End the resident’s current household membership first.',
                ]);
            }

            if ($isHead && $household->memberships()
                ->where('is_household_head', true)
                ->whereNull('ended_on')
                ->lockForUpdate()
                ->first() !== null) {
                throw ValidationException::withMessages([
                    'is_household_head' => 'This household already has an active household head.',
                ]);
            }

            return $household->memberships()->create([
                'resident_id' => $resident->getKey(),
                'relationship_to_head' => $relationship,
                'is_household_head' => $isHead,
                'started_on' => $startedOn,
                'recorded_by' => $actor->getKey(),
            ]);
        });
    }

    public function end(
        HouseholdMembership $membership,
        User $actor,
        string $endedOn,
        string $reason,
    ): HouseholdMembership {
        return DB::transaction(function () use (
            $membership,
            $actor,
            $endedOn,
            $reason,
        ): HouseholdMembership {
            $lockedMembership = HouseholdMembership::query()
                ->lockForUpdate()
                ->findOrFail($membership->getKey());

            if ($lockedMembership->ended_on !== null) {
                throw ValidationException::withMessages([
                    'membership' => 'The household membership has already ended.',
                ]);
            }

            $lockedMembership->update([
                'ended_on' => $endedOn,
                'change_reason' => $reason,
                'recorded_by' => $actor->getKey(),
            ]);

            return $lockedMembership->refresh();
        });
    }
}

<?php

namespace App\Modules\ResidentHousehold\Services;

use App\Models\User;
use App\Modules\ResidentHousehold\Models\Resident;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ResidentLifecycle
{
    public function change(
        Resident $resident,
        User $actor,
        string $status,
        string $effectiveOn,
        string $reason,
        ?string $notes,
    ): Resident {
        return DB::transaction(function () use (
            $resident,
            $actor,
            $status,
            $effectiveOn,
            $reason,
            $notes,
        ): Resident {
            $lockedResident = Resident::query()
                ->lockForUpdate()
                ->findOrFail($resident->getKey());
            $allowedTransitions = config(
                "resident_household.resident_status_transitions.{$lockedResident->status}",
                [],
            );

            if (! in_array($status, $allowedTransitions, true)) {
                throw ValidationException::withMessages([
                    'status' => "Transition from {$lockedResident->status} to {$status} is not allowed.",
                ]);
            }

            $fromStatus = $lockedResident->status;

            $lockedResident->update([
                'status' => $status,
                'updated_by' => $actor->getKey(),
            ]);

            $lockedResident->statusHistories()->create([
                'from_status' => $fromStatus,
                'to_status' => $status,
                'effective_on' => $effectiveOn,
                'reason' => $reason,
                'notes' => $notes,
                'recorded_by' => $actor->getKey(),
            ]);

            return $lockedResident->refresh();
        });
    }
}

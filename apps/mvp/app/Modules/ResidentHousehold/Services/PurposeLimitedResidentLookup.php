<?php

namespace App\Modules\ResidentHousehold\Services;

use App\Models\User;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Models\ResidentLookupEvent;
use App\Services\AuthorizationAudit;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PurposeLimitedResidentLookup
{
    public function __construct(
        private readonly AuthorizationAudit $audit,
    ) {}

    public function authorizePurpose(User $user, string $purpose, Request $request): void
    {
        $allowedRoles = config("resident_household.lookup_purposes.{$purpose}");

        if (! is_array($allowedRoles) || array_intersect($user->roleCodes(), $allowedRoles) === []) {
            $this->audit->denied($user, 'resident.lookup.purpose', $request);
            $request->attributes->set('authorization_denial_audited', true);

            throw new AuthorizationException('The declared lookup purpose is not allowed for this role.');
        }
    }

    public function scopedQuery(User $user): Builder
    {
        $query = Resident::query();

        if ($user->barangay_code !== null) {
            return $query->where('barangay_code', $user->barangay_code);
        }

        if ($user->municipality_code !== null) {
            return $query->where('municipality_code', $user->municipality_code);
        }

        return $query->whereRaw('1 = 0');
    }

    public function record(User $user, string $purpose, string $query, int $resultCount): void
    {
        ResidentLookupEvent::query()->create([
            'actor_user_id' => $user->getKey(),
            'purpose_code' => $purpose,
            'query_hash' => hash('sha256', mb_strtolower(trim($query))),
            'result_count' => $resultCount,
            'barangay_code' => $user->barangay_code,
            'municipality_code' => $user->municipality_code,
        ]);
    }
}

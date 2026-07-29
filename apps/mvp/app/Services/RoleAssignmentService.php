<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use DomainException;
use Illuminate\Support\Facades\DB;

class RoleAssignmentService
{
    /**
     * @param  list<string>  $roleCodes
     */
    public function sync(User $user, array $roleCodes): void
    {
        $roleCodes = array_values(array_unique($roleCodes));
        $exclusiveRoles = array_intersect(
            $roleCodes,
            config('authorization.exclusive_roles', []),
        );

        if ($exclusiveRoles !== [] && count($roleCodes) > 1) {
            throw new DomainException(
                'Administrative and external-review roles require a dedicated account.',
            );
        }

        $roles = Role::query()->whereIn('code', $roleCodes)->get();

        if ($roles->count() !== count($roleCodes)) {
            throw new DomainException('One or more role codes are not approved.');
        }

        DB::transaction(
            fn (): array => $user->roles()->sync($roles->modelKeys()),
        );
    }
}

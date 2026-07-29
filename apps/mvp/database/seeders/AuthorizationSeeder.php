<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuthorizationSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            foreach (config('authorization.permissions', []) as $code => $description) {
                Permission::query()->updateOrCreate(
                    ['code' => $code],
                    ['description' => $description],
                );
            }

            foreach (config('authorization.roles', []) as $code => $definition) {
                $role = Role::query()->updateOrCreate(
                    ['code' => $code],
                    ['name' => $definition['name']],
                );

                $permissionIds = Permission::query()
                    ->whereIn('code', $definition['permissions'])
                    ->pluck('id');

                $role->permissions()->sync($permissionIds);
            }
        });
    }
}

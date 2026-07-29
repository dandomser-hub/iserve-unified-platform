<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\RoleAssignmentService;
use Database\Seeders\AuthorizationSeeder;
use DomainException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAssignmentServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_administrator_requires_a_dedicated_account(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $user = User::factory()->create();

        $this->expectException(DomainException::class);

        (new RoleAssignmentService)->sync($user, [
            'system_administrator',
            'punong_barangay',
        ]);
    }

    public function test_approved_business_roles_can_be_assigned(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $user = User::factory()->create();

        (new RoleAssignmentService)->sync($user, [
            'barangay_secretary',
            'barangay_treasurer',
        ]);

        $this->assertEqualsCanonicalizing(
            ['barangay_secretary', 'barangay_treasurer'],
            $user->roles()->pluck('code')->all(),
        );
    }
}

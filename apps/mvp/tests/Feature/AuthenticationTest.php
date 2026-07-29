<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_csrf_bootstrap_and_protected_identity_routes_are_available(): void
    {
        $this->getJson('/api/v1/auth/csrf')
            ->assertOk()
            ->assertJsonStructure(['csrf_token']);

        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_active_user_can_login_and_session_is_regenerated(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $user = User::factory()->create([
            'email' => 'secretary@example.test',
            'password' => Hash::make('correct-password'),
        ]);
        $user->roles()->attach(
            Role::query()->where('code', 'barangay_secretary')->firstOrFail(),
        );

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'secretary@example.test',
            'password' => 'correct-password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('user.id', $user->getKey())
            ->assertJsonPath('roles.0', 'barangay_secretary')
            ->assertJsonFragment(['resident.create']);
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->last_login_at);
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'inactive@example.test',
            'password' => Hash::make('correct-password'),
            'is_active' => false,
        ]);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'inactive@example.test',
            'password' => 'correct-password',
        ])->assertUnprocessable();

        $this->assertGuest();
    }

    public function test_repeated_failures_lock_an_active_account(): void
    {
        $user = User::factory()->create([
            'email' => 'locked@example.test',
            'password' => Hash::make('correct-password'),
        ]);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'locked@example.test',
                'password' => 'wrong-password',
            ])->assertUnprocessable();
        }

        $this->assertTrue($user->fresh()->locked_until->isFuture());
    }

    public function test_logout_invalidates_the_authenticated_session(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/v1/auth/logout')
            ->assertOk()
            ->assertJson(['status' => 'signed_out']);

        $this->assertGuest();
    }
}

<?php

namespace Tests\Feature;

use App\Contracts\ScopedRecord;
use App\Models\AuditEvent;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Tests\TestCase;

class BackendAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_denied_route_action_is_audited(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $secretary = User::factory()->create();
        $secretary->roles()->attach($this->role('barangay_secretary'));

        $this->actingAs($secretary)
            ->getJson('/api/v1/administration/security/audit-events')
            ->assertForbidden();

        $this->assertDatabaseHas('audit_events', [
            'actor_user_id' => $secretary->getKey(),
            'event_type' => 'authorization.denied',
            'outcome' => 'denied',
            'ability' => 'administration.audit.view',
        ]);
    }

    public function test_authorized_audit_view_omits_request_metadata(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $administrator = User::factory()->create();
        $administrator->roles()->attach($this->role('system_administrator'));

        AuditEvent::query()->create([
            'actor_user_id' => $administrator->getKey(),
            'event_type' => 'authorization.denied',
            'outcome' => 'denied',
            'metadata' => ['ip_address' => '127.0.0.1'],
        ]);

        $this->actingAs($administrator)
            ->getJson('/api/v1/administration/security/audit-events')
            ->assertOk()
            ->assertJsonMissing(['metadata' => ['ip_address' => '127.0.0.1']]);
    }

    public function test_system_administrator_does_not_inherit_official_approvals(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $administrator = User::factory()->create();
        $administrator->roles()->attach($this->role('system_administrator'));

        $this->assertTrue($administrator->hasPermission('administration.users.manage'));
        $this->assertTrue($administrator->hasPermission('drrm.view'));
        $this->assertFalse($administrator->hasPermission('document.approve'));
        $this->assertFalse($administrator->hasPermission('document.export'));
        $this->assertFalse($administrator->hasPermission('document.release'));
        $this->assertFalse($administrator->hasPermission('document.reprint'));
        $this->assertFalse($administrator->hasPermission('document.void'));
        $this->assertFalse($administrator->hasPermission('collection.certify'));
        $this->assertFalse($administrator->hasPermission('case.approve'));
        $this->assertFalse($administrator->hasPermission('drrm.approve'));
        $this->assertFalse($administrator->hasPermission('gad.approve'));
    }

    public function test_punong_barangay_holds_official_approval_permissions(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $punongBarangay = User::factory()->create();
        $punongBarangay->roles()->attach($this->role('punong_barangay'));

        $this->assertTrue($punongBarangay->hasPermission('document.approve'));
        $this->assertTrue($punongBarangay->hasPermission('document.void'));
        $this->assertTrue($punongBarangay->hasPermission('collection.certify'));
        $this->assertTrue($punongBarangay->hasPermission('case.approve'));
        $this->assertTrue($punongBarangay->hasPermission('drrm.approve'));
        $this->assertTrue($punongBarangay->hasPermission('gad.approve'));
    }

    public function test_record_and_export_permissions_are_limited_to_assigned_scope(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $secretary = User::factory()->create([
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
        ]);
        $secretary->roles()->attach($this->role('barangay_secretary'));

        $this->assertTrue(Gate::forUser($secretary)->allows(
            'resident.export',
            $this->record('BRGY-001', 'MUN-001'),
        ));
        $this->assertFalse(Gate::forUser($secretary)->allows(
            'resident.export',
            $this->record('BRGY-002', 'MUN-001'),
        ));
    }

    public function test_municipal_reviewer_is_report_scoped_and_cannot_edit_source_data(): void
    {
        $this->seed(AuthorizationSeeder::class);
        $reviewer = User::factory()->create([
            'barangay_code' => null,
            'municipality_code' => 'MUN-001',
        ]);
        $reviewer->roles()->attach($this->role('municipal_reviewer'));

        $this->assertTrue(Gate::forUser($reviewer)->allows(
            'report.export',
            $this->record(null, 'MUN-001'),
        ));
        $this->assertFalse($reviewer->hasPermission('resident.update'));
        $this->assertFalse($reviewer->hasPermission('drrm.update'));
        $this->assertFalse($reviewer->hasPermission('gad.update'));
    }

    private function role(string $code): Role
    {
        return Role::query()->where('code', $code)->firstOrFail();
    }

    private function record(
        ?string $barangayCode,
        ?string $municipalityCode,
    ): ScopedRecord {
        return new class($barangayCode, $municipalityCode) implements ScopedRecord
        {
            public function __construct(
                private readonly ?string $barangay,
                private readonly ?string $municipality,
            ) {}

            public function barangayCode(): ?string
            {
                return $this->barangay;
            }

            public function municipalityCode(): ?string
            {
                return $this->municipality;
            }

            public function classification(): string
            {
                return 'internal';
            }
        };
    }
}

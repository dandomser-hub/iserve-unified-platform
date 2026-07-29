<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Modules\ResidentHousehold\Models\Household;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Models\ResidentDuplicateCandidate;
use App\Modules\ResidentHousehold\Models\ResidentLookupEvent;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ResidentHouseholdMasterDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_secretary_creates_resident_with_privacy_and_duplicate_review_evidence(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');

        $first = $this->actingAs($secretary)
            ->postJson('/api/v1/resident-household/residents', $this->residentPayload())
            ->assertCreated()
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('meta.duplicate_candidate_count', 0)
            ->json('data.public_id');

        $second = $this->actingAs($secretary)
            ->postJson('/api/v1/resident-household/residents', $this->residentPayload([
                'mobile_number' => '09170000002',
            ]))
            ->assertCreated()
            ->assertJsonPath('meta.duplicate_candidate_count', 1)
            ->json('data.public_id');

        $this->assertNotSame($first, $second);
        $this->assertDatabaseCount('residents', 2);
        $this->assertDatabaseCount('resident_status_histories', 2);
        $this->assertDatabaseCount('privacy_notice_acknowledgements', 2);
        $this->assertDatabaseHas('resident_duplicate_candidates', [
            'status' => 'pending_review',
            'match_score' => 100,
        ]);
        $this->assertDatabaseHas('audit_events', [
            'actor_user_id' => $secretary->getKey(),
            'event_type' => 'resident.created',
            'outcome' => 'success',
        ]);

        $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/residents/{$first}/privacy-acknowledgements",
                $this->residentPayload()['privacy_notice'],
            )
            ->assertUnprocessable();
    }

    public function test_lookup_requires_approved_purpose_and_never_stores_raw_query(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $ownResident = $this->resident(['first_name' => 'Juan']);
        $foreignResident = $this->resident([
            'first_name' => 'Juan',
            'barangay_code' => 'BRGY-002',
        ]);

        $response = $this->actingAs($secretary)->getJson(
            '/api/v1/resident-household/residents?purpose=resident_service&query=Juan',
        );

        $response
            ->assertOk()
            ->assertJsonFragment(['public_id' => $ownResident->public_id])
            ->assertJsonMissing(['public_id' => $foreignResident->public_id]);

        $lookup = ResidentLookupEvent::query()->firstOrFail();
        $this->assertSame(hash('sha256', 'juan'), $lookup->query_hash);
        $this->assertNotSame('Juan', $lookup->query_hash);

        $drrmUser = $this->userWithRole('drrm_focal');
        $this->actingAs($drrmUser)
            ->getJson('/api/v1/resident-household/residents?purpose=drrm_preparedness&query=Juan')
            ->assertOk()
            ->assertJsonFragment(['public_id' => $ownResident->public_id])
            ->assertJsonMissing(['birth_date' => '1990-01-01']);

        $this->actingAs($drrmUser)
            ->getJson('/api/v1/resident-household/residents?purpose=resident_service&query=Juan')
            ->assertForbidden();

        $this->assertDatabaseHas('audit_events', [
            'actor_user_id' => $drrmUser->getKey(),
            'event_type' => 'authorization.denied',
            'ability' => 'resident.lookup.purpose',
        ]);
    }

    public function test_record_scope_blocks_cross_barangay_detail_access(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $foreignResident = $this->resident(['barangay_code' => 'BRGY-002']);

        $this->actingAs($secretary)
            ->getJson(
                "/api/v1/resident-household/residents/{$foreignResident->public_id}"
                .'?purpose=resident_service',
            )
            ->assertForbidden();

        $this->assertDatabaseHas('audit_events', [
            'actor_user_id' => $secretary->getKey(),
            'event_type' => 'authorization.denied',
            'ability' => 'resident.view',
        ]);
    }

    public function test_status_changes_are_historical_and_deceased_is_terminal(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $residentPublicId = $this->actingAs($secretary)
            ->postJson('/api/v1/resident-household/residents', $this->residentPayload())
            ->assertCreated()
            ->json('data.public_id');

        $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/residents/{$residentPublicId}/status-history",
                [
                    'status' => 'deceased',
                    'effective_on' => '2026-07-28',
                    'reason' => 'death_reported',
                ],
            )
            ->assertOk()
            ->assertJsonPath('data.status', 'deceased')
            ->assertJsonPath('data.status_history_count', 2);

        $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/residents/{$residentPublicId}/status-history",
                [
                    'status' => 'active',
                    'effective_on' => '2026-07-29',
                    'reason' => 'invalid_reactivation',
                ],
            )
            ->assertUnprocessable();

        $this->assertDatabaseHas('resident_status_histories', [
            'from_status' => 'active',
            'to_status' => 'deceased',
            'reason' => 'death_reported',
        ]);
    }

    public function test_membership_history_prevents_two_active_households(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $resident = $this->resident();
        $firstHousehold = $this->household();
        $secondHousehold = $this->household(['household_number' => 'HH-002']);

        $membershipId = $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/households/{$firstHousehold->public_id}/memberships",
                [
                    'resident_public_id' => $resident->public_id,
                    'relationship_to_head' => 'Head',
                    'is_household_head' => true,
                    'started_on' => '2026-01-01',
                ],
            )
            ->assertCreated()
            ->json('data.membership_id');

        $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/households/{$secondHousehold->public_id}/memberships",
                [
                    'resident_public_id' => $resident->public_id,
                    'relationship_to_head' => 'Member',
                    'is_household_head' => false,
                    'started_on' => '2026-02-01',
                ],
            )
            ->assertUnprocessable();

        $this->actingAs($secretary)
            ->patchJson(
                "/api/v1/resident-household/household-memberships/{$membershipId}/end",
                ['ended_on' => '2026-01-31', 'reason' => 'transferred_household'],
            )
            ->assertOk();

        $this->actingAs($secretary)
            ->postJson(
                "/api/v1/resident-household/households/{$secondHousehold->public_id}/memberships",
                [
                    'resident_public_id' => $resident->public_id,
                    'relationship_to_head' => 'Member',
                    'is_household_head' => false,
                    'started_on' => '2026-02-01',
                ],
            )
            ->assertCreated();
    }

    public function test_duplicate_review_is_non_destructive_and_audited(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $first = $this->resident();
        $second = $this->resident(['resident_number' => 'RES-002']);
        $candidate = ResidentDuplicateCandidate::query()->create([
            'resident_a_id' => $first->getKey(),
            'resident_b_id' => $second->getKey(),
            'match_score' => 100,
            'match_signals' => ['normalized_name', 'birth_date'],
            'status' => 'pending_review',
        ]);

        $this->actingAs($secretary)
            ->patchJson(
                "/api/v1/resident-household/duplicate-candidates/{$candidate->getKey()}",
                [
                    'decision' => 'confirmed_duplicate',
                    'surviving_resident_public_id' => $first->public_id,
                    'review_notes' => 'Manual comparison completed.',
                ],
            )
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed_duplicate');

        $this->assertDatabaseCount('residents', 2);
        $this->assertDatabaseHas('resident_duplicate_candidates', [
            'id' => $candidate->getKey(),
            'status' => 'confirmed_duplicate',
            'surviving_resident_id' => $first->getKey(),
            'reviewed_by' => $secretary->getKey(),
        ]);
        $this->assertDatabaseHas('audit_events', [
            'event_type' => 'resident.duplicate_reviewed',
            'ability' => 'resident.duplicate.review',
        ]);
    }

    public function test_purok_reference_management_is_separated_from_registry_encoding(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $this->actingAs($secretary)
            ->postJson('/api/v1/resident-household/puroks', [
                'code' => 'P-01',
                'name' => 'Purok 1',
            ])
            ->assertForbidden();

        $administrator = $this->userWithRole('system_administrator');
        $this->actingAs($administrator)
            ->postJson('/api/v1/resident-household/puroks', [
                'code' => 'P-01',
                'name' => 'Purok 1',
                'sitio_name' => 'Sitio Centro',
            ])
            ->assertCreated()
            ->assertJsonPath('data.barangay_code', 'BRGY-001');

        $this->actingAs($secretary)
            ->getJson('/api/v1/resident-household/puroks')
            ->assertOk()
            ->assertJsonFragment(['code' => 'P-01', 'name' => 'Purok 1']);
    }

    private function userWithRole(string $roleCode): User
    {
        $this->seed(AuthorizationSeeder::class);
        $user = User::factory()->create([
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
        ]);
        $user->roles()->attach(Role::query()->where('code', $roleCode)->firstOrFail());

        return $user;
    }

    private function resident(array $overrides = []): Resident
    {
        return Resident::query()->create([
            'public_id' => (string) Str::uuid(),
            'resident_number' => 'RES-001',
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'birth_date' => '1990-01-01',
            'sex' => 'male',
            'status' => 'active',
            'classification' => 'confidential',
            ...$overrides,
        ]);
    }

    private function household(array $overrides = []): Household
    {
        return Household::query()->create([
            'public_id' => (string) Str::uuid(),
            'household_number' => 'HH-001',
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
            'address_line' => 'Purok 1',
            'status' => 'active',
            'classification' => 'confidential',
            ...$overrides,
        ]);
    }

    private function residentPayload(array $overrides = []): array
    {
        return [
            'first_name' => 'Juan',
            'middle_name' => 'Santos',
            'last_name' => 'Dela Cruz',
            'birth_date' => '1990-01-01',
            'sex' => 'male',
            'civil_status' => 'married',
            'mobile_number' => '09170000001',
            'privacy_notice' => [
                'notice_version' => 'v0.1a',
                'purpose_code' => 'resident_registry',
                'acknowledgement_method' => 'signed',
                'acknowledged_at' => '2026-07-28T08:00:00+08:00',
            ],
            ...$overrides,
        ];
    }
}

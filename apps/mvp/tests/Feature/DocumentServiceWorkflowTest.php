<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Models\IssuedDocument;
use App\Modules\ResidentHousehold\Models\Resident;
use Database\Seeders\AuthorizationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

class DocumentServiceWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_common_document_moves_from_versioned_intake_to_verified_release(): void
    {
        Storage::fake('local');
        $administrator = $this->userWithRole('system_administrator');
        $secretary = $this->userWithRole('barangay_secretary');
        $treasurer = $this->userWithRole('barangay_treasurer');
        $punongBarangay = $this->userWithRole('punong_barangay');
        $resident = $this->resident();
        $template = $this->createAndPublishTemplate($administrator);

        $requestId = $this->actingAs($secretary)
            ->postJson('/api/v1/document-services/requests', [
                'template_code' => 'BRGY-CLEARANCE',
                'resident_public_id' => $resident->public_id,
                'purpose' => 'Local employment',
                'request_data' => [
                    'resident_name' => 'Juan Dela Cruz',
                    'purpose' => 'Local employment',
                ],
            ])
            ->assertCreated()
            ->assertJsonPath('data.status', 'draft')
            ->assertJsonPath('data.template.version', 1)
            ->json('data.public_id');

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', 'submitted');

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/requirements-check", [
                'requirement_evidence' => [
                    ['code' => 'VALID_ID', 'status' => 'verified', 'reference' => 'ID-2026-001'],
                ],
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'requirements_checked');

        $this->actingAs($treasurer)
            ->postJson("/api/v1/document-services/requests/{$requestId}/fee-reference", [
                'exemption_code' => 'indigent',
                'notes' => 'Reference-only exemption; no funds handled by the platform.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'fee_referenced')
            ->assertJsonPath('data.fee_reference.reference_only', true)
            ->assertJsonPath('data.fee_reference.amount_due_reference', '0.00');
        $this->actingAs($treasurer)
            ->getJson("/api/v1/document-services/requests/{$requestId}")
            ->assertOk()
            ->assertJsonMissingPath('data.resident')
            ->assertJsonMissingPath('data.request_data')
            ->assertJsonMissingPath('data.requirement_evidence');

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/decision", [
                'decision' => 'approve',
            ])
            ->assertForbidden();

        $this->actingAs($punongBarangay)
            ->postJson("/api/v1/document-services/requests/{$requestId}/decision", [
                'decision' => 'approve',
                'notes' => 'Requirements and reference details reviewed.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'approved');

        $generated = $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/generate")
            ->assertOk()
            ->assertJsonPath('data.request.status', 'generated')
            ->assertJsonPath('data.issued_document.revision', 1)
            ->assertJsonStructure(['data' => ['verification_token', 'verification_url', 'qr_payload']]);
        $token = $generated->json('data.verification_token');
        $issued = IssuedDocument::query()->firstOrFail();

        Storage::disk('local')->assertExists($issued->pdf_path);
        $this->assertStringStartsWith(
            '%PDF-1.4',
            Storage::disk('local')->get($issued->pdf_path),
        );
        $this->getJson("/api/v1/document-services/verify/{$token}")
            ->assertJsonPath('data.status', 'not_released');

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/release", [
                'notes' => 'Released to requesting resident.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'released');

        $this->getJson("/api/v1/document-services/verify/{$token}")
            ->assertOk()
            ->assertJsonPath('data.verified', true)
            ->assertJsonPath('data.status', 'valid')
            ->assertJsonMissing(['resident_name' => 'Juan Dela Cruz'])
            ->assertJsonMissing(['resident_public_id' => $resident->public_id]);

        $this->assertDatabaseHas('document_release_logs', ['action' => 'released']);
        $this->assertDatabaseHas('audit_events', [
            'event_type' => 'document.generated',
            'ability' => 'document.export',
        ]);
        $this->assertSame(
            $template['version_id'],
            DocumentRequest::query()->firstOrFail()->document_template_version_id,
        );
    }

    public function test_requirement_checks_and_template_versions_are_controlled(): void
    {
        $administrator = $this->userWithRole('system_administrator');
        $secretary = $this->userWithRole('barangay_secretary');
        $resident = $this->resident();
        $template = $this->createAndPublishTemplate($administrator);
        $requestId = $this->draftRequest($secretary, $resident);

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/submit")
            ->assertOk();
        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/requirements-check", [
                'requirement_evidence' => [],
            ])
            ->assertUnprocessable();

        $secondVersion = $this->actingAs($administrator)
            ->postJson("/api/v1/document-services/templates/{$template['template_id']}/versions", [
                ...$this->templateVersionPayload(),
                'title' => 'Barangay Clearance Updated',
                'fee_amount' => 75,
            ])
            ->assertCreated()
            ->assertJsonPath('data.version_number', 2)
            ->json('data.id');
        $this->actingAs($administrator)
            ->postJson(
                "/api/v1/document-services/templates/{$template['template_id']}/versions/{$secondVersion}/publish",
            )
            ->assertOk();

        $this->assertDatabaseHas('document_template_versions', [
            'id' => $template['version_id'],
            'status' => 'retired',
        ]);
        $this->assertSame(
            $template['version_id'],
            DocumentRequest::query()->where('public_id', $requestId)->firstOrFail()
                ->document_template_version_id,
        );
    }

    public function test_reprint_supersedes_old_token_and_void_preserves_verification_evidence(): void
    {
        Storage::fake('local');
        $administrator = $this->userWithRole('system_administrator');
        $secretary = $this->userWithRole('barangay_secretary');
        $treasurer = $this->userWithRole('barangay_treasurer');
        $punongBarangay = $this->userWithRole('punong_barangay');
        $resident = $this->resident();
        $this->createAndPublishTemplate($administrator);
        $requestId = $this->draftRequest($secretary, $resident);
        $this->advanceToApproval($requestId, $secretary, $treasurer, $punongBarangay);
        $firstToken = $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/generate")
            ->json('data.verification_token');
        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/release")
            ->assertOk();

        $secondToken = $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/reprint", [
                'reason' => 'Original copy was damaged.',
            ])
            ->assertOk()
            ->assertJsonPath('data.issued_document.revision', 2)
            ->json('data.verification_token');

        $this->getJson("/api/v1/document-services/verify/{$firstToken}")
            ->assertJsonPath('data.status', 'superseded');
        $this->getJson("/api/v1/document-services/verify/{$secondToken}")
            ->assertJsonPath('data.status', 'valid');

        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/void", [
                'reason' => 'Attempt without official authority.',
            ])
            ->assertForbidden();
        $this->actingAs($punongBarangay)
            ->postJson("/api/v1/document-services/requests/{$requestId}/void", [
                'reason' => 'Underlying certification was formally withdrawn.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'voided');
        $this->getJson("/api/v1/document-services/verify/{$secondToken}")
            ->assertJsonPath('data.status', 'voided');

        $this->assertDatabaseCount('issued_documents', 2);
        $this->assertDatabaseHas('document_release_logs', [
            'action' => 'voided',
            'reason' => 'Underlying certification was formally withdrawn.',
        ]);
    }

    public function test_cross_barangay_request_access_is_denied_and_audited(): void
    {
        $secretary = $this->userWithRole('barangay_secretary');
        $foreignRequest = DocumentRequest::query()->create([
            'public_id' => (string) Str::uuid(),
            'request_number' => 'BRGY002-REQ-001',
            'document_template_version_id' => $this->foreignTemplateVersion(),
            'resident_id' => $this->resident([
                'resident_number' => 'RES-002',
                'barangay_code' => 'BRGY-002',
            ])->getKey(),
            'barangay_code' => 'BRGY-002',
            'municipality_code' => 'MUN-001',
            'purpose' => 'Foreign record',
            'request_data' => ['resident_name' => 'Other Resident', 'purpose' => 'Test'],
            'status' => 'draft',
        ]);

        $this->actingAs($secretary)
            ->getJson("/api/v1/document-services/requests/{$foreignRequest->public_id}")
            ->assertForbidden();

        $this->assertDatabaseHas('audit_events', [
            'actor_user_id' => $secretary->getKey(),
            'event_type' => 'authorization.denied',
            'ability' => 'document.view',
        ]);
    }

    /**
     * @return array{template_id: string, version_id: int}
     */
    private function createAndPublishTemplate(User $administrator): array
    {
        $created = $this->actingAs($administrator)
            ->postJson('/api/v1/document-services/templates', [
                'code' => 'BRGY-CLEARANCE',
                'name' => 'Barangay Clearance',
                'barangay_code' => 'BRGY-001',
                'municipality_code' => 'MUN-001',
                ...$this->templateVersionPayload(),
            ])
            ->assertCreated()
            ->assertJsonPath('data.versions.0.status', 'draft');
        $templateId = $created->json('data.public_id');
        $versionId = $created->json('data.versions.0.id');
        $this->actingAs($administrator)
            ->postJson("/api/v1/document-services/templates/{$templateId}/versions/{$versionId}/publish")
            ->assertOk()
            ->assertJsonPath('data.status', 'published');

        return ['template_id' => $templateId, 'version_id' => $versionId];
    }

    private function templateVersionPayload(): array
    {
        return [
            'title' => 'Barangay Clearance',
            'body_template' => 'This certifies that {{resident_name}} requested clearance for {{purpose}}.',
            'required_fields' => ['resident_name', 'purpose'],
            'requirement_codes' => ['VALID_ID'],
            'fee_amount' => 50,
            'exemption_codes' => ['indigent', 'official_barangay_use'],
        ];
    }

    private function draftRequest(User $secretary, Resident $resident): string
    {
        return $this->actingAs($secretary)
            ->postJson('/api/v1/document-services/requests', [
                'template_code' => 'BRGY-CLEARANCE',
                'resident_public_id' => $resident->public_id,
                'purpose' => 'Local employment',
                'request_data' => [
                    'resident_name' => 'Juan Dela Cruz',
                    'purpose' => 'Local employment',
                ],
            ])
            ->assertCreated()
            ->json('data.public_id');
    }

    private function advanceToApproval(
        string $requestId,
        User $secretary,
        User $treasurer,
        User $punongBarangay,
    ): void {
        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/submit")
            ->assertOk();
        $this->actingAs($secretary)
            ->postJson("/api/v1/document-services/requests/{$requestId}/requirements-check", [
                'requirement_evidence' => [['code' => 'VALID_ID', 'status' => 'verified']],
            ])
            ->assertOk();
        $this->actingAs($treasurer)
            ->postJson("/api/v1/document-services/requests/{$requestId}/fee-reference")
            ->assertOk();
        $this->actingAs($punongBarangay)
            ->postJson("/api/v1/document-services/requests/{$requestId}/decision", [
                'decision' => 'approve',
            ])
            ->assertOk();
    }

    private function foreignTemplateVersion(): int
    {
        $administrator = $this->userWithRole(
            'system_administrator',
            ['barangay_code' => 'BRGY-002'],
        );

        return $this->actingAs($administrator)
            ->postJson('/api/v1/document-services/templates', [
                'code' => 'FOREIGN',
                'name' => 'Foreign Template',
                'barangay_code' => 'BRGY-002',
                'municipality_code' => 'MUN-001',
                ...$this->templateVersionPayload(),
            ])
            ->assertCreated()
            ->json('data.versions.0.id');
    }

    private function userWithRole(string $roleCode, array $overrides = []): User
    {
        $this->seed(AuthorizationSeeder::class);
        $user = User::factory()->create([
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
            ...$overrides,
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
}

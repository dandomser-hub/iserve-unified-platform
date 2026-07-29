<?php

namespace Tests\Unit;

use App\Contracts\ScopedRecord;
use App\Models\User;
use App\Services\RecordScope;
use PHPUnit\Framework\TestCase;

class RecordScopeTest extends TestCase
{
    public function test_record_access_requires_matching_assignment_scope(): void
    {
        $user = new User([
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
        ]);
        $scope = new RecordScope;

        $this->assertTrue($scope->allows(
            $user,
            $this->record('BRGY-001', 'MUN-001', 'internal'),
        ));
        $this->assertFalse($scope->allows(
            $user,
            $this->record('BRGY-002', 'MUN-001', 'internal'),
        ));
    }

    public function test_restricted_records_are_denied_until_extra_controls_exist(): void
    {
        $user = new User([
            'barangay_code' => 'BRGY-001',
            'municipality_code' => 'MUN-001',
        ]);

        $this->assertFalse((new RecordScope)->allows(
            $user,
            $this->record('BRGY-001', 'MUN-001', 'restricted'),
        ));
    }

    private function record(
        ?string $barangayCode,
        ?string $municipalityCode,
        string $classification,
    ): ScopedRecord {
        return new class($barangayCode, $municipalityCode, $classification) implements ScopedRecord
        {
            public function __construct(
                private readonly ?string $barangay,
                private readonly ?string $municipality,
                private readonly string $recordClassification,
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
                return $this->recordClassification;
            }
        };
    }
}

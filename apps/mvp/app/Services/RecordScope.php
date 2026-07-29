<?php

namespace App\Services;

use App\Contracts\ScopedRecord;
use App\Models\User;

class RecordScope
{
    public function allows(User $user, mixed $record): bool
    {
        if (! $record instanceof ScopedRecord) {
            return true;
        }

        if ($record->classification() === 'restricted') {
            return false;
        }

        if ($record->barangayCode() !== null) {
            return hash_equals(
                (string) $user->barangay_code,
                $record->barangayCode(),
            );
        }

        if ($record->municipalityCode() !== null) {
            return hash_equals(
                (string) $user->municipality_code,
                $record->municipalityCode(),
            );
        }

        return false;
    }

    /**
     * @return array{barangay_code: ?string, municipality_code: ?string}
     */
    public function descriptor(User $user): array
    {
        return [
            'barangay_code' => $user->barangay_code,
            'municipality_code' => $user->municipality_code,
        ];
    }
}

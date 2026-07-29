<?php

namespace App\Modules\ResidentHousehold\Services;

use Illuminate\Support\Str;

class MasterDataIdentifier
{
    public function residentNumber(string $barangayCode): string
    {
        return $this->make($barangayCode, 'RES');
    }

    public function householdNumber(string $barangayCode): string
    {
        return $this->make($barangayCode, 'HH');
    }

    private function make(string $barangayCode, string $type): string
    {
        $scope = Str::upper(Str::of($barangayCode)->replaceMatches('/[^A-Za-z0-9]/', '')->substr(0, 8));
        $token = Str::upper(substr(str_replace('-', '', (string) Str::uuid()), 0, 10));

        return "{$scope}-{$type}-{$token}";
    }
}

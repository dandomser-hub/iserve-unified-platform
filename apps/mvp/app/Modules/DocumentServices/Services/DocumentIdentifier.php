<?php

namespace App\Modules\DocumentServices\Services;

use Illuminate\Support\Str;

class DocumentIdentifier
{
    public function requestNumber(string $barangayCode): string
    {
        return $this->make($barangayCode, 'REQ');
    }

    public function serialNumber(string $barangayCode, int $revision): string
    {
        return $this->make($barangayCode, 'DOC').'-R'.$revision;
    }

    private function make(string $barangayCode, string $type): string
    {
        $scope = Str::upper(Str::of($barangayCode)->replaceMatches('/[^A-Za-z0-9]/', '')->substr(0, 8));
        $token = Str::upper(substr(str_replace('-', '', (string) Str::uuid()), 0, 12));

        return "{$scope}-{$type}-{$token}";
    }
}

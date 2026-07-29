<?php

namespace App\Contracts;

interface ScopedRecord
{
    public function barangayCode(): ?string;

    public function municipalityCode(): ?string;

    public function classification(): string;
}

<?php

namespace App\Modules\ResidentHousehold\Models;

use App\Contracts\ScopedRecord;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'public_id',
    'household_number',
    'barangay_code',
    'municipality_code',
    'purok_id',
    'address_line',
    'landmark',
    'status',
    'classification',
])]
class Household extends Model implements ScopedRecord
{
    use SoftDeletes;

    public function purok(): BelongsTo
    {
        return $this->belongsTo(Purok::class);
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(HouseholdMembership::class);
    }

    public function barangayCode(): ?string
    {
        return $this->barangay_code;
    }

    public function municipalityCode(): ?string
    {
        return $this->municipality_code;
    }

    public function classification(): string
    {
        return $this->classification;
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }
}

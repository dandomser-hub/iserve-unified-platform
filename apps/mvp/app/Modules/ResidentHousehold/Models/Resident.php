<?php

namespace App\Modules\ResidentHousehold\Models;

use App\Contracts\ScopedRecord;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'public_id',
    'resident_number',
    'barangay_code',
    'municipality_code',
    'first_name',
    'middle_name',
    'last_name',
    'suffix',
    'birth_date',
    'sex',
    'civil_status',
    'mobile_number',
    'email',
    'status',
    'classification',
    'created_by',
    'updated_by',
])]
class Resident extends Model implements ScopedRecord
{
    use SoftDeletes;

    public function memberships(): HasMany
    {
        return $this->hasMany(HouseholdMembership::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ResidentStatusHistory::class);
    }

    public function privacyAcknowledgements(): HasMany
    {
        return $this->hasMany(PrivacyNoticeAcknowledgement::class);
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

    protected function casts(): array
    {
        return ['birth_date' => 'date'];
    }
}

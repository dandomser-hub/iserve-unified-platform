<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'resident_id',
    'household_id',
    'relationship_to_head',
    'is_household_head',
    'started_on',
    'ended_on',
    'change_reason',
    'recorded_by',
])]
class HouseholdMembership extends Model
{
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function household(): BelongsTo
    {
        return $this->belongsTo(Household::class);
    }

    protected function casts(): array
    {
        return [
            'is_household_head' => 'boolean',
            'started_on' => 'date',
            'ended_on' => 'date',
        ];
    }
}

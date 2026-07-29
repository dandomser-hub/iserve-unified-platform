<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'resident_a_id',
    'resident_b_id',
    'match_score',
    'match_signals',
    'status',
    'surviving_resident_id',
    'reviewed_by',
    'reviewed_at',
    'review_notes',
])]
class ResidentDuplicateCandidate extends Model
{
    public function residentA(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'resident_a_id');
    }

    public function residentB(): BelongsTo
    {
        return $this->belongsTo(Resident::class, 'resident_b_id');
    }

    protected function casts(): array
    {
        return [
            'match_score' => 'decimal:2',
            'match_signals' => 'array',
            'reviewed_at' => 'datetime',
        ];
    }
}

<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'resident_id',
    'from_status',
    'to_status',
    'effective_on',
    'reason',
    'notes',
    'recorded_by',
])]
class ResidentStatusHistory extends Model
{
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    protected function casts(): array
    {
        return ['effective_on' => 'date'];
    }
}

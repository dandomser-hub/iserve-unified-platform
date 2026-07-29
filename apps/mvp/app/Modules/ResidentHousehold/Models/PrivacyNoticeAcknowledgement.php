<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'resident_id',
    'notice_version',
    'purpose_code',
    'acknowledgement_method',
    'acknowledged_at',
    'recorded_by',
    'withdrawn_at',
    'notes',
])]
class PrivacyNoticeAcknowledgement extends Model
{
    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    protected function casts(): array
    {
        return [
            'acknowledged_at' => 'datetime',
            'withdrawn_at' => 'datetime',
        ];
    }
}

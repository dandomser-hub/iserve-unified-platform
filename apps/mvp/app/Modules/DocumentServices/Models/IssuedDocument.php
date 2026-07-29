<?php

namespace App\Modules\DocumentServices\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'public_id',
    'document_request_id',
    'serial_number',
    'revision',
    'pdf_path',
    'pdf_checksum',
    'verification_token_hash',
    'status',
    'generated_by',
    'generated_at',
    'released_by',
    'released_at',
    'voided_by',
    'voided_at',
    'void_reason',
])]
class IssuedDocument extends Model
{
    public function request(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class, 'document_request_id');
    }

    protected function casts(): array
    {
        return [
            'generated_at' => 'datetime',
            'released_at' => 'datetime',
            'voided_at' => 'datetime',
        ];
    }
}

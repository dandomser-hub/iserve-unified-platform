<?php

namespace App\Modules\DocumentServices\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'document_request_id',
    'action',
    'from_status',
    'to_status',
    'notes',
    'metadata',
    'actor_user_id',
])]
class DocumentWorkflowEvent extends Model
{
    public function request(): BelongsTo
    {
        return $this->belongsTo(DocumentRequest::class, 'document_request_id');
    }

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }
}

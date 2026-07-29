<?php

namespace App\Modules\DocumentServices\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'document_request_id',
    'issued_document_id',
    'action',
    'reason',
    'actor_user_id',
    'occurred_at',
])]
class DocumentReleaseLog extends Model
{
    protected function casts(): array
    {
        return ['occurred_at' => 'datetime'];
    }
}

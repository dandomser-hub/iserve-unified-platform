<?php

namespace App\Modules\DocumentServices\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'document_template_id',
    'version_number',
    'status',
    'title',
    'body_template',
    'required_fields',
    'requirement_codes',
    'fee_amount',
    'exemption_codes',
    'created_by',
    'published_by',
    'published_at',
])]
class DocumentTemplateVersion extends Model
{
    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }

    public function requests(): HasMany
    {
        return $this->hasMany(DocumentRequest::class);
    }

    protected function casts(): array
    {
        return [
            'required_fields' => 'array',
            'requirement_codes' => 'array',
            'exemption_codes' => 'array',
            'fee_amount' => 'decimal:2',
            'published_at' => 'datetime',
        ];
    }
}

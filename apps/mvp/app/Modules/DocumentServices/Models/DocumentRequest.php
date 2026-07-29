<?php

namespace App\Modules\DocumentServices\Models;

use App\Contracts\ScopedRecord;
use App\Modules\ResidentHousehold\Models\Resident;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'public_id',
    'request_number',
    'document_template_version_id',
    'resident_id',
    'barangay_code',
    'municipality_code',
    'purpose',
    'request_data',
    'requirement_evidence',
    'fee_reference',
    'status',
    'classification',
    'created_by',
    'updated_by',
])]
class DocumentRequest extends Model implements ScopedRecord
{
    public function templateVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplateVersion::class, 'document_template_version_id');
    }

    public function resident(): BelongsTo
    {
        return $this->belongsTo(Resident::class);
    }

    public function workflowEvents(): HasMany
    {
        return $this->hasMany(DocumentWorkflowEvent::class);
    }

    public function issuedDocuments(): HasMany
    {
        return $this->hasMany(IssuedDocument::class);
    }

    public function releaseLogs(): HasMany
    {
        return $this->hasMany(DocumentReleaseLog::class);
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
        return [
            'request_data' => 'array',
            'requirement_evidence' => 'array',
            'fee_reference' => 'array',
        ];
    }
}

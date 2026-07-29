<?php

namespace App\Modules\DocumentServices\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'public_id',
    'code',
    'barangay_code',
    'municipality_code',
    'name',
    'is_active',
    'created_by',
])]
class DocumentTemplate extends Model
{
    public function versions(): HasMany
    {
        return $this->hasMany(DocumentTemplateVersion::class);
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}

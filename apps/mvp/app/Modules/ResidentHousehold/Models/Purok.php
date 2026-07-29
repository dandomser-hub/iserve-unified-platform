<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'barangay_code',
    'municipality_code',
    'code',
    'name',
    'sitio_name',
    'is_active',
])]
class Purok extends Model
{
    public function households(): HasMany
    {
        return $this->hasMany(Household::class);
    }

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }
}

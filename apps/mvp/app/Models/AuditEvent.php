<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'actor_user_id',
    'event_type',
    'outcome',
    'ability',
    'route_name',
    'request_method',
    'request_path',
    'resource_type',
    'resource_id',
    'metadata',
])]
class AuditEvent extends Model
{
    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}

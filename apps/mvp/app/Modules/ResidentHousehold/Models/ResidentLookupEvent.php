<?php

namespace App\Modules\ResidentHousehold\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'actor_user_id',
    'purpose_code',
    'query_hash',
    'result_count',
    'barangay_code',
    'municipality_code',
])]
class ResidentLookupEvent extends Model
{
    //
}

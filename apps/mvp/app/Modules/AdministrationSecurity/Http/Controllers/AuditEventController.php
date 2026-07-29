<?php

namespace App\Modules\AdministrationSecurity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use Illuminate\Http\JsonResponse;

class AuditEventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = AuditEvent::query()
            ->latest('id')
            ->limit(100)
            ->get([
                'id',
                'actor_user_id',
                'event_type',
                'outcome',
                'ability',
                'route_name',
                'resource_type',
                'resource_id',
                'created_at',
            ]);

        return response()->json(['data' => $events]);
    }
}

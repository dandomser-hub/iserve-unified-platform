<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Services\ResidentLifecycle;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ResidentStatusController extends Controller
{
    public function store(
        Request $request,
        Resident $resident,
        ResidentLifecycle $lifecycle,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $authorization->authorize($request, 'resident.status.manage', $resident);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(config('resident_household.resident_statuses'))],
            'effective_on' => ['required', 'date'],
            'reason' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $fromStatus = $resident->status;
        $updated = $lifecycle->change(
            $resident,
            $request->user(),
            $validated['status'],
            $validated['effective_on'],
            $validated['reason'],
            $validated['notes'] ?? null,
        );

        $audit->record(
            $request->user(),
            'resident.status_changed',
            'success',
            $request,
            'resident.status.manage',
            'resident',
            $resident->public_id,
            ['from_status' => $fromStatus, 'to_status' => $updated->status],
        );

        return response()->json([
            'data' => [
                'public_id' => $updated->public_id,
                'status' => $updated->status,
                'status_history_count' => $updated->statusHistories()->count(),
            ],
        ]);
    }
}

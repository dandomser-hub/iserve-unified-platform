<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PrivacyAcknowledgementController extends Controller
{
    public function store(
        Request $request,
        Resident $resident,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $authorization->authorize($request, 'resident.privacy.record', $resident);

        $validated = $request->validate([
            'notice_version' => ['required', 'string', 'max:40'],
            'purpose_code' => ['required', 'string', 'max:80'],
            'acknowledgement_method' => [
                'required',
                'string',
                Rule::in(config('resident_household.privacy_acknowledgement_methods')),
            ],
            'acknowledged_at' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $acknowledgement = $resident->privacyAcknowledgements()->create([
                'notice_version' => $validated['notice_version'],
                'purpose_code' => $validated['purpose_code'],
                'acknowledgement_method' => $validated['acknowledgement_method'],
                'acknowledged_at' => $validated['acknowledged_at'],
                'notes' => $validated['notes'] ?? null,
                'recorded_by' => $request->user()->getKey(),
            ]);
        } catch (QueryException $exception) {
            if (! in_array((string) $exception->getCode(), ['23000', '23505'], true)) {
                throw $exception;
            }

            throw ValidationException::withMessages([
                'notice_version' => 'This privacy notice version and purpose are already recorded.',
            ]);
        }

        $audit->record(
            $request->user(),
            'resident.privacy_notice_recorded',
            'success',
            $request,
            'resident.privacy.record',
            'resident',
            $resident->public_id,
            [
                'notice_version' => $validated['notice_version'],
                'purpose_code' => $validated['purpose_code'],
                'acknowledgement_method' => $validated['acknowledgement_method'],
            ],
        );

        return response()->json([
            'data' => [
                'notice_version' => $acknowledgement->notice_version,
                'purpose_code' => $acknowledgement->purpose_code,
                'acknowledgement_method' => $acknowledgement->acknowledgement_method,
                'acknowledged_at' => $acknowledgement->acknowledged_at?->toIso8601String(),
            ],
        ], 201);
    }
}

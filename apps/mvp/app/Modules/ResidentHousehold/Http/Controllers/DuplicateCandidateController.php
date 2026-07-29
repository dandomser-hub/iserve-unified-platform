<?php

namespace App\Modules\ResidentHousehold\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Models\ResidentDuplicateCandidate;
use App\Services\AuthorizationAudit;
use App\Services\ScopedAuthorization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class DuplicateCandidateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ResidentDuplicateCandidate::query()
            ->with([
                'residentA:id,public_id,resident_number,barangay_code,municipality_code,first_name,middle_name,last_name,birth_date,status,classification',
                'residentB:id,public_id,resident_number,barangay_code,municipality_code,first_name,middle_name,last_name,birth_date,status,classification',
            ])
            ->whereHas('residentA', function ($builder) use ($request): void {
                $builder->where('barangay_code', $request->user()->barangay_code);
            });

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        return response()->json([
            'data' => $query->orderByDesc('match_score')
                ->limit(100)
                ->get()
                ->map(fn (ResidentDuplicateCandidate $candidate): array => $this->response($candidate)),
        ]);
    }

    public function update(
        Request $request,
        ResidentDuplicateCandidate $candidate,
        AuthorizationAudit $audit,
        ScopedAuthorization $authorization,
    ): JsonResponse {
        $candidate->loadMissing(['residentA', 'residentB']);
        $authorization->authorize($request, 'resident.duplicate.review', $candidate->residentA);
        $authorization->authorize($request, 'resident.duplicate.review', $candidate->residentB);

        $validated = $request->validate([
            'decision' => ['required', 'string', Rule::in(['not_duplicate', 'confirmed_duplicate', 'deferred'])],
            'surviving_resident_public_id' => [
                Rule::requiredIf($request->input('decision') === 'confirmed_duplicate'),
                'nullable',
                'uuid',
            ],
            'review_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $survivor = null;
        if (isset($validated['surviving_resident_public_id'])) {
            $survivor = Resident::query()
                ->where('public_id', $validated['surviving_resident_public_id'])
                ->firstOrFail();

            abort_unless(
                in_array($survivor->getKey(), [
                    $candidate->resident_a_id,
                    $candidate->resident_b_id,
                ], true),
                422,
            );
        }

        $candidate = DB::transaction(function () use (
            $candidate,
            $validated,
            $survivor,
            $request,
        ): ResidentDuplicateCandidate {
            $lockedCandidate = ResidentDuplicateCandidate::query()
                ->lockForUpdate()
                ->findOrFail($candidate->getKey());

            if (! in_array($lockedCandidate->status, ['pending_review', 'deferred'], true)) {
                throw ValidationException::withMessages([
                    'decision' => 'A completed duplicate review cannot be overwritten.',
                ]);
            }

            $lockedCandidate->update([
                'status' => $validated['decision'],
                'surviving_resident_id' => $survivor?->getKey(),
                'reviewed_by' => $request->user()->getKey(),
                'reviewed_at' => now(),
                'review_notes' => $validated['review_notes'] ?? null,
            ]);

            return $lockedCandidate;
        });

        $audit->record(
            $request->user(),
            'resident.duplicate_reviewed',
            'success',
            $request,
            'resident.duplicate.review',
            'resident_duplicate_candidate',
            $candidate->getKey(),
            [
                'decision' => $validated['decision'],
                'surviving_resident_public_id' => $survivor?->public_id,
            ],
        );

        return response()->json(['data' => $this->response($candidate->refresh()->load(['residentA', 'residentB']))]);
    }

    private function response(ResidentDuplicateCandidate $candidate): array
    {
        return [
            'candidate_id' => $candidate->getKey(),
            'match_score' => $candidate->match_score,
            'match_signals' => $candidate->match_signals,
            'status' => $candidate->status,
            'resident_a' => $this->residentSummary($candidate->residentA),
            'resident_b' => $this->residentSummary($candidate->residentB),
            'reviewed_at' => $candidate->reviewed_at?->toIso8601String(),
            'review_notes' => $candidate->review_notes,
        ];
    }

    private function residentSummary(?Resident $resident): ?array
    {
        if ($resident === null) {
            return null;
        }

        return [
            'public_id' => $resident->public_id,
            'resident_number' => $resident->resident_number,
            'name' => trim("{$resident->last_name}, {$resident->first_name} {$resident->middle_name}"),
            'birth_date' => $resident->birth_date?->toDateString(),
            'status' => $resident->status,
        ];
    }
}

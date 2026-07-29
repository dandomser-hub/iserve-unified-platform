<?php

namespace App\Modules\ResidentHousehold\Services;

use App\Modules\ResidentHousehold\Models\Resident;
use App\Modules\ResidentHousehold\Models\ResidentDuplicateCandidate;
use Illuminate\Support\Str;

class DuplicateCandidateDetector
{
    /**
     * @return list<ResidentDuplicateCandidate>
     */
    public function detectFor(Resident $resident): array
    {
        $candidates = Resident::query()
            ->where('barangay_code', $resident->barangay_code)
            ->where($resident->getKeyName(), '!=', $resident->getKey())
            ->whereDate('birth_date', $resident->birth_date)
            ->get()
            ->filter(fn (Resident $candidate): bool =>
                $this->normalize($candidate->first_name) === $this->normalize($resident->first_name)
                && $this->normalize($candidate->last_name) === $this->normalize($resident->last_name)
            );

        return $candidates
            ->map(function (Resident $candidate) use ($resident): ResidentDuplicateCandidate {
                [$residentA, $residentB] = collect([$resident, $candidate])
                    ->sortBy(fn (Resident $item) => $item->getKey())
                    ->values()
                    ->all();

                $signals = [
                    'normalized_first_name',
                    'normalized_last_name',
                    'birth_date',
                ];
                $matchScore = 90;
                $residentMiddle = $this->normalize((string) $resident->middle_name);
                $candidateMiddle = $this->normalize((string) $candidate->middle_name);

                if ($residentMiddle !== '' && $residentMiddle === $candidateMiddle) {
                    $signals[] = 'normalized_middle_name';
                    $matchScore = 100;
                }

                return ResidentDuplicateCandidate::query()->firstOrCreate(
                    [
                        'resident_a_id' => $residentA->getKey(),
                        'resident_b_id' => $residentB->getKey(),
                    ],
                    [
                        'match_score' => $matchScore,
                        'match_signals' => $signals,
                        'status' => 'pending_review',
                    ],
                );
            })
            ->values()
            ->all();
    }

    private function normalize(string $value): string
    {
        return (string) Str::of($value)
            ->ascii()
            ->lower()
            ->replaceMatches('/[^a-z0-9]/', '');
    }
}

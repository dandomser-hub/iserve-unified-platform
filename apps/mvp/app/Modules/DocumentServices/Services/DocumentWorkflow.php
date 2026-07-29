<?php

namespace App\Modules\DocumentServices\Services;

use App\Models\User;
use App\Modules\DocumentServices\Models\DocumentRequest;
use App\Modules\DocumentServices\Models\IssuedDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class DocumentWorkflow
{
    public function __construct(
        private readonly DocumentIdentifier $identifier,
        private readonly PrivatePdfGenerator $pdf,
    ) {}

    public function submit(DocumentRequest $request, User $actor): DocumentRequest
    {
        return $this->transition($request, $actor, ['draft', 'returned'], 'submitted', 'submitted');
    }

    public function checkRequirements(
        DocumentRequest $request,
        User $actor,
        array $evidence,
        ?string $notes,
    ): DocumentRequest {
        $required = $request->templateVersion->requirement_codes;
        $verified = collect($evidence)
            ->filter(fn (array $item): bool => in_array(
                $item['status'] ?? '',
                config('document_services.requirement_statuses'),
                true,
            ))
            ->pluck('code')
            ->unique();
        $missing = collect($required)->diff($verified)->values()->all();

        if ($missing !== []) {
            throw ValidationException::withMessages([
                'requirement_evidence' => 'Missing verified requirements: '.implode(', ', $missing),
            ]);
        }

        return DB::transaction(function () use ($request, $actor, $evidence, $notes): DocumentRequest {
            $locked = $this->lock($request, ['submitted']);
            $locked->update([
                'requirement_evidence' => array_values($evidence),
                'updated_by' => $actor->getKey(),
            ]);

            return $this->recordTransition($locked, $actor, 'requirements_checked', 'requirements_checked', $notes);
        });
    }

    public function referenceFee(
        DocumentRequest $request,
        User $actor,
        ?string $exemptionCode,
        ?string $notes,
    ): DocumentRequest {
        $version = $request->templateVersion;
        if ($exemptionCode !== null && ! in_array($exemptionCode, $version->exemption_codes, true)) {
            throw ValidationException::withMessages([
                'exemption_code' => 'The exemption is not allowed by this template version.',
            ]);
        }

        return DB::transaction(function () use (
            $request,
            $actor,
            $exemptionCode,
            $notes,
            $version,
        ): DocumentRequest {
            $locked = $this->lock($request, ['requirements_checked']);
            $locked->update([
                'fee_reference' => [
                    'reference_only' => true,
                    'standard_amount' => (string) $version->fee_amount,
                    'amount_due_reference' => $exemptionCode === null ? (string) $version->fee_amount : '0.00',
                    'exemption_code' => $exemptionCode,
                    'recorded_at' => now()->toIso8601String(),
                ],
                'updated_by' => $actor->getKey(),
            ]);

            return $this->recordTransition($locked, $actor, 'fee_referenced', 'fee_referenced', $notes);
        });
    }

    public function decide(
        DocumentRequest $request,
        User $actor,
        string $decision,
        ?string $notes,
    ): DocumentRequest {
        $target = $decision === 'approve' ? 'approved' : 'returned';

        return $this->transition($request, $actor, ['fee_referenced'], $target, $decision, $notes);
    }

    /**
     * @return array{request: DocumentRequest, issued_document: IssuedDocument, verification_token: string, verification_url: string}
     */
    public function generate(DocumentRequest $request, User $actor, string $baseUrl): array
    {
        return DB::transaction(function () use ($request, $actor, $baseUrl): array {
            $locked = $this->lock($request, ['approved']);

            return $this->createIssuedDocument($locked, $actor, $baseUrl, 1, 'generated');
        });
    }

    public function release(DocumentRequest $request, User $actor, ?string $notes): DocumentRequest
    {
        return DB::transaction(function () use ($request, $actor, $notes): DocumentRequest {
            $locked = $this->lock($request, ['generated']);
            $issued = $locked->issuedDocuments()
                ->where('status', 'valid')
                ->lockForUpdate()
                ->latest('revision')
                ->firstOrFail();
            $issued->update(['released_by' => $actor->getKey(), 'released_at' => now()]);
            $this->releaseLog($locked, $issued, $actor, 'released', $notes);

            return $this->recordTransition($locked, $actor, 'released', 'released', $notes);
        });
    }

    /**
     * @return array{request: DocumentRequest, issued_document: IssuedDocument, verification_token: string, verification_url: string}
     */
    public function reprint(
        DocumentRequest $request,
        User $actor,
        string $reason,
        string $baseUrl,
    ): array {
        return DB::transaction(function () use ($request, $actor, $reason, $baseUrl): array {
            $locked = $this->lock($request, ['released']);
            $latest = $locked->issuedDocuments()->lockForUpdate()->latest('revision')->firstOrFail();
            $latest->update(['status' => 'superseded']);
            $result = $this->createIssuedDocument(
                $locked,
                $actor,
                $baseUrl,
                $latest->revision + 1,
                'reprinted',
                $reason,
            );
            $result['issued_document']->update([
                'released_by' => $actor->getKey(),
                'released_at' => now(),
            ]);

            return $result;
        });
    }

    public function void(DocumentRequest $request, User $actor, string $reason): DocumentRequest
    {
        return DB::transaction(function () use ($request, $actor, $reason): DocumentRequest {
            $locked = $this->lock($request, ['generated', 'released']);
            $issued = $locked->issuedDocuments()
                ->where('status', 'valid')
                ->lockForUpdate()
                ->latest('revision')
                ->firstOrFail();
            $issued->update([
                'status' => 'voided',
                'voided_by' => $actor->getKey(),
                'voided_at' => now(),
                'void_reason' => $reason,
            ]);
            $this->releaseLog($locked, $issued, $actor, 'voided', $reason);

            return $this->recordTransition($locked, $actor, 'voided', 'voided', $reason);
        });
    }

    private function transition(
        DocumentRequest $request,
        User $actor,
        array $from,
        string $to,
        string $action,
        ?string $notes = null,
    ): DocumentRequest {
        return DB::transaction(function () use ($request, $actor, $from, $to, $action, $notes): DocumentRequest {
            $locked = $this->lock($request, $from);

            return $this->recordTransition($locked, $actor, $to, $action, $notes);
        });
    }

    private function recordTransition(
        DocumentRequest $request,
        User $actor,
        string $to,
        string $action,
        ?string $notes = null,
    ): DocumentRequest {
        $from = $request->status;
        $request->update(['status' => $to, 'updated_by' => $actor->getKey()]);
        $request->workflowEvents()->create([
            'action' => $action,
            'from_status' => $from,
            'to_status' => $to,
            'notes' => $notes,
            'actor_user_id' => $actor->getKey(),
        ]);

        return $request->refresh();
    }

    private function lock(DocumentRequest $request, array $expected): DocumentRequest
    {
        $locked = DocumentRequest::query()->lockForUpdate()->findOrFail($request->getKey());
        $locked->loadMissing('templateVersion');

        if (! in_array($locked->status, $expected, true)) {
            throw ValidationException::withMessages([
                'status' => "Action is not allowed while the request is {$locked->status}.",
            ]);
        }

        return $locked;
    }

    /**
     * @return array{request: DocumentRequest, issued_document: IssuedDocument, verification_token: string, verification_url: string}
     */
    private function createIssuedDocument(
        DocumentRequest $request,
        User $actor,
        string $baseUrl,
        int $revision,
        string $action,
        ?string $reason = null,
    ): array {
        $token = bin2hex(random_bytes(32));
        $verificationUrl = rtrim($baseUrl, '/')
            .config('document_services.verification_path').'/'.$token;
        $serial = $this->identifier->serialNumber($request->barangay_code, $revision);
        $pdf = $this->pdf->generate($request, $serial, $verificationUrl, $revision);
        $issued = $request->issuedDocuments()->create([
            'public_id' => (string) Str::uuid(),
            'serial_number' => $serial,
            'revision' => $revision,
            'pdf_path' => $pdf['path'],
            'pdf_checksum' => $pdf['checksum'],
            'verification_token_hash' => hash('sha256', $token),
            'status' => 'valid',
            'generated_by' => $actor->getKey(),
            'generated_at' => now(),
        ]);
        $this->releaseLog($request, $issued, $actor, $action, $reason);
        if ($request->status === 'approved') {
            $request = $this->recordTransition($request, $actor, 'generated', 'generated');
        }

        return [
            'request' => $request,
            'issued_document' => $issued,
            'verification_token' => $token,
            'verification_url' => $verificationUrl,
        ];
    }

    private function releaseLog(
        DocumentRequest $request,
        IssuedDocument $issued,
        User $actor,
        string $action,
        ?string $reason,
    ): void {
        $request->releaseLogs()->create([
            'issued_document_id' => $issued->getKey(),
            'action' => $action,
            'reason' => $reason,
            'actor_user_id' => $actor->getKey(),
            'occurred_at' => now(),
        ]);
    }
}

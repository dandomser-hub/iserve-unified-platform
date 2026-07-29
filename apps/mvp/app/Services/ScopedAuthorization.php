<?php

namespace App\Services;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ScopedAuthorization
{
    public function __construct(
        private readonly AuthorizationAudit $audit,
    ) {}

    public function authorize(Request $request, string $ability, mixed $record): void
    {
        $request->attributes->set('authorization_ability', $ability);

        try {
            Gate::forUser($request->user())->authorize($ability, $record);
        } catch (AuthorizationException $exception) {
            $this->audit->denied($request->user(), $ability, $request);
            $request->attributes->set('authorization_denial_audited', true);

            throw $exception;
        }
    }
}

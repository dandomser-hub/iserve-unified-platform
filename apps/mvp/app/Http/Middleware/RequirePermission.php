<?php

namespace App\Http\Middleware;

use App\Services\AuthorizationAudit;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class RequirePermission
{
    public function __construct(
        private readonly AuthorizationAudit $audit,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next, string $ability): Response
    {
        $request->attributes->set('authorization_ability', $ability);

        try {
            Gate::forUser($request->user())->authorize($ability);
        } catch (AuthorizationException $exception) {
            $this->audit->denied($request->user(), $ability, $request);
            $request->attributes->set('authorization_denial_audited', true);

            throw $exception;
        }

        return $next($request);
    }
}

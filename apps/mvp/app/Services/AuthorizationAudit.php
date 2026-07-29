<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class AuthorizationAudit
{
    public function denied(User $user, string $ability, Request $request): void
    {
        $this->record(
            user: $user,
            eventType: 'authorization.denied',
            outcome: 'denied',
            request: $request,
            ability: $ability,
        );
    }

    public function record(
        User $user,
        string $eventType,
        string $outcome,
        Request $request,
        ?string $ability = null,
        ?string $resourceType = null,
        string|int|null $resourceId = null,
        array $metadata = [],
    ): void {
        try {
            AuditEvent::query()->create([
                'actor_user_id' => $user->getKey(),
                'event_type' => $eventType,
                'outcome' => $outcome,
                'ability' => $ability,
                'route_name' => $request->route()?->getName(),
                'request_method' => $request->method(),
                'request_path' => $request->path(),
                'resource_type' => $resourceType,
                'resource_id' => $resourceId === null ? null : (string) $resourceId,
                'metadata' => [
                    'ip_address' => $request->ip(),
                    'user_agent' => mb_substr((string) $request->userAgent(), 0, 512),
                    ...$metadata,
                ],
            ]);
        } catch (Throwable $exception) {
            Log::warning('Unable to persist authorization audit event.', [
                'event_type' => $eventType,
                'ability' => $ability,
                'actor_user_id' => $user->getKey(),
                'exception' => $exception::class,
            ]);
        }
    }
}

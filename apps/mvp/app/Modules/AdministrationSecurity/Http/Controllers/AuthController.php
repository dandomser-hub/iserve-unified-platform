<?php

namespace App\Modules\AdministrationSecurity\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthorizationAudit;
use App\Services\RecordScope;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function csrf(Request $request): JsonResponse
    {
        return response()->json([
            'csrf_token' => $request->session()->token(),
        ]);
    }

    /**
     * @throws ValidationException
     */
    public function login(
        Request $request,
        AuthorizationAudit $audit,
        RecordScope $recordScope,
    ): JsonResponse {
        $credentials = Validator::make($request->all(), [
            'email' => ['required', 'email:rfc', 'max:255'],
            'password' => ['required', 'string', 'max:4096'],
        ])->validate();

        $email = mb_strtolower($credentials['email']);
        $user = User::query()->whereRaw('LOWER(email) = ?', [$email])->first();

        if ($user?->locked_until?->isFuture()) {
            throw ValidationException::withMessages([
                'email' => ['The credentials could not be accepted. Try again later.'],
            ]);
        }

        $authenticated = Auth::attempt([
            'email' => $email,
            'password' => $credentials['password'],
            'is_active' => true,
        ]);

        if (! $authenticated) {
            $this->recordFailedAttempt($user);

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are invalid.'],
            ]);
        }

        $request->session()->regenerate();
        $user = $request->user();
        $user->forceFill([
            'failed_login_attempts' => 0,
            'locked_until' => null,
            'last_login_at' => now(),
        ])->save();

        $audit->record($user, 'authentication.login', 'succeeded', $request);

        return response()->json($this->identityPayload($user, $recordScope));
    }

    public function me(Request $request, RecordScope $recordScope): JsonResponse
    {
        return response()->json(
            $this->identityPayload($request->user(), $recordScope),
        );
    }

    public function logout(Request $request, AuthorizationAudit $audit): JsonResponse
    {
        $audit->record(
            $request->user(),
            'authentication.logout',
            'succeeded',
            $request,
        );

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => 'signed_out']);
    }

    private function recordFailedAttempt(?User $user): void
    {
        if (! $user || ! $user->is_active) {
            return;
        }

        $attempts = $user->failed_login_attempts + 1;
        $lockAfter = (int) config('authorization.lockout.attempts', 5);

        $user->forceFill([
            'failed_login_attempts' => $attempts >= $lockAfter ? 0 : $attempts,
            'locked_until' => $attempts >= $lockAfter
                ? now()->addMinutes((int) config('authorization.lockout.minutes', 15))
                : null,
        ])->save();
    }

    /**
     * @return array<string, mixed>
     */
    private function identityPayload(User $user, RecordScope $recordScope): array
    {
        return [
            'user' => [
                'id' => $user->getKey(),
                'name' => $user->name,
                'email' => $user->email,
            ],
            'roles' => $user->roles()->pluck('code')->sort()->values(),
            'permissions' => $user->permissionCodes(),
            'scope' => $recordScope->descriptor($user),
        ];
    }
}

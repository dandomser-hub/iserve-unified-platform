<?php

namespace App\Providers;

use App\Models\User;
use App\Services\RecordScope;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        foreach (array_keys(config('authorization.permissions', [])) as $ability) {
            Gate::define(
                $ability,
                fn (User $user, mixed $record = null): bool =>
                    $user->hasPermission($ability)
                    && app(RecordScope::class)->allows($user, $record),
            );
        }

        RateLimiter::for('login', function (Request $request): Limit {
            $email = mb_strtolower((string) $request->input('email'));

            return Limit::perMinute(5)->by($email.'|'.$request->ip());
        });
    }
}

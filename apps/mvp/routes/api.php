<?php

use Illuminate\Support\Facades\Route;

Route::get('/health', static fn (): array => [
    'status' => 'ok',
    'service' => 'barangay-iserve-mvp',
    'api_version' => 'v1',
])->name('health');

foreach (config('modules.domains', []) as $module) {
    $publicRouteFile = base_path($module['path'].'/routes/public.php');

    if (is_file($publicRouteFile)) {
        Route::middleware('web')->group($publicRouteFile);
    }
}

Route::middleware(['web', 'auth'])->group(function (): void {
    foreach (config('modules.domains', []) as $module) {
        $routeFile = base_path($module['path'].'/routes/api.php');

        if (is_file($routeFile)) {
            require $routeFile;
        }
    }
});

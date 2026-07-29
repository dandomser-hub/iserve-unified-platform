<?php

use App\Modules\AdministrationSecurity\Http\Controllers\AuditEventController;
use App\Modules\AdministrationSecurity\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function (): void {
    Route::get('/me', [AuthController::class, 'me'])->name('me');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::prefix('administration/security')
    ->name('administration.security.')
    ->group(function (): void {
        Route::get('/audit-events', [AuditEventController::class, 'index'])
            ->middleware('permission:administration.audit.view')
            ->name('audit-events.index');
    });

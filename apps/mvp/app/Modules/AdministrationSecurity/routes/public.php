<?php

use App\Modules\AdministrationSecurity\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->name('auth.')->group(function (): void {
    Route::get('/csrf', [AuthController::class, 'csrf'])
        ->middleware('throttle:30,1')
        ->name('csrf');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login')
        ->name('login');
});

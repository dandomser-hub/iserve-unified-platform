<?php

use App\Modules\DocumentServices\Http\Controllers\PublicVerificationController;
use Illuminate\Support\Facades\Route;

Route::get('/document-services/verify/{token}', [PublicVerificationController::class, 'show'])
    ->middleware('throttle:30,1')
    ->name('document-services.verify');

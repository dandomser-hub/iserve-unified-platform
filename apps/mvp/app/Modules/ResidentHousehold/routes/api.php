<?php

use App\Modules\ResidentHousehold\Http\Controllers\DuplicateCandidateController;
use App\Modules\ResidentHousehold\Http\Controllers\HouseholdController;
use App\Modules\ResidentHousehold\Http\Controllers\HouseholdMembershipController;
use App\Modules\ResidentHousehold\Http\Controllers\PrivacyAcknowledgementController;
use App\Modules\ResidentHousehold\Http\Controllers\PurokController;
use App\Modules\ResidentHousehold\Http\Controllers\ResidentController;
use App\Modules\ResidentHousehold\Http\Controllers\ResidentStatusController;
use Illuminate\Support\Facades\Route;

Route::prefix('resident-household')->name('resident-household.')->group(function (): void {
    Route::get('/puroks', [PurokController::class, 'index'])
        ->middleware('permission:resident.reference.view')
        ->name('puroks.index');
    Route::post('/puroks', [PurokController::class, 'store'])
        ->middleware('permission:resident.reference.manage')
        ->name('puroks.store');
    Route::patch('/puroks/{purok}', [PurokController::class, 'update'])
        ->middleware('permission:resident.reference.manage')
        ->name('puroks.update');

    Route::get('/residents', [ResidentController::class, 'index'])
        ->middleware('permission:resident.lookup')
        ->name('residents.index');
    Route::post('/residents', [ResidentController::class, 'store'])
        ->middleware('permission:resident.create')
        ->name('residents.store');
    Route::get('/residents/{resident}', [ResidentController::class, 'show'])
        ->middleware('permission:resident.view')
        ->name('residents.show');
    Route::patch('/residents/{resident}', [ResidentController::class, 'update'])
        ->middleware('permission:resident.update')
        ->name('residents.update');
    Route::post('/residents/{resident}/status-history', [ResidentStatusController::class, 'store'])
        ->middleware('permission:resident.status.manage')
        ->name('residents.status.store');
    Route::post(
        '/residents/{resident}/privacy-acknowledgements',
        [PrivacyAcknowledgementController::class, 'store'],
    )
        ->middleware('permission:resident.privacy.record')
        ->name('residents.privacy.store');

    Route::get('/households', [HouseholdController::class, 'index'])
        ->middleware('permission:resident.lookup')
        ->name('households.index');
    Route::post('/households', [HouseholdController::class, 'store'])
        ->middleware('permission:resident.create')
        ->name('households.store');
    Route::get('/households/{household}', [HouseholdController::class, 'show'])
        ->middleware('permission:resident.view')
        ->name('households.show');
    Route::post('/households/{household}/memberships', [HouseholdMembershipController::class, 'store'])
        ->middleware('permission:resident.update')
        ->name('households.memberships.store');
    Route::patch('/household-memberships/{membership}/end', [HouseholdMembershipController::class, 'end'])
        ->middleware('permission:resident.update')
        ->name('households.memberships.end');

    Route::get('/duplicate-candidates', [DuplicateCandidateController::class, 'index'])
        ->middleware('permission:resident.duplicate.review')
        ->name('duplicates.index');
    Route::patch('/duplicate-candidates/{candidate}', [DuplicateCandidateController::class, 'update'])
        ->middleware('permission:resident.duplicate.review')
        ->name('duplicates.update');
});

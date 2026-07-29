<?php

use App\Modules\DocumentServices\Http\Controllers\DocumentOutputController;
use App\Modules\DocumentServices\Http\Controllers\DocumentRequestController;
use App\Modules\DocumentServices\Http\Controllers\DocumentWorkflowController;
use App\Modules\DocumentServices\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

Route::prefix('document-services')->name('document-services.')->group(function (): void {
    Route::get('/templates', [TemplateController::class, 'index'])
        ->middleware('permission:document.view')->name('templates.index');
    Route::post('/templates', [TemplateController::class, 'store'])
        ->middleware('permission:document.template.manage')->name('templates.store');
    Route::post('/templates/{template}/versions', [TemplateController::class, 'addVersion'])
        ->middleware('permission:document.template.manage')->name('templates.versions.store');
    Route::post('/templates/{template}/versions/{version}/publish', [TemplateController::class, 'publish'])
        ->middleware('permission:document.template.manage')->name('templates.versions.publish');

    Route::get('/requests', [DocumentRequestController::class, 'index'])
        ->middleware('permission:document.view')->name('requests.index');
    Route::post('/requests', [DocumentRequestController::class, 'store'])
        ->middleware('permission:document.create')->name('requests.store');
    Route::get('/requests/{documentRequest}', [DocumentRequestController::class, 'show'])
        ->middleware('permission:document.view')->name('requests.show');
    Route::patch('/requests/{documentRequest}', [DocumentRequestController::class, 'update'])
        ->middleware('permission:document.update')->name('requests.update');

    Route::post('/requests/{documentRequest}/submit', [DocumentWorkflowController::class, 'submit'])
        ->middleware('permission:document.update')->name('requests.submit');
    Route::post('/requests/{documentRequest}/requirements-check', [DocumentWorkflowController::class, 'checkRequirements'])
        ->middleware('permission:document.requirements.check')->name('requests.requirements-check');
    Route::post('/requests/{documentRequest}/fee-reference', [DocumentWorkflowController::class, 'referenceFee'])
        ->middleware('permission:document.fee.reference')->name('requests.fee-reference');
    Route::post('/requests/{documentRequest}/decision', [DocumentWorkflowController::class, 'decide'])
        ->middleware('permission:document.approve')->name('requests.decision');
    Route::post('/requests/{documentRequest}/generate', [DocumentWorkflowController::class, 'generate'])
        ->middleware('permission:document.export')->name('requests.generate');
    Route::post('/requests/{documentRequest}/release', [DocumentWorkflowController::class, 'release'])
        ->middleware('permission:document.release')->name('requests.release');
    Route::post('/requests/{documentRequest}/reprint', [DocumentWorkflowController::class, 'reprint'])
        ->middleware('permission:document.reprint')->name('requests.reprint');
    Route::post('/requests/{documentRequest}/void', [DocumentWorkflowController::class, 'void'])
        ->middleware('permission:document.void')->name('requests.void');
    Route::get('/requests/{documentRequest}/issued/{issuedDocument}/pdf', [DocumentOutputController::class, 'download'])
        ->middleware('permission:document.export')->name('requests.pdf');
});

<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Models\Document;
use App\Models\SkDocument;
use App\Services\DocumentGenerator\DocumentGenerationService;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web & Inertia Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Index'))->name('dashboard');
    Route::get('/gtk', fn() => Inertia::render('GTK/Index'))->name('gtk.index');
    Route::get('/students', fn() => Inertia::render('Students/Index'))->name('students.index');
    Route::get('/classrooms', fn() => Inertia::render('Classrooms/Index'))->name('classrooms.index');
    Route::get('/curriculum', fn() => Inertia::render('Curriculum/Index'))->name('curriculum.index');
    Route::get('/dapodik', fn() => Inertia::render('Dapodik/Index'))->name('dapodik.index');
    Route::get('/pip', fn() => Inertia::render('PIP/Index'))->name('pip.index');
    Route::get('/archives', fn() => Inertia::render('Archives/Index'))->name('archives.index');
    Route::get('/documents/sk', fn() => Inertia::render('Documents/Index'))->name('sk.index');
    Route::get('/journals', fn() => Inertia::render('Journals/Index'))->name('journals.index');
    Route::get('/calendar', fn() => Inertia::render('Calendar/Index'))->name('calendar.index');
    Route::get('/reports', fn() => Inertia::render('Reports/Index'))->name('reports.index');
    Route::get('/settings', fn() => Inertia::render('Settings/Index'))->name('settings.index');
});

// Secure signed document download route with temporary expiration
Route::get('/documents/download/{id}', function (int $id) {
    if (!request()->hasValidSignature()) {
        abort(403, 'Tautan unduhan telah kedaluwarsa atau tidak valid.');
    }

    $document = Document::findOrFail($id);

    if (!Storage::disk('local')->exists($document->file_path)) {
        abort(404, 'Berkas fisik dokumen tidak ditemukan.');
    }

    return Storage::disk('local')->download($document->file_path, $document->original_name);
})->name('documents.download');

// Public QR Code Validation Page
Route::get('/sk/verify-qr/{token}', function (string $token) {
    $service = app(DocumentGenerationService::class);
    $verification = $service->verifyDocumentByToken($token);

    return Inertia::render('Documents/QrVerification', [
        'verification' => $verification,
    ]);
})->name('sk.verify.qr');


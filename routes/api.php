<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\v1\AuthController;
use App\Http\Controllers\Api\v1\DashboardController;
use App\Http\Controllers\Api\v1\TeacherController;
use App\Http\Controllers\Api\v1\StudentController;
use App\Http\Controllers\Api\v1\ClassroomController;
use App\Http\Controllers\Api\v1\WorkloadController;
use App\Http\Controllers\Api\v1\DapodikController;
use App\Http\Controllers\Api\v1\PipController;
use App\Http\Controllers\Api\v1\DocumentController;
use App\Http\Controllers\Api\v1\SkController;
use App\Http\Controllers\Api\v1\JournalController;
use App\Http\Controllers\Api\v1\CalendarController;
use App\Http\Controllers\Api\v1\ReportController;

/*
|--------------------------------------------------------------------------
| REST API Routes (v1)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Public Authentication & QR verification
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
    });

    Route::get('sk/verify/{token}', [SkController::class, 'verifyQr']);

    // Authenticated API Routes
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::post('change-password', [AuthController::class, 'changePassword']);
        });

        // Dashboard
        Route::prefix('dashboard')->group(function () {
            Route::get('/', [DashboardController::class, 'index']);
            Route::get('statistics', [DashboardController::class, 'index']);
        });

        // GTK
        Route::apiResource('teachers', TeacherController::class);

        // Siswa
        Route::apiResource('students', StudentController::class);

        // Kurikulum & Rombel
        Route::apiResource('classrooms', ClassroomController::class);
        Route::post('classrooms/{id}/assign-student', [ClassroomController::class, 'assignStudent']);

        Route::prefix('workloads')->group(function () {
            Route::get('/', [WorkloadController::class, 'index']);
            Route::get('teachers/{id}', [WorkloadController::class, 'teacherWorkload']);
            Route::post('simulate', [WorkloadController::class, 'simulate']);
        });

        // Dapodik & Imports
        Route::prefix('imports')->group(function () {
            Route::post('preview', [DapodikController::class, 'previewImport']);
            Route::post('commit', [DapodikController::class, 'commitImport']);
            Route::get('history', [DapodikController::class, 'history']);
        });

        Route::prefix('dapodik')->group(function () {
            Route::get('connection', [DapodikController::class, 'connectionStatus']);
            Route::post('test-connection', [DapodikController::class, 'testConnection']);
        });

        // PIP
        Route::prefix('pip')->group(function () {
            Route::get('/', [PipController::class, 'index']);
            Route::put('{id}/status', [PipController::class, 'updateStatus']);
            Route::get('{id}/history', [PipController::class, 'history']);
            Route::post('reports/sptjm', [PipController::class, 'generateSptjmReport']);
        });

        // E-Arsip
        Route::prefix('documents')->group(function () {
            Route::get('/', [DocumentController::class, 'index']);
            Route::post('/', [DocumentController::class, 'store']);
            Route::get('{id}/download-url', [DocumentController::class, 'signedDownloadUrl']);
            Route::post('{id}/verify', [DocumentController::class, 'verify']);
        });

        // Generator SK
        Route::prefix('sk')->group(function () {
            Route::get('/', [SkController::class, 'index']);
            Route::post('/', [SkController::class, 'store']);
            Route::get('{id}', [SkController::class, 'show']);
            Route::post('{id}/submit', [SkController::class, 'submit']);
            Route::post('{id}/approve', [SkController::class, 'approve']);
        });

        // JURNAL HARIAN OPS (Core Module)
        Route::prefix('journals')->group(function () {
            Route::get('/', [JournalController::class, 'index']);
            Route::post('/', [JournalController::class, 'store']);
            Route::get('calendar', [JournalController::class, 'calendar']);
            Route::get('reports/weekly', [JournalController::class, 'weeklyReport']);
            Route::get('reports/monthly', [JournalController::class, 'monthlyReport']);
            Route::get('{id}', [JournalController::class, 'show']);
            Route::post('{id}/activities', [JournalController::class, 'addActivity']);
            Route::put('{id}/activities/{activityId}', [JournalController::class, 'updateActivity']);
            Route::delete('{id}/activities/{activityId}', [JournalController::class, 'deleteActivity']);
            Route::post('{id}/submit', [JournalController::class, 'submit']);
            Route::post('{id}/approve', [JournalController::class, 'approve']);
            Route::post('{id}/request-revision', [JournalController::class, 'requestRevision']);
            Route::get('{id}/report', [JournalController::class, 'dailyReport']);
        });

        // Calendar & Ops Events
        Route::apiResource('events', CalendarController::class);

        // Reports
        Route::prefix('reports')->group(function () {
            Route::get('executive-summary', [ReportController::class, 'executiveSummary']);
            Route::get('gtk', [ReportController::class, 'gtkReport']);
            Route::get('students', [ReportController::class, 'studentReport']);
        });

    });
});


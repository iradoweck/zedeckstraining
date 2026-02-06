<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AcademicClassController;
use App\Http\Controllers\Api\EnrollmentController;

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    // Public Routes
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{course}', [CourseController::class, 'show']);

    // Student ID Generation (Public for Registration)
    Route::post('/student-id/check', [\App\Http\Controllers\StudentIdController::class, 'check']);
    Route::post('/student-id/generate', [\App\Http\Controllers\StudentIdController::class, 'generate']);

    // Payments (Public/Hybrid for Registration)
    Route::post('/payments/calculate', [\App\Http\Controllers\PaymentController::class, 'calculate']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Academic Routes
        Route::apiResource('courses', CourseController::class)->except(['index', 'show']);
        Route::apiResource('classes', AcademicClassController::class);
        Route::apiResource('enrollments', EnrollmentController::class);

        // Attendance & Grades
        Route::post('/attendance', [App\Http\Controllers\Api\AttendanceController::class, 'store']);
        Route::get('/attendance', [App\Http\Controllers\Api\AttendanceController::class, 'index']);

        Route::post('/grades', [App\Http\Controllers\Api\GradeController::class, 'store']);
        Route::post('/grades', [App\Http\Controllers\Api\GradeController::class, 'store']);
        Route::get('/grades', [App\Http\Controllers\Api\GradeController::class, 'index']);

        // User Management (Admin)
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class);
    });
});

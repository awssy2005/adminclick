<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DemandeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Api\PasswordResetController;

// ========================================
// Routes publiques
// ========================================

// Auth (avec rate limiting)
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Services publics
Route::get('/services', [DemandeController::class, 'getServices']);

// Réinitialisation de mot de passe
Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink'])->middleware('throttle:5,1');
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword'])->middleware('throttle:5,1');

// ========================================
// Routes protégées (auth:sanctum)
// ========================================
Route::middleware('auth:sanctum')->group(function () {

    // === Auth ===
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // === Vérification d'email ===
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Lien de vérification envoyé.']);
    })->middleware('throttle:6,1')->name('verification.send');

    Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
        $user = \App\Models\User::findOrFail($id);
        if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            return response()->json(['message' => 'Lien de vérification invalide.'], 403);
        }
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }
        return response()->json(['message' => 'Email vérifié avec succès.']);
    })->name('verification.verify');

    // === Demandes ===
    Route::get('/demandes/stats', [DemandeController::class, 'getStats']);
    Route::get('/demandes', [DemandeController::class, 'index']);
    Route::post('/demandes', [DemandeController::class, 'store']);
    Route::get('/demandes/{id}', [DemandeController::class, 'show']);

    // === PDF Export ===
    Route::get('/demandes/{id}/pdf', [PdfController::class, 'downloadDemande']);

    // === Paiements ===
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);

    // === Rendez-vous ===
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // === Notifications ===
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // ========================================
    // Routes Admin
    // ========================================
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/demandes', [AdminController::class, 'allDemandes']);
        Route::put('/demandes/{id}/status', [AdminController::class, 'updateStatus']);
        Route::get('/users', [AdminController::class, 'allUsers']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/activity-logs', [AdminController::class, 'activityLogs']);
        Route::get('/demandes/{id}/logs', [AdminController::class, 'demandeActivityLogs']);
        
        // create-admin 
        Route::post('/create-admin', [AdminController::class, 'createAdmin']);
    });
});
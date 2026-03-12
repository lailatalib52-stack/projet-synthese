<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DemandeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StatController;

/*
|--------------------------------------------------------------------------
| API Routes — AutorisPro OFPPT
|--------------------------------------------------------------------------
*/

// ========== AUTH (public) ==========
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me',        [AuthController::class, 'me'])->middleware('auth:sanctum');

// ========== ROUTES PROTÉGÉES ==========
Route::middleware('auth:sanctum')->group(function () {

    // ---- UTILISATEUR ----
    Route::middleware('role:user')->group(function () {
        Route::get('/mes-demandes',    [DemandeController::class, 'mesDemandes']);
        Route::post('/demandes',       [DemandeController::class, 'store']);
    });

    // ---- MANAGER ----
    Route::middleware('role:manager')->group(function () {
        Route::get('/equipe',                      [UserController::class,   'monEquipe']);
        Route::get('/demandes/en-attente',         [DemandeController::class, 'enAttente']);
        Route::get('/demandes/historique',         [DemandeController::class, 'historique']);
        Route::get('/demandes',                    [DemandeController::class, 'index']);
        Route::get('/demandes/{id}',               [DemandeController::class, 'show']);
        Route::put('/demandes/{id}/accepter',      [DemandeController::class, 'accepter']);
        Route::put('/demandes/{id}/refuser',       [DemandeController::class, 'refuser']);
        Route::post('/demandes/action-groupee',    [DemandeController::class, 'actionGroupee']);
    });

    // ---- ADMIN ----
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('/users',    UserController::class);
        Route::get('/toutes-demandes',  [DemandeController::class, 'toutesLesDemandes']);
        Route::get('/stats',            [StatController::class,    'index']);
    });
});

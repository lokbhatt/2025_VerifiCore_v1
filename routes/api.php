<?php

use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Backend\AdminController;
use App\Http\Controllers\Backend\KycController;
use App\Http\Controllers\Backend\ParentData\DistrictController;
use App\Http\Controllers\Backend\ParentData\GenderController;
use App\Http\Controllers\Backend\ParentData\MunicipalityController;
use App\Http\Controllers\Backend\ParentData\WardController;
use App\Http\Controllers\UserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::controller(AuthController::class)->group(
        function () {
            Route::post('/register/member', 'register');
            Route::post('/login', 'login')->middleware('throttle:login');
        }
    );
});

Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->middleware(['signed'])->name('verification.verify');

Route::post('/email/resend', [EmailVerificationController::class, 'resend'])->middleware(['auth:sanctum', 'throttle:resend-verification'])->name('verification.send');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    Route::get('user/trash', [UserController::class, 'trash']);
    Route::put('user/{id}/restore', [UserController::class, 'restore']);
    Route::delete('user/{id}/force-delete', [UserController::class, 'forceDelete']);
    Route::resource('/user', UserController::class);
    Route::get('admin/admin-profile',[ AdminController::class, 'profile']);
});

Route::middleware(['auth:sanctum', 'verified'])->group(function (){
    Route::get('member/members', [UserController::class, 'memberIndex']);
    Route::get('member/me', [UserController::class, 'showMember']);
    Route::get('/dashboard-stats', [UserController::class, 'dashboardStats']);
});


Route::prefix('parent-data')->middleware('auth:sanctum')->group(function (){
    Route::get('districts/trash', [DistrictController::class, 'trash']);
    Route::post('districts/{id}/restore', [DistrictController::class, 'restore']);
    Route::delete('districts/{id}/force-delete', [DistrictController::class, 'forceDelete']);
    Route::resource('/districts', DistrictController::class);

    // for municipality
    Route::get('municipality/trash', [MunicipalityController::class, 'trash']);
    Route::post('municipality/{id}/restore', [MunicipalityController::class, 'restore']);
    Route::delete('municipality/{id}/force-delete', [MunicipalityController::class, 'forceDelete']);
    Route::resource('/municipality', MunicipalityController::class);
  
    // for ward
    Route::get('ward/trash', [WardController::class, 'trash']);
    Route::post('ward/{id}/restore', [WardController::class, 'restore']);
    Route::delete('ward/{id}/force-delete', [WardController::class, 'forceDelete']);
    Route::resource('/ward', WardController::class);
    
    // for gender
    Route::get('gender/trash', [GenderController::class, 'trash']);
    Route::post('gender/{id}/restore', [GenderController::class, 'restore']);
    Route::delete('gender/{id}/force-delete', [GenderController::class, 'forceDelete']);
    Route::resource('/gender', GenderController::class);
});

Route::middleware('auth:sanctum')->group(function (){
    Route::get('kyc/trash', [KycController::class, 'trash']);
    Route::post('kyc/{id}/restore', [KycController::class, 'restore']);
    Route::delete('kyc/{id}/force-delete', [KycController::class, 'forceDelete']);
    Route::post('kyc/{id}/approve', [KycController::class, 'approve']);
    Route::patch('kyc/{id}/approve', [KycController::class, 'approve']);
    Route::patch('kyc/{id}/reject', [KycController::class, 'reject']);
    Route::resource('/kyc', KycController::class);
});
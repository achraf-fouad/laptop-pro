<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('products', ProductController::class);
Route::get('/categories', [App\Http\Controllers\Api\CategoryController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']); // Public checkout
Route::post('/products/{product}/reviews', [ReviewController::class, 'store']); // Public review submission
Route::get('/reviews/featured', [ReviewController::class, 'featured']); // Get featured reviews

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Staff & Admin Access
    Route::group(['middleware' => 'staff'], function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/sales-graph', [DashboardController::class, 'salesGraph']);

        // Orders Management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        // Reviews Management
        Route::get('/reviews', [ReviewController::class, 'index']);
        Route::get('/reviews/pending', [ReviewController::class, 'pending']);
        Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve']);
        Route::post('/reviews/{review}/toggle-featured', [ReviewController::class, 'toggleFeatured']);

        // Clients Management (View Only for Staff)
        Route::get('/users', [\App\Http\Controllers\Api\UserController::class, 'index']);
        Route::get('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'show']);
    });

    // Admin Only Access
    Route::group(['middleware' => 'admin'], function () {
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
        Route::delete('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // Products Full Management (CRUD)
        Route::apiResource('admin/products', ProductController::class)->except(['index', 'show']);
    });
});

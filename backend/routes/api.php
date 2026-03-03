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

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/sales-graph', [DashboardController::class, 'salesGraph']);
    Route::get('/dashboard/customers', [DashboardController::class, 'customers']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/confirm', [OrderController::class, 'confirm']);
    Route::post('/orders/{order}/decline', [OrderController::class, 'decline']);

    Route::get('/reviews/pending', [ReviewController::class, 'pending']);
    Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve']);
    Route::post('/reviews/{review}/decline', [ReviewController::class, 'decline']);
    Route::post('/reviews/{review}/toggle-featured', [ReviewController::class, 'toggleFeatured']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
});

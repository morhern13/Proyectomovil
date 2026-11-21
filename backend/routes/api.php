<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Candace API Routes
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api/v1
| Auth routes use Sanctum (token-based)
|
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'version' => '0.1.0']);
});

// Auth routes (no authentication required)
Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
    Route::post('/auth/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/auth/me', [\App\Http\Controllers\Api\AuthController::class, 'me']);

    // Companies
    Route::apiResource('companies', \App\Http\Controllers\Api\CompanyController::class);

    // Products
    Route::apiResource('products', \App\Http\Controllers\Api\ProductController::class);
    Route::get('/products/{product}/kardex', [\App\Http\Controllers\Api\ProductController::class, 'kardex']);

    // Categories
    Route::apiResource('categories', \App\Http\Controllers\Api\CategoryController::class);

    // Customers
    Route::apiResource('customers', \App\Http\Controllers\Api\CustomerController::class);

    // Suppliers
    Route::apiResource('suppliers', \App\Http\Controllers\Api\SupplierController::class);

    // Invoices
    Route::apiResource('invoices', \App\Http\Controllers\Api\InvoiceController::class);

    // Reports
    Route::get('/reports/sales', [\App\Http\Controllers\Api\ReportsController::class, 'sales']);
    Route::get('/reports/inventory', [\App\Http\Controllers\Api\ReportsController::class, 'inventory']);

    // Dashboard
    Route::get('/dashboard/stats', [\App\Http\Controllers\Api\DashboardController::class, 'stats']);
});

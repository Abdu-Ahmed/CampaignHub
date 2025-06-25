<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| Analytics Service API Routes
|--------------------------------------------------------------------------
|
| All routes here require a valid Sanctum token.
|
*/
Route::middleware('auth:sanctum')->group(function () {

    // 1) Time series data for a campaign
    //    /api/analytics/campaigns/{campaign}/daily?from=YYYY-MM-DD&to=YYYY-MM-DD
    Route::get(
        'analytics/campaigns/{campaign}/daily',
        [AnalyticsController::class, 'daily']
    );

    // 2) Dashboard CRUD
    // List:   GET    /api/analytics/dashboards
    // Create: POST   /api/analytics/dashboards
    // Read:   GET    /api/analytics/dashboards/{dashboard}
    // Update: PUT    /api/analytics/dashboards/{dashboard}
    // Delete: DELETE /api/analytics/dashboards/{dashboard}
    Route::apiResource(
        'analytics/dashboards',
        DashboardController::class
    );
});

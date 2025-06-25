<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MetricsController;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Debug: Dump what the router actually has registered
|--------------------------------------------------------------------------
*/
Route::get('debug/kernel', function () {
    $router = app('router');

    return response()->json([
        // middleware groups (web, api…)
        'middleware_groups'      => $router->getMiddlewareGroups(),
        // named route middleware aliases (auth, throttle…)
        'route_middleware_alias' => $router->getMiddleware(),
    ]);
});

/*
|--------------------------------------------------------------------------
| Protected Metrics & Debug Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // Store & fetch metrics
    Route::post('metrics', [
        MetricsController::class, 'store'
    ]);
    Route::get('campaigns/{campaign}/metrics', [
        MetricsController::class, 'index'
    ]);
});

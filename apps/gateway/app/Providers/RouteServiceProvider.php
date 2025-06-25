<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Boot the route definitions.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // Load API routes (we’ll mount /api/graphql here later if desired)
            Route::middleware('api')
                 ->prefix('api')
                 ->group(base_path('routes/api.php'));

            // Load web routes if you have them
            Route::middleware('web')
                 ->group(base_path('routes/web.php'));
        });
    }
}
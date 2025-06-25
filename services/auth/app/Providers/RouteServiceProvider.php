<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Called before routes are loaded.
     */
    public function boot(): void
    {
        parent::boot();

        $this->routes(function () {
            // Load API routes
            Route::middleware('api')
                 ->prefix('api')
                 ->group(base_path('routes/api.php'));

            // Load web routes if you add any
            Route::middleware('web')
                 ->group(base_path('routes/web.php'));
        });
    }
}

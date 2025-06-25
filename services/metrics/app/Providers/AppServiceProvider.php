<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register middleware aliases
        Route::aliasMiddleware('auth', \App\Http\Middleware\Authenticate::class);
        Route::aliasMiddleware('auth.basic', \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class);
        Route::aliasMiddleware('bindings', \Illuminate\Routing\Middleware\SubstituteBindings::class);
        Route::aliasMiddleware('cache.headers', \Illuminate\Http\Middleware\SetCacheHeaders::class);
        Route::aliasMiddleware('can', \Illuminate\Auth\Middleware\Authorize::class);
        Route::aliasMiddleware('guest', \App\Http\Middleware\RedirectIfAuthenticated::class);
        Route::aliasMiddleware('password.confirm', \Illuminate\Auth\Middleware\RequirePassword::class);
        Route::aliasMiddleware('signed', \Illuminate\Routing\Middleware\ValidateSignature::class);
        Route::aliasMiddleware('throttle', \Illuminate\Routing\Middleware\ThrottleRequests::class);
        Route::aliasMiddleware('verified', \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class);
    }
}
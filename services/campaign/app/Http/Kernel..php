<?php
namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middlewareGroups = [
        'api' => [
            // throttle to prevent abuse
            'throttle:api',

            // substitute route bindings
            \Illuminate\Routing\Middleware\SubstituteBindings::class,

            // this is the one that actually runs auth:sanctum
            \Illuminate\Auth\Middleware\Authenticate::class,
        ],
    ];

    protected $routeMiddleware = [
        'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ];
    
}

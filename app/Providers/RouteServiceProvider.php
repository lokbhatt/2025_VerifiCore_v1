<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // limit resend email verification 4 request per 5 minutes
        RateLimiter::for('resend-verification', function (Request $request){
            return standardThrottle($request, 5, 4);
        });

        // limit login attempts five per minute by username + ip
        RateLimiter::for('login', function (Request $request){
            return standardThrottle($request, 1, 5);
        });
    }
}

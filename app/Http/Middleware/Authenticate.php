<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
{
    public function handle($request, Closure $next): Response
    {
        if (!Auth::check()) {
            // Retrieve the route name prefix to determine the intended login route
            $routePrefix = $request->route()->getPrefix();

            if ($routePrefix === '/admin') {
                return redirect()->route('admin.login.form');
            } elseif ($routePrefix === '/staff') {
                return redirect()->route('staff.login.form');
            } elseif ($routePrefix === '/member') {
                return redirect()->route('member.login.form');
            }

            // Default redirect if no specific role is identified
            return redirect()->route('login');
        }

        return $next($request);
    }
}

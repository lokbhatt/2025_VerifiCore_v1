<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    public function handle($request, Closure $next, $role)
    {
        // Ensure the user is authenticated
        $user = Auth::user();

        if (!$user) {
            // Redirect to appropriate login based on role if user is not authenticated
            return $this->redirectToRoleLogin($role);
        }

        // Check if the user has the correct role
        if ($user->role !== $role) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }

    protected function redirectToRoleLogin($role)
    {
        switch ($role) {
            case 'admin':
                return redirect()->route('admin.login.form');
            case 'staff':
                return redirect()->route('staff.login.form');
            case 'member':
                return redirect()->route('member.login.form');
            default:
                abort(403, 'Unauthorized');
        }
    }
}

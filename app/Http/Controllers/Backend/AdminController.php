<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends BaseController
{
    public function profile()
    {
        $user = auth()->user();

        if (!$user->hasRole('admin')) {
            return $this->errorMessage('Unauthorized access.', 403);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }
}

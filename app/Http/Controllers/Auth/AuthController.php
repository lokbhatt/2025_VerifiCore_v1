<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class AuthController extends BaseController
{
    /**
     * Store a newly created resource in storage.
     */
    public function register(RegisterUserRequest $request)
    {
        DB::beginTransaction();

        try {
            $roleName = 'member';

            $userRole = Role::where('name', $roleName)->first();
            if (!$userRole) {
                return $this->errorMessage('Role not found in system.', [], 500);
            }

            $user = User::create([
                'name'     => $request->name,
                'email'    => $request->email,
                'username' => $request->username,
                'phone'    => $request->phone,
                'password' => Hash::make($request->password),
                'status'    => 0,
            ]);

            $user->assignRole($roleName);
            event(new Registered($user));

            $token = $user->createToken($roleName . '_token')->plainTextToken;

            DB::commit();

            return $this->successMessage([
                'token' => $token,
            ], 'Member Registered Successfully. Please verify your email.');
        } catch (\Exception $ex) {
            DB::rollBack();
            Log::error('Registration failed', ['exception' => $ex]);

            return $this->errorMessage('Registration Failed', [
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    // login form for all roles
    public function login(LoginRequest $request)
    {
        try {
            $user = User::where('username', $request->username)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->errorMessage('Invalid credentials', [], 401);
            }

            if (!$user->hasVerifiedEmail()) {
                return $this->errorMessage('Please verify your email before login.', [], 403);
            }

            $user->remember_token = Str::random(10);
            $user->save();

            $token = $user->createToken('authToken')->plainTextToken;

            return $this->successMessage([
                'token' => $token,
                'role'  => $user->getRoleNames()->first(),
                'remember_token' => $user->remember_token
            ], 'Login Successfully');
        } catch (\Exception $ex) {
            return $this->errorMessage('Login Failed', [
                'error' => $ex->getMessage()
            ], 500);
        }
    }

    // Logout method for all roles
    public function logout(Request $request)
    {
        try {
            $request->user()?->currentAccessToken()?->delete();
            return response()->json(['message' => 'Logout Successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Logout Failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function logoutAll(Request $request)
    {
        try {
            $request->user()->tokens()->delete();
            return $this->successMessage([], 'Successfully Logged Out From All Devices');
        } catch (\Exception $x) {
            return $this->errorMessage('Something Went Wrong', [
                'error' => $x->getMessage()
            ], 500);
        }
    }
}

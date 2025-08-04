<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends BaseController
{
    /**
     * Verify Email using signed URL
     */
    public function verify(Request $request, $id, $hash)
    {
        try {
            $user = User::findOrFail($id);

            if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
                return redirect()->to(config('app.frontend_url') . '/message?status=0&message=Invalid+verification+link');
            }

            if ($user->hasVerifiedEmail()) {
                return redirect()->to(config('app.frontend_url') . '/message?status=1&message=Email+already+verified');
            }

            $user->markEmailAsVerified();
            return redirect()->to(config('app.frontend_url') . '/message?status=1&message=Email+verified+successfully');
        } catch (\Exception $e) {
            return redirect()->to(config('app.frontend_url') . '/message?status=0&message=Something+went+wrong');
        }
    }

    /**
     * Resend Email Verification Link
     */
    public function resend(Request $request)
    {
        if (!$request->user()) {
            return $this->errorMessage('Unauthorized access.', [], 401);
        }

        if ($request->user()->hasVerifiedEmail()) {
            return $this->successMessage([], 'Email already verified.', [], 200);
        }

        $request->user()->sendEmailVerificationNotification();

        return $this->successMessage([], 'Verification link sent', [], 200);
    }
}

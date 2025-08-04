<?php

use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;

if(!function_exists('standardThrottle')){
    function standardThrottle(Request $request, int $minutes = 5, int $maxAttempts = 4){
        return Limit::perMinutes($minutes, $maxAttempts)
        ->by($request->ip())
        ->response(fn () => errorMessage('Too many attempts. Please try again later.', [], 429));
    }
}

if (!function_exists('successMessage')) {
    function successMessage(string $message, array $data = [], int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data
        ], $code);
    }
}

if (!function_exists('errorMessage')) {
    function errorMessage(string $message, array $errors = [], int $code = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors
        ], $code);
    }
}
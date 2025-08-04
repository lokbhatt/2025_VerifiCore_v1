<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class BaseController extends Controller
{
    public function successMessage($result = [], $message = '', $extra = [], $code = 200)
    {
        $response = [
            'status'  => true,
            'message' => $message,
            'data'    => $result,
        ];

        if (!empty($extra)) {
            $response = array_merge($response, $extra);
        }

        return response()->json($response, $code);
    }

    public function errorMessage($error, $messages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];
        if (!empty($messages)) {
            $response['data'] = $messages;
        }
        return response()->json($response, $code);
    }
}

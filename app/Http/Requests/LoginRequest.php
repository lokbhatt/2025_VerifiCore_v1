<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|min:4|max:6|regex:/^[A-Z][A-Za-z\d]{3,5}$/',
            'password' => [
                'required',
                'string',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'username' => 'username is required.',
            'password.*' => 'Password must be at least 8 characters with upper/lowercase letters, a number, and a symbol.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            errorMessage('Validation error', $validator->errors()->toArray(), 422)
        );
    }
}

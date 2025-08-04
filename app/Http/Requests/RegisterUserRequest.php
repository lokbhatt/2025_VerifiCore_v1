<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterUserRequest extends FormRequest
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
            'name' => 'required|string|min:6|max:26|regex:/^[A-Za-z\s]+$/',
            'email' => 'required|email|unique:users,email',
            'username' => 'required|string|min:4|max:6|regex:/^[A-Z][A-Za-z\d]{3,5}$/|unique:users,username',
            'phone' => [
                'required',
                'string',
                'regex:/^(98|97)\d{8}$/',
                'unique:users,phone',
            ],
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
            ],
            'password_confirmation' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'password.confirmed' => 'Password confirmation does not match.',
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

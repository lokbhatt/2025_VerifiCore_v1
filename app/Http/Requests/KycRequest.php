<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

class KycRequest extends FormRequest
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
            // Permanent address
            'district_id' => ['required', 'exists:districts,id'],
            'municipality_id' => ['required', 'exists:municipalities,id'],
            'ward_id' => ['required', 'exists:wards,id'],
            'tole' => ['nullable', 'string'],
            'house_number' => ['nullable', 'string'],

            // Temporary address
            'temp_district_id' => ['required', 'exists:districts,id'],
            'temp_municipality_id' => ['required', 'exists:municipalities,id'],
            'temp_ward_id' => ['required', 'exists:wards,id'],
            'temp_tole' => ['nullable', 'string'],
            'temp_house_number' => ['nullable', 'string'],

            // Personal information
            'name' => ['required', 'string'],
            'dob' => ['required', 'date'],
            'gender_id' => ['required', 'exists:genders,id'],
            'marital_status' => ['required', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'nationality' => ['required', 'string'],

            // Contact information
            'email' => ['required', 'email',],
            'phone' => ['required', 'string', 'regex:/^(98|97)\d{8}$/'],

            // Family information
            'father' => ['required', 'string'],
            'mother' => ['nullable', 'string'],
            'grandfather' => ['required', 'string'],
            'spouse' => ['nullable', 'string'],

            // Citizenship information
            'citizenship_photo_front' => [$this->isMethod('post') ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'citizenship_photo_back' => [$this->isMethod('post') ? 'required' : 'nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'citizenship_number' => ['required', 'string', 'regex:/^\d{2}-\d{2}-\d{2}-\d{5}$/'],
            'citizenship_issued_by' => ['required', 'string'],
            'citizenship_issued_date' => ['required', 'date'],
            'citizenship_issued_place' => ['required', 'string'],

            // Passport (conditional)
            'is_passport' => ['required', 'boolean'],
            'passport_number' => ['nullable', 'required_if:is_passport,1', 'string'],
            'passport_issued_by' => ['nullable', 'required_if:is_passport,1', 'string'],
            'passport_issued_date' => ['nullable', 'required_if:is_passport,1', 'date'],
            'passport_expire_date' => ['nullable', 'required_if:is_passport,1', 'date'],

            // Identification card (conditional)
            'is_identification_card' => ['required', 'boolean'],
            'identification_card_type' => ['nullable', 'required_if:is_identification_card,1', 'string'],
            'identification_card_number' => ['nullable', 'required_if:is_identification_card,1', 'string'],
            'identification_card_issued_date' => ['nullable', 'required_if:is_identification_card,1', 'date'],
            'identification_card_expire_date' => ['nullable', 'required_if:is_identification_card,1', 'date'],

            // Associate profession (conditional)
            'is_associate_profession' => ['required', 'boolean'],
            'organization_name' => ['nullable', 'required_if:is_associate_profession,1', 'string'],
            'organization_address' => ['nullable', 'required_if:is_associate_profession,1', 'string'],
            'organization_contact_number' => ['nullable', 'required_if:is_associate_profession,1', 'string'],
            'designation' => ['nullable', 'required_if:is_associate_profession,1', 'string'],
            'estimated_annual_income' => ['nullable', 'required_if:is_associate_profession,1', 'string'],
            'estimated_annual_transaction' => ['nullable', 'required_if:is_associate_profession,1', 'string'],

            // Status and other
            'status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected'])],
        ];
    }
    
    public function messages(): array
    {
        return [
            // Permanent address
            'district_id.required' => 'The permanent district is required.',
            'district_id.exists' => 'The selected permanent district is invalid.',
            'municipality_id.required' => 'The permanent municipality is required.',
            'municipality_id.exists' => 'The selected permanent municipality is invalid.',
            'ward_id.required' => 'The permanent ward is required.',
            'ward_id.exists' => 'The selected permanent ward is invalid.',
            'tole.string' => 'The permanent tole must be a valid string.',
            'house_number.string' => 'The permanent house number must be a valid string.',

            // Temporary address
            'temp_district_id.required' => 'The temporary district is required.',
            'temp_district_id.exists' => 'The selected temporary district is invalid.',
            'temp_municipality_id.required' => 'The temporary municipality is required.',
            'temp_municipality_id.exists' => 'The selected temporary municipality is invalid.',
            'temp_ward_id.required' => 'The temporary ward is required.',
            'temp_ward_id.exists' => 'The selected temporary ward is invalid.',
            'temp_tole.string' => 'The temporary tole must be a valid string.',
            'temp_house_number.string' => 'The temporary house number must be a valid string.',

            // Personal info
            'name.required' => 'The full name is required.',
            'dob.required' => 'The date of birth is required.',
            'dob.date' => 'The date of birth must be a valid date.',
            'gender_id.required' => 'The gender is required.',
            'gender_id.exists' => 'The selected gender is invalid.',
            'marital_status.required' => 'The marital status is required.',
            'marital_status.in' => 'The marital status must be one of: single, married, divorced, widowed.',
            'nationality.required' => 'The nationality is required.',

            // Contact info
            'email.required' => 'The email address is required.',
            'email.email' => 'The email must be a valid email address.',
            'phone.required' => 'The phone number is required.',
            'phone.regex' => 'Phone number must start with 98 or 97 and 10 digit only.',
            'landline.required' => 'The landline number is required.',

            // Family info
            'father.required' => 'The father\'s name is required.',
            'mother.string' => 'The mother\'s name must be a valid string.',
            'grandfather.required' => 'The grandfather\'s name is required.',
            'spouse.string' => 'The spouse\'s name must be a valid string.',

            // Citizenship
            'citizenship_photo_front.required'  => 'The front side of citizenship photo is required.',
            'citizenship_photo_front.mimes'     => 'Citizenship photo must be jpg, jpeg, png.',
            'citizenship_photo_back.required'   => 'The back side of citizenship photo is required.',
            'citizenship_photo_back.mimes'      => 'Citizenship photo must be jpg, jpeg, png.',
            'citizenship_number.required'       => 'The citizenship number is required.',
            'citizenship_issued_by.required'    => 'The issuing authority for citizenship is required.',
            'citizenship_issued_date.required'  => 'The citizenship issue date is required.',
            'citizenship_issued_date.date'      => 'The citizenship issue date must be a valid date.',
            'citizenship_issued_place.required' => 'The citizenship issued place is required.',

            // Passport
            'is_passport.required' => 'Passport status is required.',
            'is_passport.boolean'  => 'If you have passport then choose Yes otherwise No.',
            'passport_number.required_if' => 'The passport number is required.',
            'passport_issued_by.required_if' => 'The passport issued by is required.',
            'passport_issued_date.required_if' => 'The passport issued date is required.',
            'passport_issued_date.date' => 'The passport issued date must be a valid date.',
            'passport_expire_date.required_if' => 'The passport expiry date is required.',
            'passport_expire_date.date' => 'The passport expiry date must be a valid date.',

            // Identification card
            'is_identification_card.required' => 'Identification card status is required.',
            'is_identification_card.boolean' => 'If you have Identification card then choose Yes otherwise No.',
            'identification_card_type.required_if' => 'The identification card type is required.',
            'identification_card_number.required_if' => 'The identification card number is required.',
            'identification_card_issued_date.required_if' => 'The issue date of the identification card is required.',
            'identification_card_issued_date.date' => 'The issue date of the identification card must be a valid date.',
            'identification_card_expire_date.required_if' => 'The expiry date of the identification card is required.',
            'identification_card_expire_date.date' => 'The expiry date of the identification card must be a valid date.',

            // Associate profession
            'is_associate_profession.required' => 'Associate profession status is required.',
            'is_associate_profession.boolean' => 'If you involve any associate profession then choose Yes otherwise No.',
            'organization_name.required_if' => 'The organization name is required.',
            'organization_address.required_if' => 'The organization address is required.',
            'organization_contact_number.required_if' => 'The organization contact number is required.',
            'designation.required_if' => 'The designation is required.',
            'estimated_annual_income.required_if' => 'The estimated annual income is required.',
            'estimated_annual_transaction.required_if' => 'The estimated annual transaction is required.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            errorMessage('Validation error', $validator->errors()->toArray(), 422)
        );
    }
   
}

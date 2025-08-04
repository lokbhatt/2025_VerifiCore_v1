<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KycResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
       return [
            'id' => $this->id,
            'name' => $this->name,
            'dob' => $this->dob,
            'gender_id' => $this->gender_id,
            'gender' => $this->whenLoaded('gender', function () {
                return [
                    'id' => $this->gender->id,
                    'title' => $this->gender->title,
                ];
            }),
            'marital_status' => $this->marital_status,
            'nationality' => $this->nationality,

            // Permanent address
            'district_id' => $this->district_id,
            'district' => $this->whenLoaded('district', fn () => [
                'id' => $this->district->id,
                'title' => $this->district->title,
            ]),
            'municipality_id' => $this->municipality_id,
            'municipality' => $this->whenLoaded('municipality', fn () => [
                'id' => $this->municipality->id,
                'title' => $this->municipality->title,
            ]),
            'ward_id' => $this->ward_id,
            'ward' => $this->whenLoaded('ward', fn () => [
                'id' => $this->ward->id,
                'title' => $this->ward->title,
            ]),
            'tole' => $this->tole,
            'house_number' => $this->house_number,

            // Temporary address
            'temp_district_id' => $this->temp_district_id,
            'temp_district' => $this->whenLoaded('tempDistrict', fn () => [
                'id' => $this->tempDistrict->id,
                'title' => $this->tempDistrict->title,
            ]),
            'temp_municipality_id' => $this->temp_municipality_id,
            'temp_municipality' => $this->whenLoaded('tempMunicipality', fn () => [
                'id' => $this->tempMunicipality->id,
                'title' => $this->tempMunicipality->title,
            ]),
            'temp_ward_id' => $this->temp_ward_id,
            'temp_ward' => $this->whenLoaded('tempWard', fn () => [
                'id' => $this->tempWard->id,
                'title' => $this->tempWard->title,
            ]),
            'temp_tole' => $this->temp_tole,
            'temp_house_number' => $this->temp_house_number,

            // Contact
            'email' => $this->email,
            'phone' => $this->phone,
            'landline' => $this->landline,

            // Family
            'father' => $this->father,
            'mother' => $this->mother,
            'grandfather' => $this->grandfather,
            'spouse' => $this->spouse,

            // Citizenship
            'citizenship_number' => $this->citizenship_number,
            'citizenship_photo_front' => $this->citizenship_photo_front 
            ? asset('images/' . $this->citizenship_photo_front) 
            : null,

            'citizenship_photo_back' => $this->citizenship_photo_back 
            ? asset('images/' . $this->citizenship_photo_back) 
            : null,
            'citizenship_issued_by' => $this->citizenship_issued_by,
            'citizenship_issued_date' => $this->citizenship_issued_date,
            'citizenship_issued_place' => $this->citizenship_issued_place,

            // Passport
            'is_passport' => $this->is_passport,
            'passport_number' => $this->passport_number,
            'passport_issued_by' => $this->passport_issued_by,
            'passport_issued_date' => $this->passport_issued_date,
            'passport_expire_date' => $this->passport_expire_date,

            // ID Card
            'is_identification_card' => $this->is_identification_card,
            'identification_card_type' => $this->identification_card_type,
            'identification_card_number' => $this->identification_card_number,
            'identification_card_issued_date' => $this->identification_card_issued_date,
            'identification_card_expire_date' => $this->identification_card_expire_date,

            // Profession
            'is_associate_profession' => $this->is_associate_profession,
            'organization_name' => $this->organization_name,
            'organization_address' => $this->organization_address,
            'organization_contact_number' => $this->organization_contact_number,
            'designation' => $this->designation,
            'estimated_annual_income' => $this->estimated_annual_income,
            'estimated_annual_transaction' => $this->estimated_annual_transaction,

            // System info
            'status' => $this->status,
            'remarks' => $this->remarks,

            'created_by' => $this->created_by,
            'createdBy' => $this->createdBy ? [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
            ] : null,
            'updated_by' => $this->updated_by,
            'updatedBy' => $this->updatedBy ? [
                'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ] : null,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

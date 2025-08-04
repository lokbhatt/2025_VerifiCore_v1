<?php

namespace App\Models\Backend;

use App\Models\Backend\ParentData\District;
use App\Models\Backend\ParentData\Gender;
use App\Models\Backend\ParentData\Municipality;
use App\Models\Backend\ParentData\Ward;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kyc extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = "kycs";

    protected $fillable = [
        'district_id',
        'municipality_id',
        'ward_id',
        'tole',
        'house_number',
        'temp_district_id',
        'temp_municipality_id',
        'temp_ward_id',
        'temp_tole',
        'temp_house_number',
        'name',
        'dob',
        'gender_id',
        'marital_status',
        'nationality',
        'email',
        'phone',
        'landline',
        'father',
        'mother',
        'grandfather',
        'spouse',
        'citizenship_photo_front',
        'citizenship_photo_back',
        'citizenship_number',
        'citizenship_issued_by',
        'citizenship_issued_date',
        'citizenship_issued_place',
        'is_passport',
        'passport_number',
        'passport_issued_by',
        'passport_issued_date',
        'passport_expire_date',
        'is_identification_card',
        'identification_card_type',
        'identification_card_number',
        'identification_card_issued_date',
        'identification_card_expire_date',
        'is_associate_profession',
        'organization_name',
        'organization_address',
        'organization_contact_number',
        'designation',
        'estimated_annual_income',
        'estimated_annual_transaction',
        'status',
        'remarks',
        'created_by',
        'updated_by',
        'deleted_at',
    ];


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function district(){
       return $this->belongsTo(District::class, 'district_id');
    }    

    public function municipality(){
       return $this->belongsTo(Municipality::class, 'municipality_id');
    }   

    public function ward(){
       return $this->belongsTo(Ward::class, 'ward_id');
    }    

    public function tempDistrict(){
       return $this->belongsTo(District::class, 'temp_district_id');
    }    

    public function tempMunicipality(){
       return $this->belongsTo(Municipality::class, 'temp_municipality_id');
    }    

    public function tempWard(){
       return $this->belongsTo(Ward::class, 'temp_ward_id');
    }

    public function gender(){
       return $this->belongsTo(Gender::class, 'gender_id');
    }    
}

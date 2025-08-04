<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kycs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('district_id')->constrained('districts')->cascadeOnUpdate();
            $table->foreignId('municipality_id')->constrained('municipalities')->cascadeOnUpdate();
            $table->foreignId('ward_id')->constrained('wards')->cascadeOnUpdate();
            $table->string('tole')->nullable();
            $table->string('house_number')->nullable();
            $table->foreignId('temp_district_id')->constrained('districts')->cascadeOnUpdate();
            $table->foreignId('temp_municipality_id')->constrained('municipalities')->cascadeOnUpdate();
            $table->foreignId('temp_ward_id')->constrained('wards')->cascadeOnUpdate();
            $table->string('temp_tole')->nullable();
            $table->string('temp_house_number')->nullable();
            $table->string('name');
            $table->date('dob');
            $table->foreignId('gender_id')->constrained('genders')->cascadeOnUpdate();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed']);
            $table->string('nationality');
            $table->string('email');
            $table->string('phone');
            $table->string('landline')->nullable();
            $table->string('father');
            $table->string('mother')->nullable();
            $table->string('grandfather');
            $table->string('spouse')->nullable();
            $table->string('citizenship_photo_front');
            $table->string('citizenship_photo_back');
            $table->string('citizenship_number');
            $table->string('citizenship_issued_by');
            $table->date('citizenship_issued_date');
            $table->string('citizenship_issued_place');
            $table->boolean('is_passport')->default(0);
            $table->string('passport_number')->nullable();
            $table->string('passport_issued_by')->nullable();
            $table->date('passport_issued_date')->nullable();
            $table->date('passport_expire_date')->nullable();
            $table->boolean('is_identification_card')->default(0);
            $table->string('identification_card_type')->nullable();
            $table->string('identification_card_number')->nullable();
            $table->date('identification_card_issued_date')->nullable();
            $table->date('identification_card_expire_date')->nullable();
            $table->boolean('is_associate_profession')->default(0);
            $table->string('organization_name')->nullable();
            $table->string('organization_address')->nullable();
            $table->string('organization_contact_number')->nullable();
            $table->string('designation')->nullable();
            $table->string('estimated_annual_income')->nullable();
            $table->string('estimated_annual_transaction')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->longText('remarks')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnUpdate();
            $table->foreignId('updated_by')->nullable()->constrained('users')->cascadeOnUpdate();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kycs');
    }
};

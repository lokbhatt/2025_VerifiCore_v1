<?php

namespace App\Models\Backend\ParentData;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Municipality extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['title', 'key', 'status', 'district_id', 'created_by', 'updated_by', 'deleted_at'];

    protected $table = 'municipalities';

    public function createdBy(){
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy(){
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function district(){
        return $this->belongsTo(District::class, 'district_id');
    }
}

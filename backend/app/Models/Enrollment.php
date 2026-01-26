<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\AcademicClass;
use App\Models\Grade;

class Enrollment extends Model
{
    protected $fillable = [
        'user_id', 'class_id', 'status', 'enrolled_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function academicClass()
    {
        return $this->belongsTo(AcademicClass::class, 'class_id');
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }
}

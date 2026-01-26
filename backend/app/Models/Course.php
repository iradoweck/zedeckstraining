<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'price', 
        'cover_image', 'trainer_id', 'is_published'
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'price' => 'decimal:2',
        'schedules' => 'array',
        'options' => 'array',
    ];

    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function classes()
    {
        return $this->hasMany(AcademicClass::class);
    }
}

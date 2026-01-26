<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'module_id', 'title', 'type', 
        'content_url', 'duration_minutes'
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}

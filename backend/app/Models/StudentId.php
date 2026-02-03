<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class StudentId extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_code',
        'document_number',
        'year',
        'status',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Generate a unique Student Code (ZT-YYYY-XXXX)
     */
    public static function generateUniqueCode()
    {
        $year = date('Y');
        $prefix = "ZT-{$year}";
        
        do {
            // Generate 4 chars (uppercase letters + numbers)
            // Excluding visual confusions like 0/O, 1/I might be good, but Str::random is simple enough for now.
            // Let's use UPPERCASE hex or alphanumeric.
            $random = strtoupper(Str::random(4));
            $code = "{$prefix}-{$random}";
            
            // Check existence
        } while (self::where('student_code', $code)->exists());

        return $code;
    }
}

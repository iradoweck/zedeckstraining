<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'reference',
        'amount',
        'currency',
        'method',
        'status',
        'proof_file',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'amount' => 'decimal:2'
    ];
}

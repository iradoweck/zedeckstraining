<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reference',
        'type',
        'amount',
        'due_date',
        'status',
        'penalty_applied',
        'penalty_amount',
        'items'
    ];

    protected $casts = [
        'due_date' => 'date',
        'penalty_applied' => 'boolean',
        'amount' => 'decimal:2',
        'penalty_amount' => 'decimal:2',
        'items' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(FinancialTransaction::class);
    }
}

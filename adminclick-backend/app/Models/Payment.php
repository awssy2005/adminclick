<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id',
        'amount',
        'method',
        'status',
        'reference',
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}

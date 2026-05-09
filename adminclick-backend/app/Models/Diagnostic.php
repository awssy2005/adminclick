<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diagnostic extends Model
{
    protected $fillable = [
        'user_id',
        'responses',
        'contact_email',
        'contact_phone',
        'message',
        'status',
    ];

    protected $casts = [
        'responses' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingEvent extends Model
{
    public $timestamps    = false;
    public $incrementing  = true;

    protected $fillable = ['demande_id', 'status', 'description', 'location', 'tracking_code'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}

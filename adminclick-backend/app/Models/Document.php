<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'demande_id',
        'name',
        'file_path',
        'file_type',
        'file_size',
        // Coffre-fort numérique
        'user_id',
        'type',
        'encrypted',
        'share_token',
        'share_expires_at',
    ];

    protected $casts = [
        'encrypted'        => 'boolean',
        'share_expires_at' => 'datetime',
    ];

    // ── Relations ──

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ──

    public function shareIsValid(): bool
    {
        return $this->share_token !== null
            && $this->share_expires_at !== null
            && $this->share_expires_at->isFuture();
    }
}

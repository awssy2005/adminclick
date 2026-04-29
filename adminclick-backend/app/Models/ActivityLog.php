<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'admin_id',
        'demande_id',
        'action',
        'old_value',
        'new_value',
        'description',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'old_value' => 'array',
            'new_value' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    /**
     * Enregistrer un log d'activité.
     */
    public static function log(array $data): self
    {
        return self::create($data);
    }
}

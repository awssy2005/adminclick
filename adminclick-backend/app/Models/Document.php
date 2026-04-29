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
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}

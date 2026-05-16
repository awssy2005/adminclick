<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Secteur extends Model
{
    protected $table = 'secteurs';

    protected $fillable = [
        'nom', 'nom_ar', 'numero', 'code_postal',
        'latitude', 'longitude', 'arrondissement_id'
    ];

    public function arrondissement()
    {
        return $this->belongsTo(Arrondissement::class);
    }
}
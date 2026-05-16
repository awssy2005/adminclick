<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Arrondissement extends Model
{
    protected $fillable = ['nom', 'nom_ar', 'ville_id'];

    public function ville()
    {
        return $this->belongsTo(Ville::class);
    }

    public function secteurs()
    {
        return $this->hasMany(Secteur::class);
    }
}
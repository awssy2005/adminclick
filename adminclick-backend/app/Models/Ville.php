<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ville extends Model
{
    protected $fillable = ['nom', 'nom_ar', 'region_id'];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function arrondissements()
    {
        return $this->hasMany(Arrondissement::class);
    }
}
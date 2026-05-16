<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['nom', 'nom_ar'];

    /**
     * Une région possède plusieurs villes.
     */
    public function villes()
    {
        return $this->hasMany(Ville::class);
    }
}
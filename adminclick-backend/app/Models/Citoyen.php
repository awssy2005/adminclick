<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Citoyen extends Model
{
    protected $fillable = [
        'cnie',
        'nom_ar',
        'prenom_ar',
        'nom_fr',
        'prenom_fr',
        'date_naissance',
        'lieu_naissance',
    ];

    protected $casts = [
        'date_naissance' => 'date:Y-m-d',
    ];
}

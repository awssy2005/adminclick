<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CivilOffice extends Model
{
    protected $fillable = [
        'commune_id', 'district_id',
        'nom_fr', 'nom_ar', 'code',
        'adresse_fr', 'adresse_ar', 'telephone',
    ];

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class District extends Model
{
    protected $fillable = ['commune_id', 'nom_fr', 'nom_ar', 'code'];

    public function commune(): BelongsTo
    {
        return $this->belongsTo(Commune::class);
    }

    public function civilOffices(): HasMany
    {
        return $this->hasMany(CivilOffice::class);
    }
}

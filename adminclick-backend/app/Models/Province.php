<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    protected $fillable = ['region_id', 'nom_fr', 'nom_ar', 'code', 'type'];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function communes(): HasMany
    {
        return $this->hasMany(Commune::class);
    }
}

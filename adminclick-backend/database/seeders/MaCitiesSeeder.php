<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Ville;
use App\Models\Arrondissement;
use Illuminate\Support\Facades\DB;

class MaCitiesSeeder extends Seeder
{
    public function run()
    {
        // Utilise directement les données du package via son propre modèle Region
        $packageRegions = \HichamInfo\Macities\Region::all();

        foreach ($packageRegions as $packRegion) {
            // Insérer dans votre table regions
            $region = Region::firstOrCreate(
                ['code' => $packRegion->id], // on utilise l'id du package comme code unique
                [
                    'nom_fr' => $packRegion->nom_fr,
                    'nom_ar' => $packRegion->nom_ar ?? $packRegion->nom_fr,
                ]
            );

            // Récupérer les villes de cette région (via son modèle City)
            $packageCities = \HichamInfo\Macities\City::where('region_id', $packRegion->id)->get();

            foreach ($packageCities as $packCity) {
                $ville = Ville::firstOrCreate(
                    ['region_id' => $region->id, 'nom' => $packCity->nom_fr],
                    [
                        'nom_ar' => $packCity->nom_ar ?? $packCity->nom_fr,
                    ]
                );

                // Pour l'instant, pas de commune (arrondissement) dans ce package.
                // On peut laisser vide ou ajouter des données ultérieurement.
            }
        }
    }
}
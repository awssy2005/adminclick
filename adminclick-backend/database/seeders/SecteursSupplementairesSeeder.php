<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ville;
use App\Models\Arrondissement;
use App\Models\Secteur;

class SecteursSupplementairesSeeder extends Seeder
{
    public function run()
    {
        // Exemple : Kénitra -> Saknia -> 9 secteurs
        $kenitra = Ville::where('nom', 'Kénitra')->first();
        if ($kenitra) {
            $saknia = Arrondissement::firstOrCreate(
                ['ville_id' => $kenitra->id, 'nom' => 'Saknia'],
                ['nom_ar' => 'الساكنية']
            );
            for ($i = 1; $i <= 9; $i++) {
                Secteur::firstOrCreate(
                    ['arrondissement_id' => $saknia->id, 'numero' => (string)$i],
                    [
                        'nom' => 'Secteur ' . $i,
                        'nom_ar' => 'القطاع ' . $i,
                        'code_postal' => '1400' . $i,
                        'latitude' => 34.25 + ($i * 0.001),
                        'longitude' => -6.58 + ($i * 0.001),
                    ]
                );
            }
        }
        // Ajoutez d’autres villes/arrondissements ici
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Ville;
use App\Models\Arrondissement;
use App\Models\Secteur;

class GeographieSeeder extends Seeder
{
    public function run()
    {
        // Région Rabat-Salé-Kénitra
        // Utilisation des colonnes réelles : nom_fr, nom_ar, code
        $region = Region::create([
            'nom_fr' => 'Rabat-Salé-Kénitra',
            'nom_ar' => 'الرباط-سلا-القنيطرة',
            'code'   => '1', // si la colonne 'code' est NOT NULL sans valeur par défaut, donnez une valeur
        ]);

        // Ville Kénitra
        $kenitra = Ville::create([
            'nom'    => 'Kénitra',
            'nom_ar' => 'القنيطرة',
            'region_id' => $region->id,
        ]);

        // Arrondissement Saknia
        $saknia = Arrondissement::create([
            'nom'    => 'Saknia',
            'nom_ar' => 'الساكنية',
            'ville_id' => $kenitra->id,
        ]);

        // 9 secteurs
        for ($i = 1; $i <= 9; $i++) {
            Secteur::create([
                'nom'               => 'Secteur ' . $i,
                'nom_ar'            => 'القطاع ' . $i,
                'numero'            => (string)$i,
                'code_postal'       => '1400' . $i,
                'latitude'          => 34.25 + ($i * 0.001),
                'longitude'         => -6.58 + ($i * 0.001),
                'arrondissement_id' => $saknia->id,
            ]);
        }
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CommuneController extends Controller
{
    /**
     * Liste des régions du Maroc (Données Officielles)
     */
    public function getRegions()
    {
        $regions = [
            ['id' => 1, 'ar' => 'طنجة-تطوان-الحسيمة', 'fr' => 'Tanger-Tétouan-Al Hoceïma'],
            ['id' => 2, 'ar' => 'الشرق', 'fr' => 'L\'Oriental'],
            ['id' => 3, 'ar' => 'فاس-مكناس', 'fr' => 'Fès-Meknès'],
            ['id' => 4, 'ar' => 'الرباط-سلا-القنيطرة', 'fr' => 'Rabat-Salé-Kénitra'],
            ['id' => 5, 'ar' => 'بني ملال-خنيفرة', 'fr' => 'Béni Mellal-Khénifra'],
            ['id' => 6, 'ar' => 'الدار البيضاء-Settat', 'fr' => 'Casablanca-Settat'],
            ['id' => 7, 'ar' => 'مراكش-آسفي', 'fr' => 'Marrakech-Safi'],
            ['id' => 8, 'ar' => 'درعة-تافيلالت', 'fr' => 'Drâa-Tafilalet'],
            ['id' => 9, 'ar' => 'سوس-ماسة', 'fr' => 'Souss-Massa'],
            ['id' => 10, 'ar' => 'كلميم-واد نون', 'fr' => 'Guelmim-Oued Noun'],
            ['id' => 11, 'ar' => 'العيون-الساقية الحمراء', 'fr' => 'Laâyoune-Sakia El Hamra'],
            ['id' => 12, 'ar' => 'الداخلة-وادي الذهب', 'fr' => 'Dakhla-Oued Ed-Dahab'],
        ];
        return response()->json($regions);
    }

    /**
     * Liste des provinces selon la région
     */
    public function getProvinces($regionId)
    {
        // Simulation structurée (Dans une app réelle, ceci vient d'une table SQL 'provinces')
        $data = [
            6 => [ // Casablanca-Settat
                ['id' => 61, 'ar' => 'الدار البيضاء', 'fr' => 'Casablanca'],
                ['id' => 62, 'ar' => 'سطات', 'fr' => 'Settat'],
                ['id' => 63, 'ar' => 'الجديدة', 'fr' => 'El Jadida'],
                ['id' => 64, 'ar' => 'بنسليمان', 'fr' => 'Benslimane'],
                ['id' => 65, 'ar' => 'برشيد', 'fr' => 'Berrechid'],
            ],
            4 => [ // Rabat-Salé-Kénitra
                ['id' => 41, 'ar' => 'الرباط', 'fr' => 'Rabat'],
                ['id' => 42, 'ar' => 'سلا', 'fr' => 'Salé'],
                ['id' => 43, 'ar' => 'تمارة', 'fr' => 'Skhirate-Témara'],
                ['id' => 44, 'ar' => 'القنيطرة', 'fr' => 'Kénitra'],
            ],
            7 => [ // Marrakech-Safi
                ['id' => 71, 'ar' => 'مراكش', 'fr' => 'Marrakech'],
                ['id' => 72, 'ar' => 'آسفي', 'fr' => 'Safi'],
                ['id' => 73, 'ar' => 'الصويرة', 'fr' => 'Essaouira'],
            ]
            // ... étendu selon besoin
        ];

        return response()->json($data[$regionId] ?? [['id' => 0, 'ar' => 'أخرى', 'fr' => 'Autre']]);
    }

    /**
     * Liste des communes/arrondissements selon la province
     */
    public function getCommunes($provinceId)
    {
        $data = [
            61 => [ // Casablanca
                ['id' => 611, 'ar' => 'سيدي بليوط', 'fr' => 'Sidi Belyout'],
                ['id' => 612, 'ar' => 'أنفا', 'fr' => 'Anfa'],
                ['id' => 613, 'ar' => 'المعاريف', 'fr' => 'Maârif'],
                ['id' => 614, 'ar' => 'عين الشق', 'fr' => 'Aïn Chock'],
                ['id' => 615, 'ar' => 'الحي الحسني', 'fr' => 'Hay Hassani'],
            ],
            41 => [ // Rabat
                ['id' => 411, 'ar' => 'حسان', 'fr' => 'Hassan'],
                ['id' => 412, 'ar' => 'أكدال الرياض', 'fr' => 'Agdal-Ryad'],
                ['id' => 413, 'ar' => 'يعقوب المنصور', 'fr' => 'Yaâcoub El Mansour'],
            ]
        ];

        return response()->json($data[$provinceId] ?? [['id' => 0, 'ar' => 'جماعة عامة', 'fr' => 'Commune Générale']]);
    }
}

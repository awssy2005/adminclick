<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CommuneController extends Controller
{
    /**
     * Retourne la liste des 12 régions du Maroc.
     * Chaque région a un id, un nom en français (nom) et un nom en arabe (nom_ar).
     */
    public function getRegions()
    {
        $regions = [
            ['id' => 1,  'nom' => 'Tanger-Tétouan-Al Hoceïma',       'nom_ar' => 'طنجة-تطوان-الحسيمة'],
            ['id' => 2,  'nom' => 'L\'Oriental',                      'nom_ar' => 'الشرق'],
            ['id' => 3,  'nom' => 'Fès-Meknès',                      'nom_ar' => 'فاس-مكناس'],
            ['id' => 4,  'nom' => 'Rabat-Salé-Kénitra',              'nom_ar' => 'الرباط-سلا-القنيطرة'],
            ['id' => 5,  'nom' => 'Béni Mellal-Khénifra',            'nom_ar' => 'بني ملال-خنيفرة'],
            ['id' => 6,  'nom' => 'Casablanca-Settat',               'nom_ar' => 'الدار البيضاء-سطات'],
            ['id' => 7,  'nom' => 'Marrakech-Safi',                  'nom_ar' => 'مراكش-آسفي'],
            ['id' => 8,  'nom' => 'Drâa-Tafilalet',                  'nom_ar' => 'درعة-تافيلالت'],
            ['id' => 9,  'nom' => 'Souss-Massa',                     'nom_ar' => 'سوس-ماسة'],
            ['id' => 10, 'nom' => 'Guelmim-Oued Noun',               'nom_ar' => 'كلميم-واد نون'],
            ['id' => 11, 'nom' => 'Laâyoune-Sakia El Hamra',         'nom_ar' => 'العيون-الساقية الحمراء'],
            ['id' => 12, 'nom' => 'Dakhla-Oued Ed-Dahab',            'nom_ar' => 'الداخلة-وادي الذهب'],
        ];

        return response()->json($regions);
    }

    /**
     * Retourne les provinces d'une région donnée.
     * Les données sont simulées ; dans une application réelle, elles viendraient d'une base de données.
     */
    public function getProvinces($regionId)
    {
        // Données simulées pour quelques régions (à compléter ou à remplacer par une table SQL)
        $provinces = [
            6 => [ // Casablanca-Settat
                ['id' => 61, 'nom' => 'Casablanca',    'nom_ar' => 'الدار البيضاء'],
                ['id' => 62, 'nom' => 'Settat',         'nom_ar' => 'سطات'],
                ['id' => 63, 'nom' => 'El Jadida',      'nom_ar' => 'الجديدة'],
                ['id' => 64, 'nom' => 'Benslimane',     'nom_ar' => 'بنسليمان'],
                ['id' => 65, 'nom' => 'Berrechid',      'nom_ar' => 'برشيد'],
            ],
            4 => [ // Rabat-Salé-Kénitra
                ['id' => 41, 'nom' => 'Rabat',          'nom_ar' => 'الرباط'],
                ['id' => 42, 'nom' => 'Salé',           'nom_ar' => 'سلا'],
                ['id' => 43, 'nom' => 'Skhirate-Témara','nom_ar' => 'الصخيرات-تمارة'],
                ['id' => 44, 'nom' => 'Kénitra',        'nom_ar' => 'القنيطرة'],
            ],
            7 => [ // Marrakech-Safi
                ['id' => 71, 'nom' => 'Marrakech',      'nom_ar' => 'مراكش'],
                ['id' => 72, 'nom' => 'Safi',           'nom_ar' => 'آسفي'],
                ['id' => 73, 'nom' => 'Essaouira',      'nom_ar' => 'الصويرة'],
            ],
            1 => [ // Tanger-Tétouan-Al Hoceïma
                ['id' => 11, 'nom' => 'Tanger-Assilah', 'nom_ar' => 'طنجة-أصيلة'],
                ['id' => 12, 'nom' => 'Tétouan',        'nom_ar' => 'تطوان'],
                ['id' => 13, 'nom' => 'Al Hoceïma',     'nom_ar' => 'الحسيمة'],
            ],
            3 => [ // Fès-Meknès
                ['id' => 31, 'nom' => 'Fès',            'nom_ar' => 'فاس'],
                ['id' => 32, 'nom' => 'Meknès',         'nom_ar' => 'مكناس'],
            ],
            9 => [ // Souss-Massa
                ['id' => 91, 'nom' => 'Agadir Ida-Outanane', 'nom_ar' => 'أكادير إداوتنان'],
                ['id' => 92, 'nom' => 'Taroudant',            'nom_ar' => 'تارودانت'],
            ],
            // Ajoutez les autres régions selon vos besoins
        ];

        return response()->json($provinces[$regionId] ?? [
            ['id' => 0, 'nom' => 'Autre', 'nom_ar' => 'أخرى']
        ]);
    }

    /**
     * Retourne les communes d'une province donnée.
     */
    public function getCommunes($provinceId)
    {
        $communes = [
            61 => [ // Casablanca
                ['id' => 611, 'nom' => 'Sidi Belyout',   'nom_ar' => 'سيدي بليوط'],
                ['id' => 612, 'nom' => 'Anfa',            'nom_ar' => 'أنفا'],
                ['id' => 613, 'nom' => 'Maârif',         'nom_ar' => 'المعاريف'],
                ['id' => 614, 'nom' => 'Aïn Chock',      'nom_ar' => 'عين الشق'],
                ['id' => 615, 'nom' => 'Hay Hassani',    'nom_ar' => 'الحي الحسني'],
            ],
            41 => [ // Rabat
                ['id' => 411, 'nom' => 'Hassan',           'nom_ar' => 'حسان'],
                ['id' => 412, 'nom' => 'Agdal-Ryad',      'nom_ar' => 'أكدال الرياض'],
                ['id' => 413, 'nom' => 'Yaâcoub El Mansour','nom_ar' => 'يعقوب المنصور'],
            ],
            71 => [ // Marrakech
                ['id' => 711, 'nom' => 'Médina',          'nom_ar' => 'المدينة'],
                ['id' => 712, 'nom' => 'Guéliz',          'nom_ar' => 'جليز'],
                ['id' => 713, 'nom' => 'Sidi Youssef Ben Ali','nom_ar' => 'سيدي يوسف بن علي'],
            ],
            // Ajoutez d'autres communes selon besoin
        ];

        return response()->json($communes[$provinceId] ?? [
            ['id' => 0, 'nom' => 'Commune Générale', 'nom_ar' => 'جماعة عامة']
        ]);
    }

    /**
     * Recherche de communes (optionnel, pour l'autocomplétion).
     * Simulée ici ; à implémenter avec une vraie base de données.
     */
    public function search(Request $request)
    {
        // Retourne pour l'instant une liste vide ou un exemple
        return response()->json([]);
    }
}
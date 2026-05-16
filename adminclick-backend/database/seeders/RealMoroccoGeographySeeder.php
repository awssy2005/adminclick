<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Ville;
use App\Models\Arrondissement;
use App\Models\Secteur;

class RealMoroccoGeographySeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage préalable
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        Secteur::truncate();
        Arrondissement::truncate();
        Ville::truncate();
        Region::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $data = [
            [
                'nom' => 'Rabat-Salé-Kénitra',
                'nom_ar' => 'الرباط-سلا-القنيطرة',
                'villes' => [
                    [
                        'nom' => 'Rabat',
                        'nom_ar' => 'الرباط',
                        'arrondissements' => [
                            ['nom' => 'Hassan', 'nom_ar' => 'حسان', 'secteurs' => ['Centre-Ville', 'Quartier de l\'Océan']],
                            ['nom' => 'Agdal-Ryad', 'nom_ar' => 'أكدال الرياض', 'secteurs' => ['Agdal', 'Hay Riad']],
                            ['nom' => 'Youssoufia', 'nom_ar' => 'اليوسفية', 'secteurs' => ['Mabella', 'Takadoum']],
                            ['nom' => 'Yaâcoub El Mansour', 'nom_ar' => 'يعقوب المنصور', 'secteurs' => ['Massira', 'Amal']],
                            ['nom' => 'Souissi', 'nom_ar' => 'السويسي', 'secteurs' => ['Bir Kacem', 'Ambassades']],
                        ]
                    ],
                    [
                        'nom' => 'Salé',
                        'nom_ar' => 'سلا',
                        'arrondissements' => [
                            ['nom' => 'Bab Lamrissa', 'nom_ar' => 'باب لمريسة', 'secteurs' => ['Médina', 'Gharda']],
                            ['nom' => 'Tabriquet', 'nom_ar' => 'تابريكت', 'secteurs' => ['Hay Salam', 'Moulay Ismaïl']],
                            ['nom' => 'Layayda', 'nom_ar' => 'لعيايدة', 'secteurs' => ['Secteur 1', 'Secteur 2']],
                        ]
                    ],
                    ['nom' => 'Kénitra', 'nom_ar' => 'القنيطرة', 'arrondissements' => [['nom' => 'Kénitra Centre', 'nom_ar' => 'القنيطرة المركز', 'secteurs' => ['Maâmora', 'Bir Anzarane']]]],
                ]
            ],
            [
                'nom' => 'Casablanca-Settat',
                'nom_ar' => 'الدار البيضاء-سطات',
                'villes' => [
                    [
                        'nom' => 'Casablanca',
                        'nom_ar' => 'الدار البيضاء',
                        'arrondissements' => [
                            ['nom' => 'Anfa', 'nom_ar' => 'أنفا', 'secteurs' => ['Gauthier', 'Racine']],
                            ['nom' => 'Maârif', 'nom_ar' => 'المعاريف', 'secteurs' => ['Derb Ghallef', 'Palmiers']],
                            ['nom' => 'Sidi Belyout', 'nom_ar' => 'سيدي بليوط', 'secteurs' => ['Ancienne Médina', 'Sour Jdid']],
                            ['nom' => 'Hay Hassani', 'nom_ar' => 'الحي الحسني', 'secteurs' => ['Lissasfa', 'Oulfa']],
                            ['nom' => 'Aïn Chock', 'nom_ar' => 'عين الشق', 'secteurs' => ['Sidi Maârouf', 'California']],
                        ]
                    ],
                    ['nom' => 'Mohammédia', 'nom_ar' => 'المحمدية', 'arrondissements' => [['nom' => 'Mohammédia Ville', 'nom_ar' => 'المحمدية المدينة', 'secteurs' => ['Parc', 'Kasbah']]]],
                    ['nom' => 'Settat', 'nom_ar' => 'سطات', 'arrondissements' => [['nom' => 'Settat Centre', 'nom_ar' => 'سطات المركز', 'secteurs' => ['Quartier Administratif']]]],
                ]
            ],
            [
                'nom' => 'Tanger-Tétouan-Al Hoceïma',
                'nom_ar' => 'طنجة-تطوان-الحسيمة',
                'villes' => [
                    [
                        'nom' => 'Tanger',
                        'nom_ar' => 'طنجة',
                        'arrondissements' => [
                            ['nom' => 'Tanger-Médina', 'nom_ar' => 'طنجة المدينة', 'secteurs' => ['Marshane', 'Iberia']],
                            ['nom' => 'Beni Makada', 'nom_ar' => 'بني مكادة', 'secteurs' => ['M\'Sallah', 'Bir Chifa']],
                        ]
                    ],
                    ['nom' => 'Tétouan', 'nom_ar' => 'تطوان', 'arrondissements' => [['nom' => 'Tétouan Centre', 'nom_ar' => 'تطوان المركز', 'secteurs' => ['M\'hannech', 'Ensanche']]]],
                ]
            ],
            [
                'nom' => 'Marrakech-Safi',
                'nom_ar' => 'مراكش-آسفي',
                'villes' => [
                    [
                        'nom' => 'Marrakech',
                        'nom_ar' => 'مراكش',
                        'arrondissements' => [
                            ['nom' => 'Guéliz', 'nom_ar' => 'كيليز', 'secteurs' => ['Hivernage', 'Semlalia']],
                            ['nom' => 'Médina', 'nom_ar' => 'المدينة', 'secteurs' => ['Jemaa el-Fna', 'Mellah']],
                            ['nom' => 'Ménara', 'nom_ar' => 'المنارة', 'secteurs' => ['Massira', 'Azli']],
                        ]
                    ],
                    ['nom' => 'Safi', 'nom_ar' => 'آسفي', 'arrondissements' => [['nom' => 'Safi Ville', 'nom_ar' => 'آسفي المدينة', 'secteurs' => ['Biada', 'Plateau']]]],
                ]
            ],
            [
                'nom' => 'Fès-Meknès',
                'nom_ar' => 'فاس-مكناس',
                'villes' => [
                    ['nom' => 'Fès', 'nom_ar' => 'فاس', 'arrondissements' => [['nom' => 'Fès Médina', 'nom_ar' => 'فاس المدينة', 'secteurs' => ['Batha', 'Moulay Abdallah']]]],
                    ['nom' => 'Meknès', 'nom_ar' => 'مكناس', 'arrondissements' => [['nom' => 'Meknès-Hamria', 'nom_ar' => 'مكناس حمرية', 'secteurs' => ['Zitoune', 'Plaisance']]]],
                ]
            ],
            [
                'nom' => 'Souss-Massa',
                'nom_ar' => 'سوس-ماسة',
                'villes' => [
                    ['nom' => 'Agadir', 'nom_ar' => 'أكادير', 'arrondissements' => [['nom' => 'Agadir Ville', 'nom_ar' => 'أكادير المدينة', 'secteurs' => ['Talborjt', 'Anza']]]],
                ]
            ],
            [
                'nom' => 'L\'Oriental',
                'nom_ar' => 'الشرق',
                'villes' => [
                    ['nom' => 'Oujda', 'nom_ar' => 'وجدة', 'arrondissements' => [['nom' => 'Oujda Centre', 'nom_ar' => 'وجدة المركز', 'secteurs' => ['Lazaret', 'Al Qods']]]],
                ]
            ],
            [
                'nom' => 'Laâyoune-Sakia El Hamra',
                'nom_ar' => 'العيون-الساقية الحمراء',
                'villes' => [
                    ['nom' => 'Laâyoune', 'nom_ar' => 'العيون', 'arrondissements' => [['nom' => 'Laâyoune Ville', 'nom_ar' => 'العيون المدينة', 'secteurs' => ['Smara', 'Mecouar']]]],
                ]
            ],
            [
                'nom' => 'Dakhla-Oued Ed-Dahab',
                'nom_ar' => 'الداخلة-وادي الذهب',
                'villes' => [
                    ['nom' => 'Dakhla', 'nom_ar' => 'الداخلة', 'arrondissements' => [['nom' => 'Dakhla Centre', 'nom_ar' => 'الداخلة المركز', 'secteurs' => ['Hay Salam']]]],
                ]
            ],
            [
                'nom' => 'Béni Mellal-Khénifra',
                'nom_ar' => 'بني ملال-خنيفرة',
                'villes' => [
                    ['nom' => 'Béni Mellal', 'nom_ar' => 'بني ملال', 'arrondissements' => [['nom' => 'Béni Mellal Ville', 'nom_ar' => 'بني ملال المدينة', 'secteurs' => ['Riad']]]],
                ]
            ],
            [
                'nom' => 'Drâa-Tafilalet',
                'nom_ar' => 'درعة-تافيلالت',
                'villes' => [
                    ['nom' => 'Errachidia', 'nom_ar' => 'الرشيدية', 'arrondissements' => [['nom' => 'Errachidia Centre', 'nom_ar' => 'الرشيدية المركز', 'secteurs' => ['Targa']]]],
                ]
            ],
            [
                'nom' => 'Guelmim-Oued Noun',
                'nom_ar' => 'كلميم-واد نون',
                'villes' => [
                    ['nom' => 'Guelmim', 'nom_ar' => 'كلميم', 'arrondissements' => [['nom' => 'Guelmim Centre', 'nom_ar' => 'كلميم المركز', 'secteurs' => ['Al Qods']]]],
                ]
            ],
        ];

        foreach ($data as $r) {
            // Nettoyage du code (pas d'accents)
            $code = strtoupper(substr(str_replace(['â', 'é', 'è', 'ê', 'à'], ['a', 'e', 'e', 'e', 'a'], $r['nom']), 0, 3));
            
            $region = Region::create([
                'nom_fr' => $r['nom'],
                'nom_ar' => $r['nom_ar'],
                'code' => $code
            ]);

            foreach ($r['villes'] as $v) {
                $ville = Ville::create([
                    'nom' => $v['nom'],
                    'nom_ar' => $v['nom_ar'],
                    'region_id' => $region->id
                ]);

                foreach ($v['arrondissements'] as $a) {
                    $arrondissement = Arrondissement::create([
                        'nom' => $a['nom'],
                        'nom_ar' => $a['nom_ar'],
                        'ville_id' => $ville->id
                    ]);

                    foreach ($a['secteurs'] as $s) {
                        Secteur::create([
                            'nom' => $s,
                            'nom_ar' => $s, // On peut mettre le même pour l'instant ou traduire
                            'arrondissement_id' => $arrondissement->id
                        ]);
                    }
                }
            }
        }
    }
}

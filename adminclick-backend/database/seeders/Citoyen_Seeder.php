<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Citoyen;

class Citoyen_Seeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'cnie'           => 'BK123456',
                'nom_ar'         => 'بنعلي محمد',
                'prenom_ar'      => 'يوسف',
                'nom_fr'         => 'BENALI Mohammed',
                'prenom_fr'      => 'Youssef',
                'date_naissance' => '1990-03-15',
                'lieu_naissance' => 'Casablanca',
            ],
            [
                'cnie'           => 'EE987654',
                'nom_ar'         => 'الزهراء فاطمة',
                'prenom_ar'      => 'سارة',
                'nom_fr'         => 'EL ZAHRAA Fatima',
                'prenom_fr'      => 'Sara',
                'date_naissance' => '1985-07-22',
                'lieu_naissance' => 'Rabat',
            ],
            [
                'cnie'           => 'AB456789',
                'nom_ar'         => 'الإدريسي عمر',
                'prenom_ar'      => 'كريم',
                'nom_fr'         => 'IDRISSI Omar',
                'prenom_fr'      => 'Karim',
                'date_naissance' => '1978-11-08',
                'lieu_naissance' => 'Marrakech',
            ],
            [
                'cnie'           => 'CD112233',
                'nom_ar'         => 'التازي ليلى',
                'prenom_ar'      => 'نور',
                'nom_fr'         => 'TAZI Leila',
                'prenom_fr'      => 'Nour',
                'date_naissance' => '2000-01-30',
                'lieu_naissance' => 'Fès',
            ],
            [
                'cnie'           => 'GH778899',
                'nom_ar'         => 'حسين أحمد',
                'prenom_ar'      => 'رشيد',
                'nom_fr'         => 'HUSSEIN Ahmed',
                'prenom_fr'      => 'Rachid',
                'date_naissance' => '1995-06-17',
                'lieu_naissance' => 'Agadir',
            ],
        ];

        foreach ($data as $row) {
            Citoyen::updateOrCreate(['cnie' => $row['cnie']], $row);
        }
    }
}

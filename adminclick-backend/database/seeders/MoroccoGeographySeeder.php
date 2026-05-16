<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Province;
use App\Models\Commune;
use App\Models\District;
use App\Models\CivilOffice;

class MoroccoGeographySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['code'=>'RSK','fr'=>'Rabat-Salé-Kénitra','ar'=>'الرباط-سلا-القنيطرة','provinces'=>[
                ['code'=>'RAB','fr'=>'Rabat','ar'=>'الرباط','type'=>'prefecture','communes'=>[
                    ['code'=>'RAB-HAB','fr'=>'Hassan-Agdal','ar'=>'حسان أكدال','type'=>'arrondissement','districts'=>[
                        ['code'=>'RAB-HAB-HAS','fr'=>'Hassan','ar'=>'حسان'],
                        ['code'=>'RAB-HAB-AGD','fr'=>'Agdal','ar'=>'أكدال'],
                        ['code'=>'RAB-HAB-RYD','fr'=>'Riyad','ar'=>'الرياض'],
                    ]],
                    ['code'=>'RAB-OCC','fr'=>'Océan-Souissi','ar'=>'المحيط-السويسي','type'=>'arrondissement','districts'=>[
                        ['code'=>'RAB-OCC-OCN','fr'=>'Océan','ar'=>'المحيط'],
                        ['code'=>'RAB-OCC-SWS','fr'=>'Souissi','ar'=>'السويسي'],
                    ]],
                    ['code'=>'RAB-YAQ','fr'=>'Yaâcoub El Mansour','ar'=>'يعقوب المنصور','type'=>'arrondissement','districts'=>[
                        ['code'=>'RAB-YAQ-TAK','fr'=>'Takadoum','ar'=>'تقدوم'],
                        ['code'=>'RAB-YAQ-DOK','fr'=>'Dokkarat','ar'=>'الدوكارات'],
                    ]],
                ]],
                ['code'=>'SAL','fr'=>'Salé','ar'=>'سلا','type'=>'prefecture','communes'=>[
                    ['code'=>'SAL-BAB','fr'=>'Bab Lamrissa','ar'=>'باب لمريسة','type'=>'arrondissement','districts'=>[
                        ['code'=>'SAL-BAB-LAM','fr'=>'Lamrissa','ar'=>'لمريسة'],
                        ['code'=>'SAL-BAB-TAB','fr'=>'Tabriquet','ar'=>'طابريقت'],
                    ]],
                    ['code'=>'SAL-HAY','fr'=>'Hay Karima','ar'=>'حي كريمة','type'=>'arrondissement','districts'=>[
                        ['code'=>'SAL-HAY-KAR','fr'=>'Karima','ar'=>'كريمة'],
                        ['code'=>'SAL-HAY-INB','fr'=>'Inbiyate','ar'=>'انبياط'],
                    ]],
                ]],
                ['code'=>'KEN','fr'=>'Kénitra','ar'=>'القنيطرة','type'=>'province','communes'=>[
                    ['code'=>'KEN-VIL','fr'=>'Kénitra Ville','ar'=>'مدينة القنيطرة','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'KEN-VIL-CEN','fr'=>'Centre','ar'=>'المركز'],
                        ['code'=>'KEN-VIL-MED','fr'=>'Médina','ar'=>'المدينة القديمة'],
                    ]],
                    ['code'=>'KEN-SBH','fr'=>'Sebou','ar'=>'سبو','type'=>'commune_rurale','districts'=>[]],
                ]],
            ]],
            ['code'=>'CAS','fr'=>'Casablanca-Settat','ar'=>'الدار البيضاء-سطات','provinces'=>[
                ['code'=>'CAS-P','fr'=>'Casablanca','ar'=>'الدار البيضاء','type'=>'prefecture','communes'=>[
                    ['code'=>'CAS-SBL','fr'=>'Sidi Belyout','ar'=>'سيدي بليوط','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-SBL-MED','fr'=>'Médina','ar'=>'المدينة القديمة'],
                        ['code'=>'CAS-SBL-HAB','fr'=>'Habous','ar'=>'الحبوس'],
                    ]],
                    ['code'=>'CAS-ANF','fr'=>'Anfa','ar'=>'أنفا','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-ANF-GAU','fr'=>'Gauthier','ar'=>'غوتييه'],
                        ['code'=>'CAS-ANF-COR','fr'=>'Corniche','ar'=>'الكورنيش'],
                    ]],
                    ['code'=>'CAS-MAR','fr'=>'Maârif','ar'=>'المعاريف','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-MAR-MAR','fr'=>'Maârif','ar'=>'المعاريف'],
                        ['code'=>'CAS-MAR-OAS','fr'=>'Oasis','ar'=>'الواحة'],
                    ]],
                    ['code'=>'CAS-ACH','fr'=>'Aïn Chock','ar'=>'عين الشق','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-ACH-ACH','fr'=>'Aïn Chock','ar'=>'عين الشق'],
                        ['code'=>'CAS-ACH-SHD','fr'=>'Sidi El Hadj','ar'=>'سيدي الحاج'],
                    ]],
                    ['code'=>'CAS-HSN','fr'=>'Hay Hassani','ar'=>'الحي الحسني','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-HSN-HSN','fr'=>'Hay Hassani','ar'=>'الحي الحسني'],
                        ['code'=>'CAS-HSN-LIS','fr'=>'Lissasfa','ar'=>'ليساسفة'],
                    ]],
                    ['code'=>'CAS-BEN','fr'=>'Ben M\'Sick','ar'=>'بن مسيك','type'=>'arrondissement','districts'=>[
                        ['code'=>'CAS-BEN-BEN','fr'=>'Ben M\'Sick','ar'=>'بن مسيك'],
                        ['code'=>'CAS-BEN-SID','fr'=>'Sidi Moumen','ar'=>'سيدي مومن'],
                    ]],
                ]],
                ['code'=>'SET','fr'=>'Settat','ar'=>'سطات','type'=>'province','communes'=>[
                    ['code'=>'SET-VIL','fr'=>'Settat Ville','ar'=>'مدينة سطات','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'SET-VIL-CEN','fr'=>'Centre','ar'=>'المركز'],
                    ]],
                ]],
                ['code'=>'ELJ','fr'=>'El Jadida','ar'=>'الجديدة','type'=>'province','communes'=>[
                    ['code'=>'ELJ-VIL','fr'=>'El Jadida Ville','ar'=>'مدينة الجديدة','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'ELJ-VIL-MED','fr'=>'Médina','ar'=>'المدينة'],
                        ['code'=>'ELJ-VIL-HAD','fr'=>'Haouzia','ar'=>'الهوزية'],
                    ]],
                ]],
            ]],
            ['code'=>'TTH','fr'=>'Tanger-Tétouan-Al Hoceïma','ar'=>'طنجة-تطوان-الحسيمة','provinces'=>[
                ['code'=>'TNG','fr'=>'Tanger-Assilah','ar'=>'طنجة-أصيلة','type'=>'prefecture','communes'=>[
                    ['code'=>'TNG-MED','fr'=>'Médina de Tanger','ar'=>'مدينة طنجة','type'=>'arrondissement','districts'=>[
                        ['code'=>'TNG-MED-KSB','fr'=>'Kasbah','ar'=>'القصبة'],
                        ['code'=>'TNG-MED-ZIN','fr'=>'Ziane','ar'=>'زيان'],
                    ]],
                    ['code'=>'TNG-SUK','fr'=>'Souani','ar'=>'السواني','type'=>'arrondissement','districts'=>[
                        ['code'=>'TNG-SUK-SUK','fr'=>'Souani','ar'=>'السواني'],
                    ]],
                ]],
                ['code'=>'TTN','fr'=>'Tétouan','ar'=>'تطوان','type'=>'province','communes'=>[
                    ['code'=>'TTN-VIL','fr'=>'Tétouan Ville','ar'=>'مدينة تطوان','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'TTN-VIL-MED','fr'=>'Médina','ar'=>'المدينة'],
                        ['code'=>'TTN-VIL-SAF','fr'=>'Sania','ar'=>'الصانية'],
                    ]],
                ]],
                ['code'=>'AHC','fr'=>'Al Hoceïma','ar'=>'الحسيمة','type'=>'province','communes'=>[
                    ['code'=>'AHC-VIL','fr'=>'Al Hoceïma Ville','ar'=>'مدينة الحسيمة','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'FMK','fr'=>'Fès-Meknès','ar'=>'فاس-مكناس','provinces'=>[
                ['code'=>'FES','fr'=>'Fès','ar'=>'فاس','type'=>'prefecture','communes'=>[
                    ['code'=>'FES-FJD','fr'=>'Fès El Jedid','ar'=>'فاس الجديد','type'=>'arrondissement','districts'=>[
                        ['code'=>'FES-FJD-MED','fr'=>'Fès El Bali','ar'=>'فاس البالي'],
                        ['code'=>'FES-FJD-JED','fr'=>'El Jedid','ar'=>'الجديد'],
                    ]],
                    ['code'=>'FES-ZIT','fr'=>'Zitoun','ar'=>'الزيتون','type'=>'arrondissement','districts'=>[
                        ['code'=>'FES-ZIT-ZIT','fr'=>'Zitoun','ar'=>'الزيتون'],
                        ['code'=>'FES-ZIT-SAA','fr'=>'Saâda','ar'=>'سعادة'],
                    ]],
                ]],
                ['code'=>'MEK','fr'=>'Meknès','ar'=>'مكناس','type'=>'prefecture','communes'=>[
                    ['code'=>'MEK-HAM','fr'=>'Hamria','ar'=>'الحمرية','type'=>'arrondissement','districts'=>[
                        ['code'=>'MEK-HAM-HAM','fr'=>'Hamria','ar'=>'الحمرية'],
                    ]],
                    ['code'=>'MEK-ZIT','fr'=>'Zitoun','ar'=>'الزيتون','type'=>'arrondissement','districts'=>[
                        ['code'=>'MEK-ZIT-ZIT','fr'=>'Zitoun','ar'=>'الزيتون'],
                    ]],
                ]],
            ]],
            ['code'=>'ORI','fr'=>'L\'Oriental','ar'=>'الشرق','provinces'=>[
                ['code'=>'OUJ','fr'=>'Oujda-Angad','ar'=>'وجدة-أنكاد','type'=>'prefecture','communes'=>[
                    ['code'=>'OUJ-VIL','fr'=>'Oujda Ville','ar'=>'مدينة وجدة','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'OUJ-VIL-CEN','fr'=>'Centre','ar'=>'المركز'],
                        ['code'=>'OUJ-VIL-NAC','fr'=>'Naciria','ar'=>'ناصيرية'],
                    ]],
                ]],
                ['code'=>'NAD','fr'=>'Nador','ar'=>'الناظور','type'=>'province','communes'=>[
                    ['code'=>'NAD-VIL','fr'=>'Nador Ville','ar'=>'مدينة الناظور','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'NAD-VIL-CEN','fr'=>'Centre','ar'=>'المركز'],
                    ]],
                ]],
            ]],
            ['code'=>'MAR','fr'=>'Marrakech-Safi','ar'=>'مراكش-آسفي','provinces'=>[
                ['code'=>'MAR-P','fr'=>'Marrakech','ar'=>'مراكش','type'=>'prefecture','communes'=>[
                    ['code'=>'MAR-MED','fr'=>'Médina de Marrakech','ar'=>'مدينة مراكش','type'=>'arrondissement','districts'=>[
                        ['code'=>'MAR-MED-JNA','fr'=>'Jemaa El Fna','ar'=>'جامع الفنا'],
                        ['code'=>'MAR-MED-KSB','fr'=>'Kasbah','ar'=>'القصبة'],
                    ]],
                    ['code'=>'MAR-GEL','fr'=>'Guéliz','ar'=>'كيليز','type'=>'arrondissement','districts'=>[
                        ['code'=>'MAR-GEL-GEL','fr'=>'Guéliz','ar'=>'كيليز'],
                        ['code'=>'MAR-GEL-HIV','fr'=>'Hivernage','ar'=>'إيفرناج'],
                    ]],
                    ['code'=>'MAR-MEN','fr'=>'Menara','ar'=>'المنارة','type'=>'arrondissement','districts'=>[
                        ['code'=>'MAR-MEN-MEN','fr'=>'Menara','ar'=>'المنارة'],
                        ['code'=>'MAR-MEN-SYB','fr'=>'Seyba','ar'=>'السيبة'],
                    ]],
                ]],
                ['code'=>'SAF','fr'=>'Safi','ar'=>'آسفي','type'=>'province','communes'=>[
                    ['code'=>'SAF-VIL','fr'=>'Safi Ville','ar'=>'مدينة آسفي','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'SAF-VIL-MED','fr'=>'Médina','ar'=>'المدينة'],
                    ]],
                ]],
            ]],
            ['code'=>'SMA','fr'=>'Souss-Massa','ar'=>'سوس-ماسة','provinces'=>[
                ['code'=>'AGA','fr'=>'Agadir-Ida Ou Tanane','ar'=>'أكادير-إيداوتنان','type'=>'prefecture','communes'=>[
                    ['code'=>'AGA-BEN','fr'=>'Bensergao','ar'=>'بنسرقاو','type'=>'arrondissement','districts'=>[
                        ['code'=>'AGA-BEN-BEN','fr'=>'Bensergao','ar'=>'بنسرقاو'],
                        ['code'=>'AGA-BEN-HAD','fr'=>'Hay Dakhla','ar'=>'حي الداخلة'],
                    ]],
                    ['code'=>'AGA-ARR','fr'=>'Arrière-port','ar'=>'ميناء','type'=>'arrondissement','districts'=>[
                        ['code'=>'AGA-ARR-AER','fr'=>'Aéroport','ar'=>'المطار'],
                    ]],
                ]],
                ['code'=>'TAR','fr'=>'Taroudannt','ar'=>'تارودانت','type'=>'province','communes'=>[
                    ['code'=>'TAR-VIL','fr'=>'Taroudannt Ville','ar'=>'مدينة تارودانت','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'BMK','fr'=>'Béni Mellal-Khénifra','ar'=>'بني ملال-خنيفرة','provinces'=>[
                ['code'=>'BML','fr'=>'Béni Mellal','ar'=>'بني ملال','type'=>'province','communes'=>[
                    ['code'=>'BML-VIL','fr'=>'Béni Mellal Ville','ar'=>'مدينة بني ملال','type'=>'commune_urbaine','districts'=>[
                        ['code'=>'BML-VIL-CEN','fr'=>'Centre','ar'=>'المركز'],
                    ]],
                ]],
                ['code'=>'KHN','fr'=>'Khénifra','ar'=>'خنيفرة','type'=>'province','communes'=>[
                    ['code'=>'KHN-VIL','fr'=>'Khénifra Ville','ar'=>'مدينة خنيفرة','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'DRT','fr'=>'Drâa-Tafilalet','ar'=>'درعة-تافيلالت','provinces'=>[
                ['code'=>'ERS','fr'=>'Errachidia','ar'=>'الرشيدية','type'=>'province','communes'=>[
                    ['code'=>'ERS-VIL','fr'=>'Errachidia Ville','ar'=>'مدينة الرشيدية','type'=>'commune_urbaine','districts'=>[]],
                ]],
                ['code'=>'ZAG','fr'=>'Zagora','ar'=>'زاكورة','type'=>'province','communes'=>[
                    ['code'=>'ZAG-VIL','fr'=>'Zagora Ville','ar'=>'مدينة زاكورة','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'GUN','fr'=>'Guelmim-Oued Noun','ar'=>'كلميم-واد نون','provinces'=>[
                ['code'=>'GUL','fr'=>'Guelmim','ar'=>'كلميم','type'=>'province','communes'=>[
                    ['code'=>'GUL-VIL','fr'=>'Guelmim Ville','ar'=>'مدينة كلميم','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'LSH','fr'=>'Laâyoune-Sakia El Hamra','ar'=>'العيون-الساقية الحمراء','provinces'=>[
                ['code'=>'LAA','fr'=>'Laâyoune','ar'=>'العيون','type'=>'province','communes'=>[
                    ['code'=>'LAA-VIL','fr'=>'Laâyoune Ville','ar'=>'مدينة العيون','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
            ['code'=>'DOD','fr'=>'Dakhla-Oued Ed-Dahab','ar'=>'الداخلة-وادي الذهب','provinces'=>[
                ['code'=>'DAK','fr'=>'Oued Ed-Dahab','ar'=>'وادي الذهب','type'=>'province','communes'=>[
                    ['code'=>'DAK-VIL','fr'=>'Dakhla Ville','ar'=>'مدينة الداخلة','type'=>'commune_urbaine','districts'=>[]],
                ]],
            ]],
        ];

        foreach ($data as $rd) {
            $region = Region::create(['nom_fr'=>$rd['fr'],'nom_ar'=>$rd['ar'],'code'=>$rd['code']]);
            foreach ($rd['provinces'] as $pd) {
                $province = Province::create([
                    'region_id'=>$region->id,'nom_fr'=>$pd['fr'],'nom_ar'=>$pd['ar'],
                    'code'=>$pd['code'],'type'=>$pd['type'],
                ]);
                foreach ($pd['communes'] as $cd) {
                    $commune = Commune::create([
                        'province_id'=>$province->id,'nom_fr'=>$cd['fr'],'nom_ar'=>$cd['ar'],
                        'code'=>$cd['code'],'type'=>$cd['type'],
                    ]);
                    foreach ($cd['districts'] as $dd) {
                        $district = District::create([
                            'commune_id'=>$commune->id,'nom_fr'=>$dd['fr'],'nom_ar'=>$dd['ar'],
                            'code'=>$dd['code'],
                        ]);
                        CivilOffice::create([
                            'commune_id'=>$commune->id,'district_id'=>$district->id,
                            'nom_fr'=>'Bureau d\'État Civil – '.$dd['fr'],
                            'nom_ar'=>'مكتب الحالة المدنية – '.$dd['ar'],
                            'code'=>'BEC-'.$dd['code'],
                        ]);
                    }
                    // One general civil office per commune
                    CivilOffice::create([
                        'commune_id'=>$commune->id,'district_id'=>null,
                        'nom_fr'=>'Bureau d\'État Civil Principal – '.$cd['fr'],
                        'nom_ar'=>'مكتب الحالة المدنية الرئيسي – '.$cd['ar'],
                        'code'=>'BEC-MAIN-'.$cd['code'],
                    ]);
                }
            }
        }
    }
}

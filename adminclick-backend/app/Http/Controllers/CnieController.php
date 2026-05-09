<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Citoyen;

class CnieController extends Controller
{
    public function fetch(Request $request)
    {
        $request->validate([
            'cnie' => ['required', 'string', 'regex:/^[A-Za-z]{1,2}\d{5,6}$/'],
        ]);

        $cnie = strtoupper(trim($request->input('cnie')));

        $citoyen = Citoyen::where('cnie', $cnie)->first();

        if (!$citoyen) {
            return response()->json([
                'fr' => 'Aucun citoyen trouvé pour ce numéro de CNIE. Veuillez vérifier le numéro ou remplir les champs manuellement.',
                'ar' => 'لم يتم العثور على أي مواطن بهذا الرقم. يرجى التحقق من الرقم أو ملء الحقول يدويًا.',
            ], 404);
        }

        return response()->json([
            'nom_ar'         => $citoyen->nom_ar,
            'prenom_ar'      => $citoyen->prenom_ar,
            'nom_fr'         => $citoyen->nom_fr,
            'prenom_fr'      => $citoyen->prenom_fr,
            'date_naissance' => $citoyen->date_naissance->format('Y-m-d'),
            'lieu_naissance' => $citoyen->lieu_naissance,
        ]);
    }
}

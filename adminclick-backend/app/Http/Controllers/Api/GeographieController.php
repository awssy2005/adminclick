<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;
use App\Models\Ville;
use App\Models\Arrondissement;
use App\Models\Secteur;
use Illuminate\Http\Request;

class GeographieController extends Controller
{
    /**
     * Liste des régions.
     * La table regions a les colonnes nom_fr et nom_ar -> on les aliase en "nom" et "nom_ar".
     */
    public function getRegions()
    {
        return response()->json(
            Region::select('id', 'nom_fr as nom', 'nom_ar')->get()
        );
    }

    /**
     * Villes d'une région.
     */
    public function getVilles($regionId)
    {
        return response()->json(
            Ville::where('region_id', $regionId)
                ->select('id', 'nom', 'nom_ar')
                ->get()
        );
    }

    /**
     * Arrondissements d'une ville.
     */
    public function getArrondissements($villeId)
    {
        return response()->json(
            Arrondissement::where('ville_id', $villeId)
                ->select('id', 'nom', 'nom_ar')
                ->get()
        );
    }

    /**
     * Secteurs d'un arrondissement.
     * On renvoie aussi les champs supplémentaires utilisés dans le composant React.
     */
    public function getSecteurs($arrondissementId)
    {
        return response()->json(
            Secteur::where('arrondissement_id', $arrondissementId)
                ->select('id', 'nom', 'nom_ar', 'numero', 'code_postal', 'latitude', 'longitude')
                ->get()
        );
    }

    /**
     * Recherche textuelle de villes (optionnel).
     */
    public function search(Request $request)
    {
        $q = $request->input('q');
        $villes = Ville::where('nom', 'like', "%{$q}%")
                    ->limit(10)
                    ->get(['id', 'nom', 'nom_ar']);
        return response()->json($villes);
    }
}
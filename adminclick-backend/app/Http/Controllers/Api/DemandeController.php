<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\TrackingEvent;
use App\Http\Resources\DemandeResource;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index(Request $request)
    {
        $demandes = $request->user()->demandes()
            ->with('documents')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($demandes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // Étape 1 : Demandeur
            'cin'                 => 'required|string|size:7',
            'nom_fr'              => 'required|string',
            'nom_ar'              => 'required|string',
            'prenom_fr'           => 'required|string',
            'prenom_ar'           => 'required|string',
            'date_naissance'      => 'required|date',
            'lieu_naissance_fr'   => 'required|string',
            'lieu_naissance_ar'   => 'required|string',
            'adresse'             => 'required|string',
            'telephone'           => 'required|string',
            'email'               => 'required|email',
            'sexe'                => 'required|in:M,F',        // ← nouveau
            'nationalite'         => 'required|string',        // ← nouveau

            // Étape 2 : Parents
            'nom_pere_fr'             => 'required|string',
            'nom_pere_ar'             => 'required|string',
            'nom_mere_fr'             => 'required|string',
            'nom_mere_ar'             => 'required|string',
            'date_naissance_parent'   => 'nullable|date',
            'lieu_naissance_parent_fr'=> 'required|string',
            'lieu_naissance_parent_ar'=> 'required|string',

            // Étape 3 : État civil
            'bureau_etat_civil_fr'    => 'required|string',    // ← mis en cohérence avec le front
            'bureau_etat_civil_ar'    => 'required|string',
            'numero_registre'         => 'nullable|string',
            'annee_registre'          => 'nullable|integer',

            // Étape 4 : Document
            'type_document'       => 'required|in:simple,integrale',
            'langue_document'     => 'required|in:fr,ar,bilingue',

            // Étape 5 : Réception
            'mode_reception'      => 'required|in:domicile,bureau',
            'adresse_livraison'   => 'required_if:mode_reception,domicile|string',
        ]);

        // Vérification CIN
        if (!preg_match('/^[A-Z]{1,2}\d{5,6}$/', strtoupper($validated['cin']))) {
            return response()->json(['message' => 'CIN invalide'], 422);
        }

        // Créer la demande (stocke tout le payload dans la colonne `data`)
        $demande = Demande::create([
            'user_id' => auth()->id(),
            'data'    => json_encode($request->all()),
            'statut'  => 'en_attente',
        ]);

        // Créer le premier événement de suivi
        TrackingEvent::create([
            'demande_id' => $demande->id,
            'statut'     => 'en_attente',
            'commentaire'=> 'Demande soumise',
        ]);

        return new DemandeResource($demande);
    }

    public function show(Request $request, $id)
    {
        $demande = $request->user()->demandes()
            ->with(['documents', 'payment', 'appointment'])
            ->findOrFail($id);

        return response()->json($demande);
    }

    public function getStats(Request $request)
    {
        $user = $request->user();
        $demandes = $user->demandes;

        return response()->json([
            'total'      => $demandes->count(),
            'en_attente' => $demandes->where('status', 'en_attente')->count(),
            'en_cours'   => $demandes->where('status', 'en_cours')->count(),
            'validee'    => $demandes->where('status', 'validee')->count(),
            'rejetee'    => $demandes->where('status', 'rejetee')->count(),
        ]);
    }

    public function getServices()
    {
        return response()->json([
            ['id' => 'acte_naissance',       'name' => 'Acte de Naissance',             'description' => 'Demandez une copie de votre acte de naissance',   'icon' => 'birth',  'delay' => '3-5 jours'],
            ['id' => 'certificat_residence', 'name' => 'Certificat de Résidence',       'description' => 'Obtenez un certificat de résidence officiel',      'icon' => 'home',   'delay' => '2-3 jours'],
            ['id' => 'carte_nationale',      'name' => 'Carte Nationale d\'Identité',   'description' => 'Demandez ou renouvelez votre carte nationale',    'icon' => 'id',     'delay' => '7-14 jours'],
            ['id' => 'extrait_casier',       'name' => 'Extrait de Casier Judiciaire',  'description' => 'Obtenez votre extrait de casier judiciaire',      'icon' => 'legal',  'delay' => '5-7 jours'],
            ['id' => 'attestation_travail',  'name' => 'Attestation de Travail',        'description' => 'Demandez une attestation de travail officielle',   'icon' => 'work',   'delay' => '2-4 jours'],
        ]);
    }

    private function getTypeLabel($type)
    {
        $labels = [
            'acte_naissance'       => 'Acte de Naissance',
            'certificat_residence' => 'Certificat de Résidence',
            'carte_nationale'      => 'Carte Nationale d\'Identité',
            'extrait_casier'       => 'Extrait de Casier Judiciaire',
            'attestation_travail'  => 'Attestation de Travail',
        ];
        return $labels[$type] ?? $type;
    }
}
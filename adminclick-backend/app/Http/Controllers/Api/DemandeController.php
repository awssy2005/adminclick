<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\Document;
use App\Models\AppNotification;
use Illuminate\Http\Request;

class DemandeController extends Controller
{
    public function index(Request $request)
    {
        $demandes = $request->user()->demandes()
            ->with('documents')
            ->orderBy('created_at', 'desc')
            ->paginate(10); // ← pagination ajoutée

        return response()->json($demandes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:acte_naissance,certificat_residence,carte_nationale,extrait_casier,attestation_travail',
            'description' => 'nullable|string',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240', // ← validation MIME ajoutée
        ]);

        $demande = Demande::create([
            'user_id' => $request->user()->id,
            'type' => $request->type,
            'description' => $request->description,
            'status' => 'en_attente',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('documents', 'public');
                Document::create([
                    'demande_id' => $demande->id,
                    'name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType(),
                    'file_size' => $file->getSize(),
                ]);
            }
        }

        AppNotification::create([
            'user_id' => $request->user()->id,
            'title' => 'Nouvelle demande soumise',
            'message' => 'Votre demande de type "' . $this->getTypeLabel($request->type) . '" a été soumise avec succès. Référence: #' . $demande->id,
            'type' => 'info',
        ]);

        return response()->json($demande->load('documents'), 201);
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
            'total' => $demandes->count(),
            'en_attente' => $demandes->where('status', 'en_attente')->count(),
            'en_cours' => $demandes->where('status', 'en_cours')->count(),
            'validee' => $demandes->where('status', 'validee')->count(),
            'rejetee' => $demandes->where('status', 'rejetee')->count(),
        ]);
    }

    public function getServices()
    {
        return response()->json([
            ['id' => 'acte_naissance', 'name' => 'Acte de Naissance', 'description' => 'Demandez une copie de votre acte de naissance', 'icon' => 'birth', 'delay' => '3-5 jours'],
            ['id' => 'certificat_residence', 'name' => 'Certificat de Résidence', 'description' => 'Obtenez un certificat de résidence officiel', 'icon' => 'home', 'delay' => '2-3 jours'],
            ['id' => 'carte_nationale', 'name' => 'Carte Nationale d\'Identité', 'description' => 'Demandez ou renouvelez votre carte nationale', 'icon' => 'id', 'delay' => '7-14 jours'],
            ['id' => 'extrait_casier', 'name' => 'Extrait de Casier Judiciaire', 'description' => 'Obtenez votre extrait de casier judiciaire', 'icon' => 'legal', 'delay' => '5-7 jours'],
            ['id' => 'attestation_travail', 'name' => 'Attestation de Travail', 'description' => 'Demandez une attestation de travail officielle', 'icon' => 'work', 'delay' => '2-4 jours'],
        ]);
    }

    private function getTypeLabel($type)
    {
        $labels = [
            'acte_naissance' => 'Acte de Naissance',
            'certificat_residence' => 'Certificat de Résidence',
            'carte_nationale' => 'Carte Nationale d\'Identité',
            'extrait_casier' => 'Extrait de Casier Judiciaire',
            'attestation_travail' => 'Attestation de Travail',
        ];
        return $labels[$type] ?? $type;
    }
}

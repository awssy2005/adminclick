<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PdfController extends Controller
{
    public function downloadDemande(Request $request, $id)
    {
        $demande = $request->user()->demandes()
            ->with(['documents', 'payment', 'appointment'])
            ->findOrFail($id);

        // Seules les demandes validées peuvent être exportées en PDF
        if ($demande->status !== 'validee') {
            return response()->json([
                'message' => 'Seules les demandes validées peuvent être exportées en PDF.'
            ], 403);
        }

        $typeLabels = [
            'acte_naissance' => 'Acte de Naissance',
            'certificat_residence' => 'Certificat de Résidence',
            'carte_nationale' => 'Carte Nationale d\'Identité',
            'extrait_casier' => 'Extrait de Casier Judiciaire',
            'attestation_travail' => 'Attestation de Travail',
        ];

        $data = [
            'demande' => $demande,
            'user' => $request->user(),
            'typeLabel' => $typeLabels[$demande->type] ?? $demande->type,
            'date' => now()->format('d/m/Y'),
        ];

        $pdf = Pdf::loadView('pdf.demande', $data);

        return $pdf->download('demande-' . $demande->id . '.pdf');
    }
}

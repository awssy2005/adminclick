<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Demande;
use App\Models\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'demande_id' => 'required|exists:demandes,id',
            'amount'     => 'required|numeric|min:0',
            'method'     => 'required|in:carte,virement,especes',
        ]);

        // Vérifier que la demande appartient à l'utilisateur connecté
        $demande = Demande::where('id', $request->demande_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Vérifier qu'un paiement n'existe pas déjà
        if ($demande->payment) {
            return response()->json([
                'message' => 'Un paiement existe déjà pour cette demande.'
            ], 422);
        }

        $payment = Payment::create([
            'demande_id' => $demande->id,
            'amount'     => $request->amount,
            'method'     => $request->method,
            'status'     => 'complete',
            'reference'  => 'PAY-' . strtoupper(Str::random(8)),
        ]);

        // Notifier l'utilisateur
        AppNotification::create([
            'user_id' => $request->user()->id,
            'title'   => 'Paiement confirmé',
            'message' => 'Votre paiement de ' . $request->amount . ' MAD a été enregistré. Référence: ' . $payment->reference,
            'type'    => 'success',
        ]);

        return response()->json($payment->load('demande'), 201);
    }

    public function show(Request $request, $id)
    {
        $payment = Payment::whereHas('demande', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        return response()->json($payment);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Demande;
use App\Models\AppNotification;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $appointments = Appointment::whereHas('demande', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
        ->with('demande')
        ->orderBy('date', 'asc')
        ->get();

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'demande_id' => 'required|exists:demandes,id',
            'date'       => 'required|date|after:today',
            'time'       => 'required|string',
            'location'   => 'nullable|string|max:255',
        ]);

        // Vérifier que la demande appartient à l'utilisateur
        $demande = Demande::where('id', $request->demande_id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        // Vérifier qu'un rendez-vous n'existe pas déjà
        if ($demande->appointment) {
            return response()->json([
                'message' => 'Un rendez-vous existe déjà pour cette demande.'
            ], 422);
        }

        $appointment = Appointment::create([
            'demande_id' => $demande->id,
            'date'       => $request->date,
            'time'       => $request->time,
            'location'   => $request->location ?? 'Commune principale',
            'status'     => 'planifie',
        ]);

        // Notifier l'utilisateur
        AppNotification::create([
            'user_id' => $request->user()->id,
            'title'   => 'Rendez-vous confirmé',
            'message' => 'Votre rendez-vous est fixé le ' . $request->date . ' à ' . $request->time . ' — ' . ($request->location ?? 'Commune principale'),
            'type'    => 'success',
        ]);

        return response()->json($appointment->load('demande'), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'date'     => 'sometimes|date|after:today',
            'time'     => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'status'   => 'sometimes|in:planifie,confirme,annule',
        ]);

        $appointment = Appointment::whereHas('demande', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        $appointment->update($request->only(['date', 'time', 'location', 'status']));

        AppNotification::create([
            'user_id' => $request->user()->id,
            'title'   => 'Rendez-vous modifié',
            'message' => 'Votre rendez-vous a été mis à jour.',
            'type'    => 'info',
        ]);

        return response()->json($appointment->load('demande'));
    }

    public function destroy(Request $request, $id)
    {
        $appointment = Appointment::whereHas('demande', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($id);

        $appointment->delete();

        AppNotification::create([
            'user_id' => $request->user()->id,
            'title'   => 'Rendez-vous annulé',
            'message' => 'Votre rendez-vous a été annulé avec succès.',
            'type'    => 'info',
        ]);

        return response()->json(['message' => 'Rendez-vous annulé avec succès.']);
    }
}

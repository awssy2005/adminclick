<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\TrackingEvent;
use App\Services\NotificationService;
use Illuminate\Http\Request;

/**
 * TrackingController
 * ------------------
 * GET  /api/demandes/{id}/tracking  — liste les événements (propriétaire)
 * POST /api/demandes/{id}/tracking  — ajoute un événement (admin/système)
 */
class TrackingController extends Controller
{
    public function __construct(private NotificationService $notifier) {}

    // ── GET /api/demandes/{id}/tracking ──────────────────────────────
    public function index(Request $request, int $id)
    {
        $demande = Demande::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $events = TrackingEvent::where('demande_id', $demande->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($e) => [
                'id'            => $e->id,
                'status'        => $e->status,
                'description'   => $e->description,
                'location'      => $e->location,
                'tracking_code' => $e->tracking_code,
                'created_at'    => $e->created_at?->toIso8601String(),
            ]);

        return response()->json([
            'events'        => $events,
            'tracking_code' => $demande->tracking_code,
        ]);
    }

    // ── POST /api/demandes/{id}/tracking ─────────────────────────────
    // Protégé par le middleware 'admin' dans les routes
    public function store(Request $request, int $id)
    {
        $demande = Demande::findOrFail($id);

        $validated = $request->validate([
            'status'        => 'required|string|max:60',
            'description'   => 'required|string',
            'location'      => 'nullable|string|max:150',
            'tracking_code' => 'nullable|string|max:80',
        ]);

        // Enregistrement de l'événement
        $event = TrackingEvent::create([
            'demande_id'    => $demande->id,
            'status'        => $validated['status'],
            'description'   => $validated['description'],
            'location'      => $validated['location'] ?? null,
            'tracking_code' => $validated['tracking_code'] ?? null,
        ]);

        // Mise à jour du tracking_code sur la demande si fourni
        if (!empty($validated['tracking_code'])) {
            $demande->update(['tracking_code' => $validated['tracking_code']]);
        }

        // Envoi des notifications multicanales au propriétaire
        $owner = $demande->user;
        if ($owner) {
            $this->notifier->send($owner, [
                'title'      => "Mise à jour de votre demande #{$demande->id}",
                'message'    => "{$validated['status']} — {$validated['description']}",
                'demande_id' => $demande->id,
            ]);
        }

        return response()->json([
            'event'   => $event,
            'demande' => $demande->fresh(),
        ], 201);
    }
}

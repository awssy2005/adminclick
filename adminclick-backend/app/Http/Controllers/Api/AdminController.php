<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\AppNotification;
use App\Models\ActivityLog;
use App\Models\User;
use App\Jobs\SendDemandeStatusNotification;
use App\Http\Resources\UserResource;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;  
class AdminController extends Controller
{
    public function allDemandes(Request $request)
    {
        $query = Demande::with(['user', 'documents']);

        // Filtres optionnels
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', $search)
                  ->orWhereHas('user', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $demandes = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($demandes);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:en_attente,en_cours,validee,rejetee',
            'notes' => 'nullable|string',
        ]);

        $demande = Demande::findOrFail($id);
        $oldStatus = $demande->status;

        $demande->update([
            'status' => $request->status,
            'notes' => $request->notes,
        ]);

        $statusLabels = [
            'en_attente' => 'mise en attente',
            'en_cours' => 'en cours de traitement',
            'validee' => 'validée',
            'rejetee' => 'rejetée',
        ];

        // Audit trail — Logger le changement de statut
        ActivityLog::log([
            'user_id'    => $demande->user_id,
            'admin_id'   => $request->user()->id,
            'demande_id' => $demande->id,
            'action'     => 'status_changed',
            'old_value'  => ['status' => $oldStatus],
            'new_value'  => ['status' => $request->status, 'notes' => $request->notes],
            'description' => 'Statut de la demande #' . $demande->id . ' changé de "' . $oldStatus . '" à "' . $request->status . '" par l\'admin #' . $request->user()->id,
            'ip_address' => $request->ip(),
        ]);

        // Notification in-app
        AppNotification::create([
            'user_id' => $demande->user_id,
            'title' => 'Mise à jour de votre demande #' . $demande->id,
            'message' => 'Votre demande a été ' . ($statusLabels[$request->status] ?? $request->status) . '.' . ($request->notes ? ' Note: ' . $request->notes : ''),
            'type' => $request->status === 'validee' ? 'success' : ($request->status === 'rejetee' ? 'error' : 'info'),
        ]);

        // Notification email asynchrone (Queue)
        $user = User::find($demande->user_id);
        if ($user) {
            SendDemandeStatusNotification::dispatch($demande, $user);
        }

        return response()->json($demande->load(['user', 'documents']));
    }

    public function allUsers()
    {
        $users = User::withCount('demandes')->paginate(15);
        return response()->json($users);
    }

    public function stats()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_demandes' => Demande::count(),
            'en_attente' => Demande::where('status', 'en_attente')->count(),
            'en_cours' => Demande::where('status', 'en_cours')->count(),
            'validee' => Demande::where('status', 'validee')->count(),
            'rejetee' => Demande::where('status', 'rejetee')->count(),
        ]);
    }

    /**
     * Récupérer les logs d'activité.
     */
    public function activityLogs(Request $request)
    {
        $logs = ActivityLog::with(['user', 'admin', 'demande'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    /**
     * Récupérer les logs d'une demande spécifique.
     */
    public function demandeActivityLogs($id)
    {
        $logs = ActivityLog::where('demande_id', $id)
            ->with(['admin'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($logs);
    }
    // App/Http/Controllers/Api/AdminController.php
public function createAdmin(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ]);
    
    $admin = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    
    ActivityLog::log([
        'admin_id' => $request->user()->id,
        'action' => 'admin_created',
        'description' => 'Nouvel administrateur créé : ' . $admin->email,
        'ip_address' => $request->ip(),
    ]);
    
    return response()->json([
        'message' => 'Administrateur créé avec succès',
        'user' => new UserResource($admin)
    ], 201);
}
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Document;
use Carbon\Carbon;

class DocumentController extends Controller
{
    private const ALLOWED_TYPES = ['acte_naissance', 'certificat_residence', 'carte_nationale', 'extrait_casier', 'attestation_travail', 'autre'];
    private const MAX_SIZE_MB   = 10;

    // ── POST /api/documents/upload ─────────────────────────────────
    public function upload(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:' . (self::MAX_SIZE_MB * 1024)],
            'type' => ['nullable', 'string', 'in:' . implode(',', self::ALLOWED_TYPES)],
        ]);

        $user   = $request->user();
        $file   = $request->file('file');
        $type   = $request->input('type', 'autre');
        $folder = "documents/{$user->id}";

        $path = $file->store($folder, 'local');   // storage/app/documents/{user_id}/xxx

        $document = Document::create([
            'user_id'   => $user->id,
            'name'      => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'type'      => $type,
            'encrypted' => false,
        ]);

        return response()->json($this->format($document), 201);
    }

    // ── GET /api/documents ─────────────────────────────────────────
    public function index(Request $request)
    {
        $query = Document::where('user_id', $request->user()->id)
                         ->orderBy('created_at', 'desc');

        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        return response()->json($query->get()->map(fn($d) => $this->format($d)));
    }

    // ── GET /api/documents/{id}/download ──────────────────────────
    public function download(Request $request, $id)
    {
        $document = Document::where('id', $id)
                            ->where('user_id', $request->user()->id)
                            ->firstOrFail();

        if (!Storage::disk('local')->exists($document->file_path)) {
            return response()->json(['message' => 'Fichier introuvable sur le serveur.'], 404);
        }

        return Storage::disk('local')->download($document->file_path, $document->name);
    }

    // ── DELETE /api/documents/{id} ────────────────────────────────
    public function destroy(Request $request, $id)
    {
        $document = Document::where('id', $id)
                            ->where('user_id', $request->user()->id)
                            ->firstOrFail();

        Storage::disk('local')->delete($document->file_path);
        $document->delete();

        return response()->json(['message' => 'Document supprimé avec succès.']);
    }

    // ── POST /api/documents/{id}/share ────────────────────────────
    public function share(Request $request, $id)
    {
        $document = Document::where('id', $id)
                            ->where('user_id', $request->user()->id)
                            ->firstOrFail();

        // Renouvelle systématiquement le token
        $token = Str::random(64);
        $document->update([
            'share_token'      => $token,
            'share_expires_at' => Carbon::now()->addHours(24),
        ]);

        $url = url("/api/documents/shared/{$token}");

        return response()->json([
            'share_url'  => $url,
            'expires_at' => $document->share_expires_at->toIso8601String(),
        ]);
    }

    // ── GET /api/documents/shared/{token}  (public) ───────────────
    public function downloadShared($token)
    {
        $document = Document::where('share_token', $token)->first();

        if (!$document || !$document->shareIsValid()) {
            return response()->json([
                'message' => 'Ce lien est invalide ou a expiré.',
            ], 410);
        }

        if (!Storage::disk('local')->exists($document->file_path)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        return Storage::disk('local')->download($document->file_path, $document->name);
    }

    // ── Formatter ─────────────────────────────────────────────────
    private function format(Document $d): array
    {
        return [
            'id'         => $d->id,
            'name'       => $d->name,
            'type'       => $d->type,
            'file_type'  => $d->file_type,
            'size'       => $d->file_size,
            'encrypted'  => $d->encrypted,
            'created_at' => $d->created_at?->toIso8601String(),
            'share_active' => $d->shareIsValid(),
        ];
    }
}

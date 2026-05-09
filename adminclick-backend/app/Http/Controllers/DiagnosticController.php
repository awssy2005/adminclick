<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Diagnostic;

class DiagnosticController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'responses' => 'required|array',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $diagnostic = Diagnostic::create([
            'user_id' => $request->user()?->id,
            'responses' => $validated['responses'],
            'contact_email' => $validated['contact_email'],
            'contact_phone' => $validated['contact_phone'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Diagnostic enregistré avec succès',
            'diagnostic' => $diagnostic,
        ], 201);
    }
}

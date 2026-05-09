<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationPreferencesController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'notif_email'    => 'boolean',
            'notif_sms'      => 'boolean',
            'notif_whatsapp' => 'boolean',
            'phone'          => 'nullable|string|max:20',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'Préférences mises à jour.',
            'prefs'   => $request->user()->only(['notif_email', 'notif_sms', 'notif_whatsapp', 'phone']),
        ]);
    }

    public function show(Request $request)
    {
        return response()->json(
            $request->user()->only(['notif_email', 'notif_sms', 'notif_whatsapp', 'phone'])
        );
    }
}

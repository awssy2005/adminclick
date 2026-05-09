<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\SmsLog;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * NotificationService
 * -------------------
 * Distribue les notifications multicanales selon les préférences de l'utilisateur.
 * L'email utilise Laravel Mail (log driver en dev).
 * Le SMS/WhatsApp est simulé via la table sms_logs + Log::info.
 */
class NotificationService
{
    /**
     * Envoie une notification multicanale à un utilisateur.
     *
     * @param User   $user
     * @param array  $data  ['title' => '', 'message' => '', 'demande_id' => int]
     */
    public function send(User $user, array $data): void
    {
        $title     = $data['title']   ?? 'AdminClick — Mise à jour';
        $message   = $data['message'] ?? '';
        $demandeId = $data['demande_id'] ?? null;

        // ── 1. Notification in-app (toujours) ──────────────────────────
        AppNotification::create([
            'user_id'   => $user->id,
            'title'     => $title,
            'message'   => $message,
            'type'      => 'tracking',
            'is_read'   => false,
        ]);

        // ── 2. Email ────────────────────────────────────────────────────
        if ($user->notif_email) {
            try {
                Mail::raw(
                    "AdminClick — {$title}\n\n{$message}\n\nConsultez votre espace : " . config('app.url'),
                    function ($m) use ($user, $title) {
                        $m->to($user->email, $user->name)
                          ->subject("AdminClick : {$title}");
                    }
                );
                Log::info("[NotificationService] Email envoyé à {$user->email} — {$title}");
            } catch (\Throwable $e) {
                Log::error("[NotificationService] Échec email {$user->email}: {$e->getMessage()}");
            }
        }

        // ── 3. SMS / WhatsApp simulé ────────────────────────────────────
        $phone = $user->phone;

        if ($user->notif_sms && $phone) {
            $this->logSms($user, $phone, $message, 'sms');
        }

        if ($user->notif_whatsapp && $phone) {
            $this->logSms($user, $phone, $message, 'whatsapp');
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private function logSms(User $user, string $phone, string $content, string $channel): void
    {
        SmsLog::create([
            'user_id'  => $user->id,
            'to_phone' => $phone,
            'content'  => $content,
            'channel'  => $channel,
            'status'   => 'simulated',
        ]);

        Log::info("[NotificationService] {$channel} simulé → {$phone}: {$content}");
    }
}

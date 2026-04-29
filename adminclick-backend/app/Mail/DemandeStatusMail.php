<?php

namespace App\Mail;

use App\Models\Demande;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DemandeStatusMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public Demande $demande;
    public User $user;
    public string $statusLabel;

    /**
     * Create a new message instance.
     */
    public function __construct(Demande $demande, User $user)
    {
        $this->demande = $demande;
        $this->user = $user;

        $statusLabels = [
            'en_attente' => 'mise en attente',
            'en_cours' => 'en cours de traitement',
            'validee' => 'validée',
            'rejetee' => 'rejetée',
        ];

        $this->statusLabel = $statusLabels[$demande->status] ?? $demande->status;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mise à jour de votre demande #' . $this->demande->id . ' — AdminClick',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.demande-status',
            with: [
                'demande' => $this->demande,
                'user' => $this->user,
                'statusLabel' => $this->statusLabel,
            ],
        );
    }
}

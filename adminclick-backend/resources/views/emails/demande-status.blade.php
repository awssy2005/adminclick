<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mise à jour de votre demande — AdminClick</title>
    <style>
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0 0 5px;
            font-size: 20px;
        }
        .email-header p {
            margin: 0;
            opacity: 0.9;
            font-size: 13px;
        }
        .email-body {
            padding: 30px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 16px;
            color: #1a1a2e;
        }
        .message {
            font-size: 14px;
            line-height: 1.8;
            color: #4a4a6a;
            margin-bottom: 24px;
        }
        .info-box {
            background: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin-bottom: 24px;
        }
        .info-row {
            margin-bottom: 8px;
            font-size: 13px;
            color: #4a4a6a;
        }
        .info-row strong {
            color: #1a1a2e;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            color: white;
        }
        .status-validee { background: #10b981; }
        .status-rejetee { background: #ef4444; }
        .status-en_cours { background: #667eea; }
        .status-en_attente { background: #f59e0b; }
        .cta-btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
        }
        .email-footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>🏛️ AdminClick</h1>
            <p>Mise à jour de votre demande</p>
        </div>

        <div class="email-body">
            <p class="greeting">Bonjour {{ $user->name }},</p>

            <p class="message">
                Nous vous informons que votre demande <strong>#{{ $demande->id }}</strong> a été
                <span class="status-badge status-{{ $demande->status }}">{{ $statusLabel }}</span>.
            </p>

            <div class="info-box">
                <div class="info-row">
                    <strong>Référence :</strong> #{{ $demande->id }}
                </div>
                <div class="info-row">
                    <strong>Type :</strong> {{ $demande->type }}
                </div>
                <div class="info-row">
                    <strong>Statut :</strong> {{ $statusLabel }}
                </div>
                @if($demande->notes)
                <div class="info-row">
                    <strong>Note :</strong> {{ $demande->notes }}
                </div>
                @endif
            </div>

            <p style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/demandes/{{ $demande->id }}" class="cta-btn">
                    Voir ma demande →
                </a>
            </p>
        </div>

        <div class="email-footer">
            <p>Cet email a été envoyé automatiquement par AdminClick.</p>
            <p>© {{ date('Y') }} AdminClick — Tous droits réservés</p>
        </div>
    </div>
</body>
</html>

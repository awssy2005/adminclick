<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Demande #{{ $demande->id }} — AdminClick</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #1a1a2e;
            line-height: 1.6;
        }
        .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 12px;
            opacity: 0.9;
        }
        .badge {
            display: inline-block;
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 10px;
        }
        .badge-validee {
            background: #10b981;
            color: white;
        }
        .content {
            padding: 30px 40px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #667eea;
            border-bottom: 2px solid #667eea;
            padding-bottom: 5px;
            margin-bottom: 12px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 8px 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-table td:first-child {
            font-weight: bold;
            color: #6b7280;
            width: 40%;
        }
        .info-table td:last-child {
            color: #1a1a2e;
        }
        .documents-list {
            list-style: none;
        }
        .documents-list li {
            padding: 6px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .footer {
            background: #f9fafb;
            padding: 20px 40px;
            text-align: center;
            font-size: 10px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        .stamp {
            text-align: right;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px dashed #d1d5db;
            color: #6b7280;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ AdminClick</h1>
        <p>Plateforme officielle de démarches administratives</p>
        <div class="badge badge-validee">✓ DOCUMENT VALIDÉ</div>
    </div>

    <div class="content">
        <!-- Informations de la demande -->
        <div class="section">
            <h2 class="section-title">📋 Informations de la demande</h2>
            <table class="info-table">
                <tr>
                    <td>Référence</td>
                    <td>#{{ $demande->id }}</td>
                </tr>
                <tr>
                    <td>Type de document</td>
                    <td>{{ $typeLabel }}</td>
                </tr>
                <tr>
                    <td>Statut</td>
                    <td>✅ Validée</td>
                </tr>
                <tr>
                    <td>Date de soumission</td>
                    <td>{{ $demande->created_at->format('d/m/Y à H:i') }}</td>
                </tr>
                <tr>
                    <td>Date de validation</td>
                    <td>{{ $demande->updated_at->format('d/m/Y à H:i') }}</td>
                </tr>
            </table>
        </div>

        <!-- Informations du demandeur -->
        <div class="section">
            <h2 class="section-title">👤 Informations du demandeur</h2>
            <table class="info-table">
                <tr>
                    <td>Nom complet</td>
                    <td>{{ $user->name }}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{{ $user->email }}</td>
                </tr>
            </table>
        </div>

        @if($demande->description)
        <div class="section">
            <h2 class="section-title">📝 Description</h2>
            <p>{{ $demande->description }}</p>
        </div>
        @endif

        @if($demande->notes)
        <div class="section">
            <h2 class="section-title">📌 Notes administratives</h2>
            <p>{{ $demande->notes }}</p>
        </div>
        @endif

        @if($demande->documents && $demande->documents->count() > 0)
        <div class="section">
            <h2 class="section-title">📎 Documents joints</h2>
            <ul class="documents-list">
                @foreach($demande->documents as $doc)
                <li>📄 {{ $doc->name }} ({{ $doc->file_type }})</li>
                @endforeach
            </ul>
        </div>
        @endif

        @if($demande->payment)
        <div class="section">
            <h2 class="section-title">💳 Paiement</h2>
            <table class="info-table">
                <tr>
                    <td>Montant</td>
                    <td>{{ $demande->payment->amount }} MAD</td>
                </tr>
                <tr>
                    <td>Méthode</td>
                    <td>{{ ucfirst($demande->payment->method) }}</td>
                </tr>
                <tr>
                    <td>Référence</td>
                    <td>{{ $demande->payment->reference }}</td>
                </tr>
                <tr>
                    <td>Statut</td>
                    <td>{{ ucfirst($demande->payment->status) }}</td>
                </tr>
            </table>
        </div>
        @endif

        <div class="stamp">
            <p>Document généré le {{ $date }}</p>
            <p>AdminClick — Plateforme officielle</p>
        </div>
    </div>

    <div class="footer">
        <p>Ce document a été généré automatiquement par la plateforme AdminClick.</p>
        <p>Il ne constitue pas un document officiel sans le cachet de l'administration compétente.</p>
        <p>© {{ date('Y') }} AdminClick — Tous droits réservés</p>
    </div>
</body>
</html>

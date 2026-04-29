<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DemandeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $typeLabels = [
            'acte_naissance' => 'Acte de Naissance',
            'certificat_residence' => 'Certificat de Résidence',
            'carte_nationale' => 'Carte Nationale d\'Identité',
            'extrait_casier' => 'Extrait de Casier Judiciaire',
            'attestation_travail' => 'Attestation de Travail',
        ];

        $statusLabels = [
            'en_attente' => 'En attente',
            'en_cours' => 'En cours de traitement',
            'validee' => 'Validée',
            'rejetee' => 'Rejetée',
        ];

        return [
            'id'            => $this->id,
            'type'          => $this->type,
            'type_label'    => $typeLabels[$this->type] ?? $this->type,
            'description'   => $this->description,
            'status'        => $this->status,
            'status_label'  => $statusLabels[$this->status] ?? $this->status,
            'notes'         => $this->notes,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
            'user'          => new UserResource($this->whenLoaded('user')),
            'documents'     => DocumentResource::collection($this->whenLoaded('documents')),
            'payment'       => new PaymentResource($this->whenLoaded('payment')),
            'appointment'   => new AppointmentResource($this->whenLoaded('appointment')),
        ];
    }
}

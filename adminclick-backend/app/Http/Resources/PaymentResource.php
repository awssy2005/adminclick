<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'demande_id' => $this->demande_id,
            'amount'     => $this->amount,
            'method'     => $this->method,
            'status'     => $this->status,
            'reference'  => $this->reference,
            'created_at' => $this->created_at,
        ];
    }
}

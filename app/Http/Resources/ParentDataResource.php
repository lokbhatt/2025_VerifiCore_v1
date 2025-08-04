<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParentDataResource extends JsonResource
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
            'title'      => $this->title,
            'key'        => $this->key,
            'status'     => $this->status,
            'district_id' => $this->when($this->district_id ?? false, $this->district_id),
            'district'    => $this->whenLoaded('district', function () {
                return [
                    'id'    => $this->district->id,
                    'title' => $this->district->title,
                ];
            }),
            'municipality_id' => $this->when($this->municipality_id ?? false, $this->municipality_id),
            'municipality'    => $this->whenLoaded('municipality', function () {
                return [
                    'id'    => $this->municipality->id,
                    'title' => $this->municipality->title,
                ];
            }),
            'created_by' => $this->created_by,
            'createdBy'  => $this->createdBy ? [
                'id'     => $this->createdBy->id,
                'name'   => $this->createdBy->name,
            ] : null,
            'updated_by' => $this->updated_by,
            'updatedBy'  => $this->updatedBy ? [
                'id'     => $this->updatedBy->id,
                'name'   => $this->updatedBy->name,
            ] : null,
            'deleted_at' => $this->deleted_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'username'       => $this->username,
            'email'          => $this->email,
            'phone'          => $this->phone,
            'status'         => $this->status,
            'email_verified' => !is_null($this->email_verified_at),

            // Single user detail if loaded
            'user_detail' => $this->whenLoaded('userDetail', function () {
                return [
                    'id'      => $this->userDetail->id,
                    'image'   => $this->userDetail->image,
                    'address' => $this->userDetail->address,
                ];
            }),

            // Roles if loaded
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->map(function ($role) {
                    return [
                        'id'    => $role->id,
                        'name'  => $role->name,
                        'guard' => $role->guard_name,
                    ];
                });
            }),

            // System info
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

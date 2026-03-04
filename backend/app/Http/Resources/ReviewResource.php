<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'product_id' => $this->product_id,
            'author' => $this->author,
            'rating' => $this->rating,
            'comment' => $this->comment,
            'reply' => $this->reply,
            'approved' => $this->approved,
            'is_featured' => $this->is_featured,
            'user' => new UserResource($this->whenLoaded('user')),
            'product' => new \App\Http\Resources\ProductResource($this->whenLoaded('product')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

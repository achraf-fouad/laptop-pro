<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'originalPrice' => $this->original_price,
            'images' => $this->whenLoaded('productImages', function () {
                return $this->productImages->pluck('url');
            }, $this->images),
            'productImages' => $this->whenLoaded('productImages'),
            'brand' => $this->brand,
            'stock' => $this->stock,
            'stock_status' => $this->stock_status,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category'),
            'rating' => $this->rating,
            'reviewCount' => $this->review_count,
            'reviews' => \App\Http\Resources\ReviewResource::collection($this->whenLoaded('reviews')),
            'featured' => $this->featured,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'original_price',
        'category',
        'brand',
        'image',
        'image_2',
        'image_3',
        'stock_status',
        'rating',
        'review_count',
        'specs',
        'compatibility',
        'featured',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'specs' => 'array',
        'compatibility' => 'array',
        'featured' => 'boolean',
        'price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
    ];

    protected $appends = ['stock', 'reviewCount', 'originalPrice'];

    public function getStockAttribute()
    {
        return $this->attributes['stock_status'] ?? 'in_stock';
    }

    public function getReviewCountAttribute()
    {
        return $this->attributes['review_count'] ?? 0;
    }

    public function getOriginalPriceAttribute()
    {
        return $this->attributes['original_price'] ?? null;
    }
}

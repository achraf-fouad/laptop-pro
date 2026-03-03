<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'original_price',
        'images', // JSON array of image paths
        'category_id',
        'brand',
        'stock', // Integer
        'stock_status', // Enum
        'rating',
        'review_count',
        'specs',
        'compatibility',
        'featured',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
        'images' => 'array',
        'specs' => 'array',
        'compatibility' => 'array',
        'featured' => 'boolean',
        'price' => 'float',
        'original_price' => 'float',
        'rating' => 'float',
        'stock' => 'integer',
    ];

    protected $appends = ['reviewCount', 'originalPrice'];

    public function getReviewCountAttribute()
    {
        return $this->attributes['review_count'] ?? 0;
    }

    public function getOriginalPriceAttribute()
    {
        return $this->attributes['original_price'] ?? null;
    }
}

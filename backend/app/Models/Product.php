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

    public function getImagesAttribute($value)
    {
        $images = is_string($value) ? json_decode($value, true) : $value;
        $images = $images ?: [];
        
        $baseUrl = config('app.url');
        // If we are in local and using artisan serve, we might be on port 8000
        if (app()->isLocal() && !str_contains($baseUrl, ':8000')) {
            $baseUrl = 'http://localhost:8000';
        }

        return array_map(function($image) use ($baseUrl) {
            if (!$image) return '';
            if (str_starts_with($image, 'http')) {
                return $image;
            }
            return rtrim($baseUrl, '/') . '/' . ltrim($image, '/');
        }, $images);
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

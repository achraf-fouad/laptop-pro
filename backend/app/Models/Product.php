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
        'stock', // Match migration
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
        $baseUrl = config('app.url');
        
        // Ensure $images is an array
        $images = is_string($value) ? json_decode($value, true) : $value;
        if (!is_array($images)) $images = [];

        return array_map(function($image) use ($baseUrl) {
            if (!$image) return '';
            
            // Comprehensive cleanup: Strip ANY http/https and domain/port info to get pure relative path
            // This handles cases like: http://localhost:8000/storage/..., https://maroclaptop.com/storage/..., etc.
            $path = $image;
            if (str_starts_with($path, 'http')) {
                // Deconstruct URL to get path only
                $parsed = parse_url($path);
                $path = $parsed['path'] ?? $path;
            }

            // More robust path joining
            $path = ltrim($path, '/');
            
            // Common Laravel path normalization
            if (!str_starts_with($path, 'storage/') && !str_starts_with($path, 'public/')) {
                // If it doesn't start with storage/, maybe it's just 'products/xxx.jpg'
                // But check if it was 'storage/products/xxx.jpg' previously
                $path = 'storage/' . $path;
            }

            return rtrim($baseUrl, '/') . '/' . $path;
        }, $images);
    }


    public function getReviewCountAttribute()
    {
        // Safe access to attributes array to avoid recursion and 500 errors if column is missing from query
        return $this->attributes['review_count'] ?? 0;
    }

    public function getOriginalPriceAttribute()
    {
        return $this->attributes['original_price'] ?? null;
    }
}

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
        'stock_quantity', // Changed from 'stock' to match migration
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
        'stock_quantity' => 'integer',
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
            
            // Clean up any old localhost links that might be in the database
            if (str_contains($image, 'localhost:8000')) {
                $image = str_replace(['http://localhost:8000/', 'http://localhost:8000'], '', $image);
            }

            if (str_starts_with($image, 'http')) {
                return $image;
            }

            // More robust path joining for cPanel
            $path = ltrim($image, '/');
            
            // If the path doesn't start with 'storage/', and we are in production, 
            // maybe it was saved without it. But usually Laravel saves as 'products/xxx.jpg'
            // and we expect it to be served via 'storage/products/xxx.jpg'
            if (!str_starts_with($path, 'storage/') && !str_starts_with($path, 'public/')) {
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

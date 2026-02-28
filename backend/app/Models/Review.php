<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'product_id',
        'author',
        'rating',
        'comment',
        'status',
        'is_featured'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'rating' => 'integer'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

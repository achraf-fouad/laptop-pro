<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'author',
        'rating',
        'comment',
        'approved',
        'is_featured',
        'reply'
    ];

    protected $casts = [
        'approved' => 'boolean',
        'is_featured' => 'boolean',
        'rating' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

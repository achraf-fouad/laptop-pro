<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|array',
            'description' => 'nullable|array',
            'price' => 'nullable|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'stock' => 'nullable|integer|min:0',
            'stock_status' => 'nullable|string|in:in_stock,low_stock,out_of_stock',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'existing_images' => 'nullable|array',
            'specs' => 'nullable|array',
            'compatibility' => 'nullable|array',
            'featured' => 'nullable|boolean',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization logic can be added here (e.g., check if user is admin)
    }

    public function rules(): array
    {
        return [
            'name' => 'required|array',
            'description' => 'required|array',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'brand' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'stock_status' => 'required|string|in:in_stock,low_stock,out_of_stock',
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'specs' => 'nullable|array',
            'compatibility' => 'nullable|array',
            'featured' => 'nullable|boolean',
        ];
    }
}

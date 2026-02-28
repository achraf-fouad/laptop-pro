<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|array',
            'description' => 'required|array',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'stock_status' => 'required|string',
        ]);

        $data = $request->except(['image', 'image_2', 'image_3']);
        
        $imageFields = ['image', 'image_2', 'image_3'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('products', 'public');
                $data[$field] = url('storage/' . $path);
            } elseif ($request->$field && is_string($request->$field)) {
                $data[$field] = $request->$field;
            }
        }

        return Product::create($data);
    }

    public function show($id)
    {
        return Product::with(['reviews' => function ($query) {
            $query->where('status', 'approved')->latest();
        }])->findOrFail($id);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->except(['image', 'image_2', 'image_3']);
        
        $imageFields = ['image', 'image_2', 'image_3'];
        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('products', 'public');
                $data[$field] = url('storage/' . $path);
            } elseif ($request->$field && is_string($request->$field)) {
                $data[$field] = $request->$field;
            } elseif ($request->has($field) && empty($request->$field)) {
                $data[$field] = null; // Handle deletion of image
            }
        }

        $product->update($data);
        return clone $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}

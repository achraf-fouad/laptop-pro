<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return Product::with('category')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|array',
            'description' => 'required|array',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'category_id' => 'required|integer|exists:categories,id',
            'brand' => 'required|string',
            'stock' => 'required|integer',
            'stock_status' => 'required|string|in:in_stock,low_stock,out_of_stock',
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048', // 2MB max
            'specs' => 'nullable|array',
            'compatibility' => 'nullable|array',
            'featured' => 'nullable|boolean',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $imagePaths[] = url('storage/' . $path);
            }
        }

        $validated['images'] = $imagePaths;

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        return Product::with([
            'category',
            'reviews' => function ($query) {
                $query->where('status', 'approved')->latest();
            }
        ])->findOrFail($id);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'nullable|array',
            'description' => 'nullable|array',
            'price' => 'nullable|numeric',
            'original_price' => 'nullable|numeric',
            'category_id' => 'nullable|integer|exists:categories,id',
            'brand' => 'nullable|string',
            'stock' => 'nullable|integer',
            'stock_status' => 'nullable|string|in:in_stock,low_stock,out_of_stock',
            'images' => 'nullable|array|max:10',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'existing_images' => 'nullable|array',
            'specs' => 'nullable|array',
            'compatibility' => 'nullable|array',
            'featured' => 'nullable|boolean',
        ]);

        $imagePaths = $request->input('existing_images', []);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if (count($imagePaths) >= 10)
                    break;
                $filename = uniqid() . '_' . time() . '.' . $image->getClientOriginalExtension();
                $path = $image->storeAs('products', $filename, 'public');
                $imagePaths[] = url('storage/' . $path);
            }
        }

        $validated['images'] = $imagePaths;

        $product->update($validated);
        return $product->load('category');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}

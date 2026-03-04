<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $products = \Illuminate\Support\Facades\Cache::remember('products_index', 3600, function () {
            return Product::with(['category', 'productImages'])->latest()->get();
        });

        return \App\Http\Resources\ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($request, $validated) {
            $product = Product::create($validated);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('products', 'public');
                    $product->productImages()->create([
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            return $this->success(new \App\Http\Resources\ProductResource($product->load('productImages')), 'Produit créé avec succès', 201);
        });
    }

    public function show($id)
    {
        $product = \Illuminate\Support\Facades\Cache::remember("product_show_{$id}", 3600, function () use ($id) {
            return Product::with([
                'category',
                'productImages',
                'reviews' => function ($query) {
                    $query->where('approved', true)->latest();
                },
                'reviews.user'
            ])->find($id);
        });

        if (!$product) {
            return $this->error('Produit non trouvé.', 404);
        }

        return new \App\Http\Resources\ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($request, $validated, $product) {
            $product->update($validated);

            if ($request->hasFile('images')) {
                // Determine starting sort order if keeping existing images
                $existingCount = $product->productImages()->count();

                foreach ($request->file('images') as $index => $image) {
                    if ($existingCount + $index >= 10)
                        break;

                    $path = $image->store('products', 'public');
                    $product->productImages()->create([
                        'path' => $path,
                        'sort_order' => $existingCount + $index,
                    ]);
                }
            }

            return $this->success(new \App\Http\Resources\ProductResource($product->load(['category', 'productImages'])), 'Produit mis à jour');
        });
    }

    public function destroy(Product $product)
    {
        return DB::transaction(function () use ($product) {
            // Delete physical images
            foreach ($product->productImages as $image) {
                Storage::disk('public')->delete($image->path);
            }
            $product->delete();
            return $this->success(null, 'Produit supprimé');
        });
    }
}


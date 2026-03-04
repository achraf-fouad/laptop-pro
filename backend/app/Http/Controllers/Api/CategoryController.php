<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of root categories with their children.
     */
    public function index(Request $request)
    {
        if ($request->has('flat')) {
            $categories = Category::where('is_active', true)->orderBy('order')->get();
            return \App\Http\Resources\CategoryResource::collection($categories);
        }

        $categories = Category::with([
            'children' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            }
        ])
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return \App\Http\Resources\CategoryResource::collection($categories);
    }

    /**
     * Display the specified category with its products.
     */
    public function show($id)
    {
        $category = Category::with(['children', 'products'])->findOrFail($id);
        return new \App\Http\Resources\CategoryResource($category);
    }
}

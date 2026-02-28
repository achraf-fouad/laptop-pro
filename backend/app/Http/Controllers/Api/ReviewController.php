<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, $productId)
    {
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = \App\Models\Review::create([
            'product_id' => $productId,
            'author' => $validated['author'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => 'pending', // Default to pending so admin must approve
        ]);

        return response()->json([
            'message' => 'Review submitted successfully and is pending approval.',
            'review' => $review
        ], 201);
    }

    // Public method for home page
    public function featured()
    {
        $reviews = \App\Models\Review::with('product:id,name,image')->where('status', 'approved')
            ->where('is_featured', true)
            ->latest()
            ->get();
            
        return response()->json($reviews);
    }

    // Admin API
    public function pending()
    {
        $reviews = \App\Models\Review::with('product:id,name,image')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($reviews);
    }

    public function approve(\App\Models\Review $review)
    {
        $review->update(['status' => 'approved']);
        $this->updateProductRating($review->product_id);
        
        return response()->json(['message' => 'Review approved successfully', 'review' => $review]);
    }

    public function decline(\App\Models\Review $review)
    {
        $review->update(['status' => 'declined']);
        $this->updateProductRating($review->product_id);
        
        return response()->json(['message' => 'Review declined successfully', 'review' => $review]);
    }

    public function toggleFeatured(\App\Models\Review $review)
    {
        $review->update(['is_featured' => !$review->is_featured]);
        return response()->json(['message' => 'Review featured status updated', 'review' => $review]);
    }

    public function destroy(\App\Models\Review $review)
    {
        $productId = $review->product_id;
        $review->delete();
        $this->updateProductRating($productId);
        
        return response()->json(['message' => 'Review deleted successfully']);
    }

    private function updateProductRating($productId)
    {
        if (!$productId) return;
        
        $product = \App\Models\Product::find($productId);
        if ($product) {
            $approvedReviews = \App\Models\Review::where('product_id', $productId)
                ->where('status', 'approved');
                
            $count = $approvedReviews->count();
            $avg = $count > 0 ? $approvedReviews->avg('rating') : 0;
            
            $product->update([
                'rating' => round($avg, 1),
                'review_count' => $count
            ]);
        }
    }
}

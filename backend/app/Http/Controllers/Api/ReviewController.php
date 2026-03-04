<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of reviews.
     */
    public function index(Request $request)
    {
        $query = Review::with(['product', 'user']);

        if ($request->has('approved')) {
            $query->where('approved', $request->boolean('approved'));
        }

        $reviews = $query->latest()->paginate(10);

        return \App\Http\Resources\ReviewResource::collection($reviews);
    }

    /**
     * Store a newly created review.
     */
    public function store(Request $request, $productId)
    {
        $validated = $request->validate([
            'author' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::create([
            'product_id' => $productId,
            'user_id' => auth()->id(),
            'author' => $validated['author'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'approved' => false,
        ]);

        return $this->success(
            new \App\Http\Resources\ReviewResource($review),
            'Avis soumis avec succès et en attente d\'approbation.',
            201
        );
    }

    /**
     * Admin method to approve/reject review.
     */
    public function approve(Review $review)
    {
        $review->update(['approved' => !$review->approved]);
        $this->updateProductRating($review->product_id);

        $status = $review->approved ? 'approuvé' : 'désapprouvé';
        return $this->success(new \App\Http\Resources\ReviewResource($review), "Avis {$status} avec succès");
    }

    /**
     * Admin method to reply to a review.
     */
    public function reply(Request $request, Review $review)
    {
        $validated = $request->validate([
            'reply' => 'required|string|max:1000',
        ]);

        $review->update(['reply' => $validated['reply']]);

        return $this->success(new \App\Http\Resources\ReviewResource($review), 'Réponse ajoutée avec succès');
    }

    /**
     * Toggle review featured status.
     */
    public function toggleFeatured(Review $review)
    {
        $review->update(['is_featured' => !$review->is_featured]);
        return $this->success(new \App\Http\Resources\ReviewResource($review), 'Statut "Mis en avant" mis à jour');
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review)
    {
        $productId = $review->product_id;
        $review->delete();
        $this->updateProductRating($productId);

        return $this->success(null, 'Avis supprimé avec succès');
    }

    /**
     * Update product average rating and count.
     */
    private function updateProductRating($productId)
    {
        if (!$productId)
            return;

        $product = Product::find($productId);
        if ($product) {
            $approvedReviews = Review::where('product_id', $productId)
                ->where('approved', true);

            $count = $approvedReviews->count();
            $avg = $count > 0 ? $approvedReviews->avg('rating') : 0;

            $product->update([
                'rating' => round($avg, 1),
                'review_count' => $count
            ]);
        }
    }
}


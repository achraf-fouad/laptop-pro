<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Http\Requests\StoreOrderRequest;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with(['orderItems.product', 'user']);

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by client name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($qu) use ($search) {
                        $qu->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $orders = $query->latest()->paginate(10);

        return \App\Http\Resources\OrderResource::collection($orders);
    }

    /**
     * Store a newly created order.
     */
    public function store(StoreOrderRequest $request, \App\Services\Payment\PaymentService $paymentService)
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $paymentService) {
            // 1. Check stock and lock for update
            foreach ($validated['items'] as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

                if (!$product || $product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuffisant pour le produit: " . ($product->name['fr'] ?? $product->id));
                }
            }

            // 2. Create Order
            $order = Order::create($validated);

            // 3. Create Items and Decrement Stock
            foreach ($validated['items'] as $item) {
                $order->orderItems()->create($item);

                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);

                // Update stock status if zero
                if ($product->stock <= 0) {
                    $product->update(['stock_status' => 'out_of_stock']);
                } elseif ($product->stock <= 5) {
                    $product->update(['stock_status' => 'low_stock']);
                }
            }

            // 4. Process Payment (unless COD)
            $paymentDetails = [];
            if (isset($validated['payment_method']) && strtolower($validated['payment_method']) !== 'cod') {
                $paymentDetails = $paymentService->setGateway($validated['payment_method'])->process($order);
            }

            // 5. Dispatch Event for Emails/Tracking
            event(new \App\Events\OrderPlaced($order));

            return $this->success([
                'order' => new \App\Http\Resources\OrderResource($order->load('orderItems.product')),
                'payment' => $paymentDetails
            ], 'Commande passée avec succès', 201);
        });
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        return new \App\Http\Resources\OrderResource($order->load(['orderItems.product', 'user']));
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,paid,shipped,delivered,cancelled'
        ]);

        $order->update(['status' => $validated['status']]);

        return $this->success(new \App\Http\Resources\OrderResource($order), 'Statut de la commande mis à jour');
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return $this->success(null, 'Commande supprimée');
    }

    // Legacy methods - kept for backward compatibility if routes aren't updated yet
    public function confirm(Order $order)
    {
        $order->update(['status' => 'paid']);
        return $this->success(new \App\Http\Resources\OrderResource($order), 'Commande confirmée');
    }

    public function decline(Order $order)
    {
        $order->update(['status' => 'cancelled']);
        return $this->success(new \App\Http\Resources\OrderResource($order), 'Commande déclinée');
    }
}


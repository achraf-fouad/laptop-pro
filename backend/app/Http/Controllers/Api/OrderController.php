<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with('orderItems.product')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:255',
            'shipping_address' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total_amount' => 'required|numeric',
        ]);

        $order = Order::create([
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'notes' => $validated['notes'] ?? null,
            'total_amount' => $validated['total_amount'],
        ]);

        foreach ($validated['items'] as $item) {
            $order->orderItems()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price']
            ]);
        }

        // Send Email to Admin
        try {
            \Illuminate\Support\Facades\Mail::to('admin@MarocLaptop.com')
                ->send(new \App\Mail\OrderNotification($order->fresh('orderItems.product')));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send order notification: ' . $e->getMessage());
        }

        // Send WhatsApp Notification to Admin via API
        try {
            $adminPhone = '+212644459980';
            // Default configured for UltraMSG, replace with any other WhatsApp API if needed
            $apiUrl = env('WHATSAPP_API_URL', 'https://api.ultramsg.com/YOUR_INSTANCE_ID/messages/chat');
            $token = env('WHATSAPP_API_TOKEN', 'YOUR_TOKEN');

            if ($token !== 'YOUR_TOKEN') {
                $orderFresh = $order->fresh('orderItems.product');
                
                $waMessage = "*Nouvelle Commande (MarocLaptop)*\n\n";
                $waMessage .= "*Client:* " . $orderFresh->customer_name . "\n";
                $waMessage .= "*Téléphone:* " . $orderFresh->customer_phone . "\n";
                $waMessage .= "*Adresse:* " . $orderFresh->shipping_address . "\n\n";

                $waMessage .= "*Produits:*\n";
                foreach ($orderFresh->orderItems as $item) {
                     $productName = $item->product ? (is_array($item->product->name) ? ($item->product->name['fr'] ?? 'Produit') : (json_decode($item->product->name, true)['fr'] ?? $item->product->name)) : 'Produit';
                     $waMessage .= "{$item->quantity}x {$productName} - {$item->price} MAD\n";
                }

                $waMessage .= "\n*Total:* " . $orderFresh->total_amount . " MAD\n";

                \Illuminate\Support\Facades\Http::post($apiUrl, [
                    'token' => $token,
                    'to' => $adminPhone,
                    'body' => $waMessage,
                ]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Failed to send WhatsApp API notification: ' . $e->getMessage());
        }

        return $order->load('orderItems');
    }

    public function show(Order $order)
    {
        return $order->load('orderItems.product');
    }

    public function confirm(Order $order)
    {
        $order->update(['status' => 'confirmed']);
        return $order;
    }

    public function decline(Order $order)
    {
        $order->update(['status' => 'declined']);
        return $order;
    }
}

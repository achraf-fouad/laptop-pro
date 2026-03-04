<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class NotifyAbandonedCarts implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $abandonedCarts = \App\Models\Cart::with(['user', 'items.product'])
            ->where('status', 'active')
            ->where('last_activity_at', '<', now()->subHours(24))
            ->whereNotNull('user_id') // Only for registered users
            ->get();

        /** @var \App\Models\Cart $cart */
        foreach ($abandonedCarts as $cart) {
            // Mock notification logic
            // Notification::send($cart->user, new AbandonedCartNotification($cart));

            $cart->status = 'abandoned';
            $cart->save();

            \Illuminate\Support\Facades\Log::info('Notification de panier abandonné envoyée à: ' . $cart->user?->email);
        }
    }
}

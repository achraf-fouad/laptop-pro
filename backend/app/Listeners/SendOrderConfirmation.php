<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderConfirmation
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(\App\Events\OrderPlaced $event): void
    {
        // Mock sending email
        // Mail::to($event->order->customer_email)->send(new OrderConfirmation($event->order));
        \Illuminate\Support\Facades\Log::info('Email de confirmation envoyé pour la commande: ' . $event->order->id);
    }
}

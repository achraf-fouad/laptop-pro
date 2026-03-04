<?php

namespace App\Services\Payment;

use App\Models\Order;

interface PaymentGatewayInterface
{
    /**
     * Initialize payment and return payment details (e.g., client secret, redirect URL).
     */
    public function initiatePayment(Order $order): array;

    /**
     * Handle webhook or callback from the gateway.
     */
    public function handleCallback(array $payload): bool;
}

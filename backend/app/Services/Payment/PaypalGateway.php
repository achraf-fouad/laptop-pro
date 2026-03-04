<?php

namespace App\Services\Payment;

use App\Models\Order;

class PaypalGateway implements PaymentGatewayInterface
{
    public function initiatePayment(Order $order): array
    {
        // Mock PayPal implementation
        return [
            'method' => 'paypal',
            'order_id' => 'PAYID-' . strtoupper(bin2hex(random_bytes(8))),
            'approval_url' => 'https://www.sandbox.paypal.com/checkoutnow?token=EC-MOCK',
        ];
    }

    public function handleCallback(array $payload): bool
    {
        // Handle PayPal IPN/Webhook
        return true;
    }
}

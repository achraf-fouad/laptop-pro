<?php

namespace App\Services\Payment;

use App\Models\Order;

class CmiGateway implements PaymentGatewayInterface
{
    public function initiatePayment(Order $order): array
    {
        // Mock CMI (Maroc Telecommerce) implementation
        return [
            'method' => 'cmi',
            'form_url' => 'https://payment.cmi.co.ma/cgi-bin/payment.cgi',
            'params' => [
                'amount' => $order->total_amount,
                'email' => $order->customer_email,
                'oid' => $order->id,
                // + other CMI specific fields
            ]
        ];
    }

    public function handleCallback(array $payload): bool
    {
        // Handle CMI Callback
        return true;
    }
}

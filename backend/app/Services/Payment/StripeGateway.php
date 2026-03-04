<?php

namespace App\Services\Payment;

use App\Models\Order;

class StripeGateway implements PaymentGatewayInterface
{
    public function initiatePayment(Order $order): array
    {
        // Mock Stripe implementation
        // In reality, this would use the Stripe PHP SDK to create a PaymentIntent
        return [
            'method' => 'stripe',
            'client_secret' => 'pi_mock_' . bin2hex(random_bytes(16)),
            'publishable_key' => config('services.stripe.key'),
        ];
    }

    public function handleCallback(array $payload): bool
    {
        // Handle Stripe Webhook
        return true;
    }
}

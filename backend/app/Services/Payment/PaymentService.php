<?php

namespace App\Services\Payment;

use App\Models\Order;
use Exception;

class PaymentService
{
    /**
     * @var PaymentGatewayInterface
     */
    protected $gateway;

    public function setGateway(string $method): self
    {
        switch ($method) {
            case 'stripe':
                $this->gateway = new StripeGateway();
                break;
            case 'paypal':
                $this->gateway = new PaypalGateway();
                break;
            case 'cmi':
                $this->gateway = new CmiGateway();
                break;
            default:
                throw new Exception("Méthode de paiement non supportée: {$method}");
        }

        return $this;
    }

    public function process(Order $order): array
    {
        if (!$this->gateway) {
            throw new Exception("Aucune passerelle de paiement sélectionnée.");
        }

        return $this->gateway->initiatePayment($order);
    }
}

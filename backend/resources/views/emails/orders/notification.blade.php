<x-mail::message>
# Nouvelle Commande Reçue !

Une nouvelle commande a été passée sur **Computer Access**.

**Détails de la commande :**
- **Commande ID :** #{{ $order->id }}
- **Client :** {{ $order->customer_name }}
- **Téléphone :** {{ $order->customer_phone }}
- **Email :** {{ $order->customer_email ?? 'N/A' }}
- **Adresse :** {{ $order->shipping_address }}
- **Total :** {{ number_format($order->total_amount, 2) }} DH

**Articles :**
@foreach($order->orderItems as $item)
- {{ $item->quantity }}x {{ $item->product->name['fr'] ?? $item->product->name['en'] ?? 'Produit' }} ({{ number_format($item->price, 2) }} DH)
@endforeach

@if($order->notes)
**Notes :**
{{ $order->notes }}
@endif

<x-mail::button :url="config('app.url') . '/admin/orders/' . $order->id">
Voir la commande
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>

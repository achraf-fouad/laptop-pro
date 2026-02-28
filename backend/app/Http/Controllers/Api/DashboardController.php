<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_sales' => (float) Order::where('status', 'confirmed')->sum('total_amount'),
            'orders_count' => Order::count(),
            'products_count' => Product::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
        ]);
    }

    public function salesGraph()
    {
        $sales = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('CAST(SUM(total_amount) AS DECIMAL(10,2)) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Convert total to float for Recharts
        $sales->transform(function ($item) {
            $item->total = (float) $item->total;
            return $item;
        });

        return response()->json($sales);
    }

    public function customers()
    {
        $customers = Order::select(
                'customer_name as name',
                'customer_email as email',
                'customer_phone as phone',
                'shipping_address',
                DB::raw('COUNT(*) as orders_count'),
                DB::raw('SUM(total_amount) as total_spent'),
                DB::raw('MAX(created_at) as last_order_date')
            )
            ->groupBy('customer_email', 'customer_phone', 'customer_name', 'shipping_address')
            ->get()
            ->map(function ($c) {
                // Try to extract city from "City, Address"
                $parts = explode(',', $c->shipping_address);
                return [
                    'id' => $c->phone . '_' . $c->email,
                    'name' => $c->name,
                    'email' => $c->email,
                    'phone' => $c->phone,
                    'city' => trim($parts[0] ?? 'Unknown'),
                    'orders' => $c->orders_count,
                    'totalSpent' => (float) $c->total_spent,
                    'lastOrder' => date('Y-m-d', strtotime($c->last_order_date))
                ];
            });

        return response()->json($customers);
    }
}

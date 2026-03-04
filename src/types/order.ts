import { Product } from './product';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number | null;
    status: OrderStatus;
    total_amount: number;
    payment_method: string | null;
    customer_name: string;
    customer_email: string | null;
    customer_phone: string;
    shipping_address: string;
    notes: string | null;
    user?: User;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    orders_count?: number;
    total_spent?: number;
    created_at: string;
    updated_at: string;
}

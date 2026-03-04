import { Product } from './product';
import { User } from './order';

export interface Review {
    id: number;
    user_id: number | null;
    product_id: number;
    author: string;
    rating: number;
    comment: string;
    approved: boolean;
    is_featured: boolean;
    user?: User;
    product?: Product;
    created_at: string;
    updated_at: string;
}

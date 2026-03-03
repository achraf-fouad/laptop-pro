export interface Category {
  id: number;
  name: Record<string, string>;
  slug: string;
  parent_id: number | null;
  children?: Category[];
}

export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: number;
  originalPrice?: number;
  category_id?: number;
  category?: Category;
  brand: string;
  images: string[];
  stock: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  rating: number;
  reviewCount: number;
  specs?: Record<string, string>;
  compatibility?: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

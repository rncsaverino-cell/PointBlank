export type UserRole = "retailer" | "admin";
export type RetailerStatus = "pending" | "approved" | "rejected" | "suspended";
export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus = "draft" | "submitted" | "processing" | "shipped" | "delivered";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  retailer_status: RetailerStatus;
  business_name: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  phone: string | null;
  business_type: string | null;
  resale_number: string | null;
  pricing_tier: string | null;
  created_at: string;
}

export interface RetailerApplication {
  id: string;
  profile_id: string | null;
  business_name: string;
  contact_first_name: string;
  contact_last_name: string;
  business_email: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  business_type: string | null;
  resale_number: string | null;
  business_registration_number: string | null;
  estimated_monthly_volume: string | null;
  notes: string | null;
  status: RetailerStatus;
  created_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  subtitle: string | null;
  hero_image: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  collection_id: string | null;
  collection?: Collection | null;
  wholesale_price: number;
  msrp: number;
  moq: number;
  pack_quantity: number;
  dimensions: string | null;
  paper_spec: string | null;
  inventory: number;
  status: ProductStatus;
  image_url: string | null;
  gallery: string[];
  is_new: boolean;
  is_bestseller: boolean;
  is_limited: boolean;
  is_range_favorite: boolean;
  created_at: string;
}

// No pricing/inventory — safe to show to unauthenticated visitors.
// Backed by the `public_products_preview` view (see supabase/schema.sql).
export interface PublicProduct {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  collection_id: string | null;
  collection: { name: string; slug: string } | null;
  is_new: boolean;
  is_bestseller: boolean;
  is_limited: boolean;
  is_range_favorite: boolean;
}

export interface Order {
  id: string;
  retailer_id: string;
  order_number: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  tracking_number: string | null;
  created_at: string;
  items?: OrderItem[];
  retailer?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

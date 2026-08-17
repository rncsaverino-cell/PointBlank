import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/is-configured";
import { getDemoStore } from "./demo-store";
import type { Collection, Order, Product, Profile, PublicProduct, RetailerApplication } from "./types";

export interface ProductFilters {
  collection?: string;
  sort?: "newest" | "bestselling" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  search?: string;
}

export async function getCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoStore().collections]
      .filter((c) => c.active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  return (data as Collection[]) ?? [];
}

// For unauthenticated/public marketing pages only (homepage, /targets).
// Reads from the `public_products_preview` view, which has no pricing or
// inventory columns — RLS on the `products` table itself only allows
// approved retailers/admins to read it, by design.
export async function getPublicProducts(): Promise<PublicProduct[]> {
  if (!isSupabaseConfigured()) {
    return getDemoStore()
      .products.filter((p) => p.status === "active" && p.collection?.active)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image_url: p.image_url,
        collection_id: p.collection_id,
        collection: p.collection ? { name: p.collection.name, slug: p.collection.slug } : null,
        is_new: p.is_new,
        is_bestseller: p.is_bestseller,
        is_limited: p.is_limited,
        is_range_favorite: p.is_range_favorite,
      }));
  }
  const supabase = createClient()!;
  const { data } = await supabase.from("public_products_preview").select("*");
  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    image_url: row.image_url,
    collection_id: row.collection_id,
    collection: row.collection_name ? { name: row.collection_name, slug: row.collection_slug } : null,
    is_new: row.is_new,
    is_bestseller: row.is_bestseller,
    is_limited: row.is_limited,
    is_range_favorite: row.is_range_favorite,
  }));
}

export async function getAllCollectionsAdmin(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoStore().collections].sort((a, b) => a.sort_order - b.sort_order);
  }
  const supabase = createClient()!;
  const { data } = await supabase.from("collections").select("*").order("sort_order", { ascending: true });
  return (data as Collection[]) ?? [];
}

export async function getCollection(slug: string): Promise<Collection | null> {
  if (!isSupabaseConfigured()) {
    return getDemoStore().collections.find((c) => c.slug === slug) ?? null;
  }
  const supabase = createClient()!;
  const { data } = await supabase.from("collections").select("*").eq("slug", slug).single();
  return (data as Collection) ?? null;
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let products: Product[];

  if (!isSupabaseConfigured()) {
    products = [...getDemoStore().products].filter((p) => p.status === "active");
  } else {
    const supabase = createClient()!;
    const { data } = await supabase
      .from("products")
      .select("*, collection:collections(*)")
      .eq("status", "active");
    products = (data as Product[]) ?? [];
  }

  if (filters.collection) {
    products = products.filter((p) => p.collection?.slug === filters.collection);
  }
  if (filters.minPrice != null) {
    products = products.filter((p) => p.wholesale_price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    products = products.filter((p) => p.wholesale_price <= filters.maxPrice!);
  }
  if (filters.inStockOnly) {
    products = products.filter((p) => p.inventory > 0);
  }
  if (filters.isNew) {
    products = products.filter((p) => p.is_new);
  }
  if (filters.isBestseller) {
    products = products.filter((p) => p.is_bestseller);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.collection?.name.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "bestselling":
      products.sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
      break;
    case "price-asc":
      products.sort((a, b) => a.wholesale_price - b.wholesale_price);
      break;
    case "price-desc":
      products.sort((a, b) => b.wholesale_price - a.wholesale_price);
      break;
    case "newest":
    default:
      products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return products;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoStore().products].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("products")
    .select("*, collection:collections(*)")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return getDemoStore().products.find((p) => p.slug === slug) ?? null;
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("products")
    .select("*, collection:collections(*)")
    .eq("slug", slug)
    .single();
  return (data as Product) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts({ collection: product.collection?.slug });
  return all.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getOrders(retailerId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return [...getDemoStore().orders]
      .filter((o) => o.retailer_id === retailerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(*))")
    .eq("retailer_id", retailerId)
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    const order = store.orders.find((o) => o.id === id);
    if (!order) return null;
    return { ...order, retailer: store.retailers.find((r) => r.id === order.retailer_id) };
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(*)), retailer:profiles(*)")
    .eq("id", id)
    .single();
  return (data as Order) ?? null;
}

export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    const store = getDemoStore();
    return [...store.orders]
      .map((o) => ({ ...o, retailer: store.retailers.find((r) => r.id === o.retailer_id) }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(*)), retailer:profiles(*)")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getRetailers(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) {
    return getDemoStore().retailers;
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "retailer")
    .order("created_at", { ascending: false });
  return (data as Profile[]) ?? [];
}

export async function getRetailerApplications(): Promise<RetailerApplication[]> {
  if (!isSupabaseConfigured()) {
    return getDemoStore().applications;
  }
  const supabase = createClient()!;
  const { data } = await supabase
    .from("retailer_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as RetailerApplication[]) ?? [];
}

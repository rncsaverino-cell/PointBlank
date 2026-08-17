import { mockCollections, mockLeads, mockOrders, mockProducts, mockRetailers } from "./mock-data";
import type { Collection, Lead, Order, Product, Profile, RetailerApplication } from "./types";

// In-memory mutable copy of the demo dataset used only when Supabase isn't
// configured. This lets the admin portal (approve retailer, edit product,
// update order status, etc.) feel real during local exploration without a
// database — changes persist for the life of the dev server process, then
// reset on restart. Once Supabase is configured, none of this is used;
// lib/data.ts talks to the real database instead.

declare global {
  // eslint-disable-next-line no-var
  var __pointblankDemoStore:
    | {
        products: Product[];
        collections: Collection[];
        retailers: Profile[];
        orders: Order[];
        applications: RetailerApplication[];
        leads: Lead[];
      }
    | undefined;
}

function buildApplications(): RetailerApplication[] {
  return mockRetailers.map((r, i) => ({
    id: `app-${i}`,
    profile_id: r.id,
    business_name: r.business_name ?? "",
    contact_first_name: r.contact_first_name ?? "",
    contact_last_name: r.contact_last_name ?? "",
    business_email: r.email,
    phone: r.phone,
    website: null,
    address: null,
    city: null,
    state: null,
    postal_code: null,
    country: null,
    business_type: r.business_type,
    resale_number: r.resale_number,
    business_registration_number: null,
    estimated_monthly_volume: null,
    notes: null,
    status: r.retailer_status,
    created_at: r.created_at,
  }));
}

function init() {
  return {
    products: structuredClone(mockProducts),
    collections: structuredClone(mockCollections),
    retailers: structuredClone(mockRetailers),
    orders: structuredClone(mockOrders),
    applications: buildApplications(),
    leads: structuredClone(mockLeads),
  };
}

export function getDemoStore() {
  if (!global.__pointblankDemoStore) {
    global.__pointblankDemoStore = init();
  }
  return global.__pointblankDemoStore;
}

import { supabase, isSupabaseConfigured } from "./supabase";
import { mockProducts, type Product } from "./mock-products";

export type { Product };

// Shape of a row coming back from Postgres (snake_case columns).
type ProductRow = {
  id: string;
  name: string;
  category: Product["category"];
  price: number;
  image: string;
  description: string;
  occasions: string[];
  recipients: string[];
  cities: string[];
  same_day_available: boolean;
};

function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    price: r.price,
    image: r.image,
    description: r.description,
    occasions: r.occasions ?? [],
    recipients: r.recipients ?? [],
    cities: r.cities ?? [],
    sameDayAvailable: r.same_day_available,
  };
}

export type SearchFilters = {
  occasion?: string;
  recipient?: string;
  location?: string;
  maxBudget?: number;
  category?: string;
};

// ── Local fallback (used when Supabase isn't configured) ─────────────────────
function searchMock(f: SearchFilters): Product[] {
  let results = mockProducts;
  const has = (arr: string[], v: string) =>
    arr.some((x) => x.toLowerCase().includes(v.toLowerCase()));

  if (f.occasion) results = results.filter((p) => has(p.occasions, f.occasion!));
  if (f.recipient) results = results.filter((p) => has(p.recipients, f.recipient!));
  if (f.location) results = results.filter((p) => has(p.cities, f.location!));
  if (f.maxBudget) results = results.filter((p) => p.price <= f.maxBudget!);
  if (f.category) results = results.filter((p) => p.category === f.category!.toLowerCase());

  if (results.length === 0) {
    results = [...mockProducts].sort((a, b) => a.price - b.price);
  }
  return results.slice(0, 6);
}

// ── Public API used by the AI tools ──────────────────────────────────────────
export async function searchProducts(f: SearchFilters): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return searchMock(f);

  const { data, error } = await supabase.rpc("search_products", {
    p_occasion: f.occasion ?? null,
    p_recipient: f.recipient ?? null,
    p_city: f.location ?? null,
    p_max_budget: f.maxBudget ?? null,
    p_category: f.category ?? null,
    p_limit: 6,
  });
  if (error) throw new Error(`searchProducts failed: ${error.message}`);

  let results = ((data as ProductRow[]) ?? []).map(rowToProduct);

  // If nothing matched, show the cheapest in-stock products as a fallback.
  if (results.length === 0) {
    const { data: cheapest } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("price", { ascending: true })
      .limit(6);
    results = ((cheapest as ProductRow[]) ?? []).map(rowToProduct);
  }
  return results;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProducts.find((p) => p.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getProductById failed: ${error.message}`);
  return data ? rowToProduct(data as ProductRow) : null;
}

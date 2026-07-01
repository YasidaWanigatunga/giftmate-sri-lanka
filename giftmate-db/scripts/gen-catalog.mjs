// Single source of truth for the seed catalog.
// Generates BOTH lib/mock-products.ts (typed fallback) and supabase/seed.sql.
import { writeFileSync } from "node:fs";

// Original 8 keep their known-good Unsplash images. New items reuse a
// category-appropriate image as a placeholder — replace with real product
// photos (ideally uploaded to Supabase Storage) before going live.
const IMG = {
  cake: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
  cupcake: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=400",
  roses: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
  earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
  chocobox: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400",
  necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
  toycar: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400",
  wallet: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
};

const products = [
  { id: "p1", name: "Chocolate Truffle Cake (1kg)", category: "cake", price: 3500, image: IMG.cake,
    description: "Rich chocolate truffle cake, perfect for birthdays.",
    occasions: ["Birthday", "Anniversary"], recipients: ["Mother","Father","Friend","Girlfriend","Boyfriend"],
    cities: ["Colombo","Kandy","Galle","Negombo"], sameDayAvailable: true },
  { id: "p2", name: "Red Rose Bouquet (12 roses)", category: "flowers", price: 4200, image: IMG.roses,
    description: "Fresh red roses, hand-tied with greenery.",
    occasions: ["Anniversary","Valentine's Day","Birthday"], recipients: ["Girlfriend","Boyfriend","Mother","Wife"],
    cities: ["Colombo","Kandy","Negombo"], sameDayAvailable: true },
  { id: "p3", name: "Wireless Bluetooth Earbuds", category: "electronics", price: 6800, image: IMG.earbuds,
    description: "Compact earbuds with charging case, great for tech-lovers.",
    occasions: ["Birthday","Graduation","Anniversary"], recipients: ["Friend","Brother","Sister","Boyfriend","Girlfriend"],
    cities: ["Colombo","Kandy","Galle","Jaffna","Negombo"], sameDayAvailable: false },
  { id: "p4", name: "Handmade Greeting Card + Chocolate Box", category: "food", price: 1800, image: IMG.chocobox,
    description: "A heartfelt card paired with assorted chocolates.",
    occasions: ["Birthday","Get Well Soon","Thank You"], recipients: ["Mother","Father","Friend","Teacher","Boss"],
    cities: ["Colombo","Kandy","Galle","Jaffna","Negombo","Matara"], sameDayAvailable: true },
  { id: "p5", name: "Silver Pendant Necklace", category: "jewelry", price: 6500, image: IMG.necklace,
    description: "Elegant sterling silver pendant with chain.",
    occasions: ["Anniversary","Birthday","Valentine's Day"], recipients: ["Mother","Girlfriend","Wife","Sister"],
    cities: ["Colombo","Kandy"], sameDayAvailable: false },
  { id: "p6", name: "Vanilla Cupcake Box (6 pcs)", category: "cake", price: 2200, image: IMG.cupcake,
    description: "Soft vanilla cupcakes with buttercream frosting.",
    occasions: ["Birthday","Congratulations"], recipients: ["Friend","Sister","Brother","Boss","Mother"],
    cities: ["Colombo","Negombo","Galle"], sameDayAvailable: true },
  { id: "p7", name: "Remote Control Toy Car", category: "toys", price: 3200, image: IMG.toycar,
    description: "Fun RC car for kids, rechargeable battery.",
    occasions: ["Birthday","Children's Day"], recipients: ["Son","Daughter","Nephew","Niece"],
    cities: ["Colombo","Kandy","Galle","Negombo"], sameDayAvailable: false },
  { id: "p8", name: "Premium Leather Wallet", category: "fashion", price: 4500, image: IMG.wallet,
    description: "Genuine leather wallet with multiple card slots.",
    occasions: ["Birthday","Father's Day","Anniversary"], recipients: ["Father","Boyfriend","Brother","Boss"],
    cities: ["Colombo","Kandy","Galle","Jaffna"], sameDayAvailable: false },

  // ── New items ────────────────────────────────────────────────────────────
  { id: "p9", name: "10000mAh Fast-Charge Power Bank", category: "electronics", price: 2800, image: IMG.earbuds,
    description: "Slim power bank with dual USB output — a practical pick for any tech lover.",
    occasions: ["Graduation","Birthday","Congratulations","Thank You"], recipients: ["Friend","Brother","Sister","Boyfriend","Girlfriend","Boss"],
    cities: ["Colombo","Kandy","Galle","Jaffna","Negombo","Matara","Kurunegala"], sameDayAvailable: false },
  { id: "p10", name: "Adjustable Aluminium Phone & Tablet Stand", category: "electronics", price: 1500, image: IMG.earbuds,
    description: "Foldable desk stand for phones and tablets — great for students and remote workers.",
    occasions: ["Graduation","Birthday","Congratulations"], recipients: ["Friend","Brother","Sister","Boyfriend","Girlfriend","Teacher"],
    cities: ["Colombo","Kandy","Galle","Jaffna","Negombo","Matara"], sameDayAvailable: false },
  { id: "p11", name: "Ceylon Tea Gift Hamper", category: "hampers", price: 3900, image: IMG.chocobox,
    description: "A curated hamper of premium Ceylon teas, biscuits and treats — a proudly Sri Lankan gift.",
    occasions: ["Thank You","Housewarming","Anniversary","Get Well Soon"], recipients: ["Mother","Father","Boss","Teacher","Friend"],
    cities: ["Colombo","Kandy","Galle","Negombo","Matara"], sameDayAvailable: true },
  { id: "p12", name: "Hand-Dyed Batik Silk Scarf", category: "fashion", price: 3200, image: IMG.wallet,
    description: "A handcrafted batik scarf in vibrant island colours — a unique local artisan gift.",
    occasions: ["Birthday","Anniversary","Thank You"], recipients: ["Mother","Wife","Girlfriend","Sister","Friend"],
    cities: ["Colombo","Kandy","Galle"], sameDayAvailable: false },
  { id: "p13", name: "Scented Soy Candle Trio", category: "beauty", price: 2600, image: IMG.roses,
    description: "Three hand-poured soy candles with calming fragrances — perfect for unwinding.",
    occasions: ["Birthday","Get Well Soon","Thank You","Housewarming"], recipients: ["Mother","Friend","Girlfriend","Wife","Sister"],
    cities: ["Colombo","Kandy","Negombo"], sameDayAvailable: false },
  { id: "p14", name: "Money Plant in Ceramic Pot", category: "plants", price: 1900, image: IMG.roses,
    description: "A low-maintenance money plant in a glazed ceramic pot — a thoughtful housewarming gift.",
    occasions: ["Housewarming","Get Well Soon","Congratulations","Thank You"], recipients: ["Friend","Mother","Boss","Teacher"],
    cities: ["Colombo","Kandy","Negombo"], sameDayAvailable: false },
  { id: "p15", name: "Spa & Massage Voucher (60 min)", category: "experience", price: 7500, image: IMG.chocobox,
    description: "A relaxing one-hour spa session voucher, redeemable at partner spas in Colombo.",
    occasions: ["Anniversary","Birthday","Thank You"], recipients: ["Mother","Wife","Girlfriend","Friend"],
    cities: ["Colombo"], sameDayAvailable: false },
  { id: "p16", name: "Large Plush Teddy Bear", category: "toys", price: 2700, image: IMG.toycar,
    description: "A soft, huggable teddy bear — a sweet surprise for kids and loved ones alike.",
    occasions: ["Valentine's Day","Birthday","Get Well Soon"], recipients: ["Girlfriend","Daughter","Son","Friend"],
    cities: ["Colombo","Kandy","Galle","Negombo"], sameDayAvailable: true },
];

// ── Emit lib/mock-products.ts ────────────────────────────────────────────────
const ts = `// AUTO-GENERATED by scripts/gen-catalog.mjs — edit there, then re-run \`node scripts/gen-catalog.mjs\`.
// This is the typed FALLBACK catalog, used when Supabase env vars aren't set.
export type Product = {
  id: string;
  name: string;
  category:
    | "cake" | "flowers" | "electronics" | "fashion" | "toys" | "jewelry"
    | "food" | "beauty" | "books" | "plants" | "hampers" | "experience";
  price: number;
  image: string;
  description: string;
  occasions: string[];
  recipients: string[];
  cities: string[];
  sameDayAvailable: boolean;
};

export const mockProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;
writeFileSync("lib/mock-products.ts", ts);

// ── Emit supabase/seed.sql ──────────────────────────────────────────────────
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const arr = (a) => `ARRAY[${a.map(q).join(", ")}]::text[]`;
const rows = products
  .map(
    (p) =>
      `  (${q(p.id)}, ${q(p.name)}, ${q(p.category)}, ${p.price}, ${q(p.image)}, ${q(p.description)}, ${arr(p.occasions)}, ${arr(p.recipients)}, ${arr(p.cities)}, ${p.sameDayAvailable})`
  )
  .join(",\n");
const sql = `-- AUTO-GENERATED by scripts/gen-catalog.mjs
-- Seed data for the products table. Safe to re-run (upserts on id).
insert into products (id, name, category, price, image, description, occasions, recipients, cities, same_day_available)
values
${rows}
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  price = excluded.price,
  image = excluded.image,
  description = excluded.description,
  occasions = excluded.occasions,
  recipients = excluded.recipients,
  cities = excluded.cities,
  same_day_available = excluded.same_day_available;
`;
writeFileSync("supabase/seed.sql", sql);

console.log(`Generated lib/mock-products.ts and supabase/seed.sql with ${products.length} products.`);

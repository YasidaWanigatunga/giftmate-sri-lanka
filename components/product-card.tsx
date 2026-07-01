"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, MapPin, Plus, Truck, Zap } from "lucide-react";
import type { Product } from "@/lib/mock-products";
import { useCartStore } from "@/hooks/use-cart";

const CATEGORY_EMOJI: Record<Product["category"], string> = {
  cake: "🎂",
  flowers: "🌸",
  electronics: "🎧",
  fashion: "👜",
  toys: "🧸",
  jewelry: "💍",
  food: "🍫",
  beauty: "🕯️",
  books: "📚",
  plants: "🪴",
  hampers: "🧺",
  experience: "🎟️",
};

export function ProductCard({
  product,
  onAsk,
}: {
  product: Product;
  /** Sends a message to the chat (e.g. to ask GiftMate to check delivery). */
  onAsk?: (text: string) => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--color-bg)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium capitalize text-[var(--color-ink)] backdrop-blur">
          {CATEGORY_EMOJI[product.category]} {product.category}
        </span>
        {product.sameDayAvailable && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-mint/90 px-2 py-0.5 text-xs font-semibold text-white">
            <Zap className="size-3" /> Same-day
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="text-sm font-semibold leading-snug text-[var(--color-ink)]">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-muted)]">
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{product.cities.join(", ")}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-display text-lg font-semibold text-[var(--color-ink)]">
            Rs. {product.price.toLocaleString("en-LK")}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                onAsk?.(
                  `Can you check delivery for "${product.name}" and tell me more about it?`
                )
              }
              title="Ask GiftMate about delivery"
              className="flex size-8 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-muted)] transition-colors hover:border-plum/40 hover:text-plum"
            >
              <Truck className="size-4" />
            </button>
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-transform active:scale-95 ${
                added ? "bg-mint" : "bg-[var(--color-ink)]"
              }`}
            >
              {added ? (
                <>
                  <Check className="size-3.5" /> Added
                </>
              ) : (
                <>
                  <Plus className="size-3.5" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

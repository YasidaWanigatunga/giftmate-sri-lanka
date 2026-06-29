"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/hooks/use-cart";

export function CartDrawer({
  open,
  onOpenChange,
  onCheckout,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Asks GiftMate to create the checkout for the current total. */
  onCheckout: (total: number) => void;
}) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 36 }}
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[var(--color-surface)] shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-3">
                  <Dialog.Title className="flex items-center gap-2 font-display text-lg font-semibold">
                    <ShoppingBag className="size-5 text-plum" /> Your cart
                  </Dialog.Title>
                  <Dialog.Close className="flex size-8 items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-line)]">
                    <X className="size-4" />
                  </Dialog.Close>
                </div>

                <div className="scroll-quiet flex-1 overflow-y-auto px-4 py-3">
                  {items.length === 0 ? (
                    <p className="mt-10 text-center text-sm text-[var(--color-muted)]">
                      Your cart is empty. Ask GiftMate for a gift to get
                      started. 🎁
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex gap-3 rounded-xl border border-[var(--color-line)] p-2"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-bg)]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {item.name}
                            </span>
                            <span className="text-xs text-[var(--color-muted)]">
                              Qty {item.quantity} · Rs.{" "}
                              {item.price.toLocaleString("en-LK")}
                            </span>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="self-center rounded-full p-1.5 text-[var(--color-muted)] hover:bg-rose/10 hover:text-rose"
                            title="Remove"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="border-t border-[var(--color-line)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-[var(--color-muted)]">
                      Total
                    </span>
                    <span className="font-display text-xl font-semibold">
                      Rs. {total.toLocaleString("en-LK")}
                    </span>
                  </div>
                  <button
                    disabled={items.length === 0}
                    onClick={() => {
                      onOpenChange(false);
                      onCheckout(total);
                    }}
                    className="ribbon w-full rounded-full py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-40"
                  >
                    Checkout with GiftMate
                  </button>
                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="mt-2 w-full text-center text-xs text-[var(--color-muted)] hover:text-rose"
                    >
                      Clear cart
                    </button>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

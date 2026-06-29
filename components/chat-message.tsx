"use client";

import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Gift,
  Loader2,
  MapPin,
  PartyPopper,
  ShoppingBag,
} from "lucide-react";
import type { UIMessage } from "ai";
import type { Product } from "@/lib/mock-products";
import { ProductCard } from "./product-card";

/** A relaxed view of an AI SDK tool UI part — outputs aren't statically typed here. */
type ToolPart = {
  type: string;
  toolCallId: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  input?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output?: any;
  errorText?: string;
};

function isToolType(type: string): boolean {
  return type.startsWith("tool-");
}

const TOOL_LABEL: Record<string, string> = {
  "tool-updateCriteria": "Updating your gift tags",
  "tool-searchProducts": "Searching for gifts",
  "tool-checkDelivery": "Checking delivery",
  "tool-addToCart": "Adding to cart",
  "tool-createCheckout": "Preparing checkout",
};

function Pending({ type }: { type: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
      <Loader2 className="size-3.5 animate-spin text-plum" />
      {TOOL_LABEL[type] ?? "Working"}…
    </div>
  );
}

function DeliveryBanner({
  output,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: any;
}) {
  if (!output) return null;
  if (output.available === false) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-rose/30 bg-rose/5 px-3 py-2 text-sm text-[var(--color-ink)]">
        <Ban className="mt-0.5 size-4 shrink-0 text-rose" />
        <span>{output.message ?? "Delivery isn't available for that."}</span>
      </div>
    );
  }
  if (output.warning) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-saffron/40 bg-saffron/10 px-3 py-2 text-sm text-[var(--color-ink)]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-saffron" />
        <span>{output.warning}</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-sm text-[var(--color-ink)]">
      <MapPin className="mt-0.5 size-4 shrink-0 text-mint" />
      <span>{output.message ?? "Delivery is available."}</span>
    </div>
  );
}

function CheckoutCard({
  output,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  output: any;
}) {
  if (!output?.checkoutUrl) return null;
  const id = String(output.checkoutUrl).split("/").pop();
  return (
    <div className="rounded-2xl border border-plum/25 bg-plum/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
        <PartyPopper className="size-4 text-plum" />
        Your order is ready to confirm
      </div>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Total:{" "}
        <span className="font-semibold text-[var(--color-ink)]">
          Rs. {Number(output.totalAmount ?? 0).toLocaleString("en-LK")}
        </span>
      </p>
      <a
        href={`/checkout/${id}`}
        className="ribbon mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
      >
        <ShoppingBag className="size-4" /> Complete payment
      </a>
    </div>
  );
}

function ToolView({
  part,
  onAsk,
}: {
  part: ToolPart;
  onAsk?: (text: string) => void;
}) {
  if (part.state === "input-streaming" || part.state === "input-available") {
    if (part.type === "tool-updateCriteria") return null; // silent, shows in the tag bar
    return <Pending type={part.type} />;
  }
  if (part.state === "output-error") {
    return (
      <div className="rounded-xl border border-rose/30 bg-rose/5 px-3 py-2 text-xs text-rose">
        Something went wrong: {part.errorText ?? "tool error"}
      </div>
    );
  }

  // output-available
  switch (part.type) {
    case "tool-updateCriteria":
      return null; // reflected in the gift-tag bar
    case "tool-searchProducts": {
      const products: Product[] = part.output?.products ?? [];
      if (products.length === 0) return null;
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAsk={onAsk} />
          ))}
        </div>
      );
    }
    case "tool-checkDelivery":
      return <DeliveryBanner output={part.output} />;
    case "tool-addToCart":
      return part.output?.success ? (
        <div className="flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-sm text-[var(--color-ink)]">
          <CheckCircle2 className="size-4 text-mint" />
          {part.output.message ?? "Added to your cart."}
        </div>
      ) : null;
    case "tool-createCheckout":
      return <CheckoutCard output={part.output} />;
    default:
      return null;
  }
}

export function ChatMessage({
  message,
  onAsk,
}: {
  message: UIMessage;
  onAsk?: (text: string) => void;
}) {
  const isUser = message.role === "user";

  const textContent = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p) => (p as any).text)
    .join("");

  const toolParts = message.parts.filter((p) =>
    isToolType(p.type)
  ) as unknown as ToolPart[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="ribbon flex size-8 shrink-0 items-center justify-center rounded-full text-white">
          <Gift className="size-4" />
        </div>
      )}

      <div
        className={`flex min-w-0 max-w-[88%] flex-col gap-2.5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {textContent.trim() && (
          <div
            className={
              isUser
                ? "rounded-2xl rounded-tr-sm bg-[var(--color-ink)] px-4 py-2.5 text-sm text-white"
                : "rounded-2xl rounded-tl-sm border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm leading-relaxed text-[var(--color-ink)]"
            }
          >
            {isUser ? (
              <span className="whitespace-pre-wrap">{textContent}</span>
            ) : (
              <div className="prose-chat space-y-2">
                <ReactMarkdown>{textContent}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {toolParts.map((part) => (
          <div key={part.toolCallId} className="w-full">
            <ToolView part={part} onAsk={onAsk} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

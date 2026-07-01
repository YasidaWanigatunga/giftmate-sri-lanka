"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

/* eslint-disable @typescript-eslint/no-explicit-any */

// A tool part can arrive two ways:
//   - static tools:  { type: "tool-searchProducts", ... }
//   - MCP tools:     { type: "dynamic-tool", toolName: "searchProducts", ... }
// normalizeToolPart flattens both into one shape, and extracts the structured
// payload (MCP wraps it in result.structuredContent / result.content[].text).
export type NormalizedTool = {
  name: string;
  toolCallId: string;
  state: string;
  input?: any;
  payload?: any;
  errorText?: string;
};

function extractPayload(output: any): any {
  if (output == null) return undefined;
  if (typeof output === "object" && !Array.isArray(output)) {
    if (output.structuredContent != null) return output.structuredContent;
    if (Array.isArray(output.content)) {
      const textPart = output.content.find((c: any) => c?.type === "text");
      if (textPart?.text) {
        try {
          return JSON.parse(textPart.text);
        } catch {
          /* fall through */
        }
      }
    }
  }
  return output; // static tools already return the payload directly
}

export function normalizeToolPart(part: any): NormalizedTool | null {
  let name: string | null = null;
  if (part?.type === "dynamic-tool") name = part.toolName;
  else if (typeof part?.type === "string" && part.type.startsWith("tool-"))
    name = part.type.slice(5);
  if (!name) return null;

  return {
    name,
    toolCallId: part.toolCallId,
    state: part.state,
    input: part.input,
    payload: extractPayload(part.output),
    errorText: part.errorText,
  };
}

const TOOL_LABEL: Record<string, string> = {
  update_memory: "Updating memory",
  kapruka_search_products: "Searching the supplier catalog",
  kapruka_get_product: "Fetching product details",
  kapruka_check_delivery: "Checking delivery",
  kapruka_add_to_cart: "Adding to cart",
  kapruka_create_order: "Placing your order",
};

function Pending({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
      <Loader2 className="size-3.5 animate-spin text-plum" />
      {TOOL_LABEL[name] ?? "Working"}…
    </div>
  );
}

function DeliveryBanner({ data }: { data: any }) {
  if (!data) return null;
  if (data.available === false) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-rose/30 bg-rose/5 px-3 py-2 text-sm text-[var(--color-ink)]">
        <Ban className="mt-0.5 size-4 shrink-0 text-rose" />
        <span>{data.message ?? "Delivery isn't available for that."}</span>
      </div>
    );
  }
  if (data.warning) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-saffron/40 bg-saffron/10 px-3 py-2 text-sm text-[var(--color-ink)]">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-saffron" />
        <span>{data.warning}</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-sm text-[var(--color-ink)]">
      <MapPin className="mt-0.5 size-4 shrink-0 text-mint" />
      <span>{data.message ?? "Delivery is available."}</span>
    </div>
  );
}

function CheckoutCard({ data }: { data: any }) {
  if (!data?.checkoutUrl) return null;
  const id = data.orderId ?? String(data.checkoutUrl).split("/").pop();
  return (
    <div className="rounded-2xl border border-plum/25 bg-plum/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
        <PartyPopper className="size-4 text-plum" />
        Your order is ready to confirm
      </div>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Total:{" "}
        <span className="font-semibold text-[var(--color-ink)]">
          Rs. {Number(data.totalAmount ?? 0).toLocaleString("en-LK")}
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
  tool,
  onAsk,
}: {
  tool: NormalizedTool;
  onAsk?: (text: string) => void;
}) {
  if (tool.state === "input-streaming" || tool.state === "input-available") {
    if (tool.name === "update_memory") return null; // shows in the memory bar
    return <Pending name={tool.name} />;
  }
  if (tool.state === "output-error") {
    return (
      <div className="rounded-xl border border-rose/30 bg-rose/5 px-3 py-2 text-xs text-rose">
        Something went wrong: {tool.errorText ?? "tool error"}
      </div>
    );
  }

  const data = tool.payload;
  switch (tool.name) {
    case "update_memory":
      return null; // reflected in the memory bar
    case "kapruka_search_products": {
      const products: Product[] = data?.products ?? [];
      if (products.length === 0) return null;
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAsk={onAsk} />
          ))}
        </div>
      );
    }
    case "kapruka_get_product": {
      const product: Product | undefined = data?.product;
      if (!product) return null;
      return (
        <div className="max-w-xs">
          <ProductCard product={product} onAsk={onAsk} />
        </div>
      );
    }
    case "kapruka_check_delivery":
      return <DeliveryBanner data={data} />;
    case "kapruka_add_to_cart":
      return data?.success ? (
        <div className="flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/5 px-3 py-2 text-sm text-[var(--color-ink)]">
          <CheckCircle2 className="size-4 text-mint" />
          {data.message ?? "Added to your cart."}
        </div>
      ) : null;
    case "kapruka_create_order":
      return <CheckoutCard data={data} />;
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
    .map((p) => (p as any).text)
    .join("");

  const tools = message.parts
    .map((p) => normalizeToolPart(p))
    .filter((t): t is NormalizedTool => t !== null);

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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {textContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {tools.map((tool) => (
          <div key={tool.toolCallId} className="w-full">
            <ToolView tool={tool} onAsk={onAsk} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

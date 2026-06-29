"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Gift, ShoppingBag, Volume2, VolumeX } from "lucide-react";
import { CriteriaBar } from "@/components/criteria-bar";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { CartDrawer } from "@/components/cart-drawer";
import { useCriteriaStore } from "@/hooks/use-criteria";
import { useCartStore, type CartItem } from "@/hooks/use-cart";
import { useSpeech } from "@/hooks/use-speech";

const SUGGESTIONS = [
  "Birthday gift for amma under Rs. 5000 in Colombo 🎂",
  "Anniversary flowers delivered to Kandy 🌸",
  "Graduation gift for my friend, tech lover 🎧",
  "Surprise for girlfriend, Valentine's, under 6000 💝",
];

export default function Home() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );
  const { messages, sendMessage, status } = useChat({ transport });

  const setCriteria = useCriteriaStore((s) => s.setCriteria);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  const { speak } = useSpeech();
  const [voiceOn, setVoiceOn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const isLoading = status === "submitted" || status === "streaming";

  const scrollRef = useRef<HTMLDivElement>(null);
  const processedTools = useRef<Set<string>>(new Set());
  const spokenMessage = useRef<string | null>(null);

  const send = (text: string) => sendMessage({ text });

  // Apply tool outputs to the client stores (criteria pills + cart), once each.
  useEffect(() => {
    for (const m of messages) {
      if (m.role !== "assistant") continue;
      for (const part of m.parts) {
        if (!part.type.startsWith("tool-")) continue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = part as any;
        if (p.state !== "output-available") continue;
        if (processedTools.current.has(p.toolCallId)) continue;
        processedTools.current.add(p.toolCallId);

        if (part.type === "tool-updateCriteria" && p.output?.updated) {
          setCriteria(p.output.updated);
        } else if (part.type === "tool-addToCart" && p.output?.success) {
          addItem(p.output.item as CartItem);
        }
      }
    }
  }, [messages, setCriteria, addItem]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Optionally read the latest assistant reply aloud.
  useEffect(() => {
    if (!voiceOn || isLoading) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenMessage.current === last.id) return;
    const text = last.parts
      .filter((p) => p.type === "text")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p) => (p as any).text)
      .join(" ")
      .trim();
    if (text) {
      spokenMessage.current = last.id;
      speak(text);
    }
  }, [messages, voiceOn, isLoading, speak]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-dvh flex-col">
      {/* Header */}
      <header className="ribbon px-4 py-3 text-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/20">
              <Gift className="size-5" />
            </div>
            <div className="leading-tight">
              <h1 className="font-display text-lg font-semibold">GiftMate</h1>
              <p className="text-xs text-white/85">Sri Lanka gift concierge</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setVoiceOn((v) => !v)}
              title={voiceOn ? "Voice replies on" : "Voice replies off"}
              className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
            >
              {voiceOn ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-sm font-medium transition-colors hover:bg-white/25"
            >
              <ShoppingBag className="size-4" />
              Cart
              {cartCount > 0 && (
                <span className="flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-plum">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <CriteriaBar />

      {/* Messages */}
      <div ref={scrollRef} className="scroll-quiet flex-1 overflow-y-auto px-4 py-5">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {isEmpty ? (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="ribbon mb-4 flex size-14 items-center justify-center rounded-2xl text-white shadow-md">
                <Gift className="size-7" />
              </div>
              <h2 className="font-display text-2xl font-semibold">
                Find the <span className="text-ribbon">perfect gift</span>
              </h2>
              <p className="mt-1 max-w-md text-sm text-[var(--color-muted)]">
                Tell me the occasion, who it&apos;s for, your city and budget —
                in English, Sinhala, or Tanglish. I&apos;ll find gifts, check
                delivery, and help you check out.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-plum/40 hover:bg-plum/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <ChatMessage key={m.id} message={m} onAsk={send} />
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2 pl-11 text-sm text-[var(--color-muted)]">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-plum [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-rose [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-saffron" />
              </span>
              GiftMate is thinking…
            </div>
          )}
        </div>
      </div>

      <ChatInput onSend={send} disabled={isLoading} />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={(total) =>
          send(
            `I'd like to checkout now. My cart total is Rs. ${total}. Please create the checkout.`
          )
        }
      />
    </div>
  );
}

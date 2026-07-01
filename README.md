# 🎁 GiftMate Sri Lanka — AI Gift Concierge Agent

> A multilingual AI shopping agent with **visible editable memory**, **MCP tool calling**, product cards, delivery checking, cart flow, and voice interaction.

GiftMate is an AI agent that helps you find and order gifts anywhere in Sri Lanka.
Chat or speak in **English, Sinhala (සිංහල), or Tanglish** — the agent remembers your
occasion, recipient, city and budget as editable **memory pills**, searches a
Kapruka-style supplier catalog over **MCP (Model Context Protocol)**, checks
delivery to your city, and places your order.

## ✨ The agent flow

```
User message ("Birthday cake for amma under Rs. 5000 in Colombo")
   ↓
AI Agent  (Groq gpt-oss-120b via Vercel AI SDK — decides which tool to call)
   ↓
MCP Tool Call  (Model Context Protocol over Streamable HTTP)
   ↓
Supplier product system  (/api/mcp → Supabase Postgres catalog)
   ↓
Product results (structured JSON)
   ↓
AI answer + rendered product cards, delivery banners, order confirmation
```

## 🛠 MCP tools exposed by the server (`/api/mcp`)

| Tool | What it does |
|------|--------------|
| `update_memory` | Keeps the agent's visible memory pills in sync |
| `kapruka_search_products` | Searches the supplier catalog (occasion, recipient, city, budget, category) |
| `kapruka_get_product` | Fetches full details for one product |
| `kapruka_check_delivery` | Confirms a product can reach a city by a date |
| `kapruka_add_to_cart` | Adds a product to the cart |
| `kapruka_create_order` | Records the order in the database |

Because it's a standard MCP server, any MCP client (Claude Desktop, Cursor,
MCP Inspector) can connect to `http://localhost:3000/api/mcp` and use these
same tools — try `npx @modelcontextprotocol/inspector`.

> **Note:** Kapruka has no public API, so the "supplier system" is a
> Kapruka-*style* product service backed by this project's own Supabase
> catalog. The architecture is identical to a real supplier integration —
> only the data source would change.

## 🧠 Visible, editable memory

The agent's working memory is shown as pills under the header. Click a pill's
✏️ to correct it (the agent is informed), or × to make the agent forget it.

## 🚀 Stack

- **Next.js 16** (App Router) · React 19 · Tailwind CSS 4 · Framer Motion
- **Vercel AI SDK v6** (`streamText`, tool loop) + **Groq** `openai/gpt-oss-120b`
- **MCP**: `mcp-handler` (server route) + `@ai-sdk/mcp` (client)
- **Supabase** Postgres (products + orders, RLS, SQL search function)
- **Web Speech API** for voice input & spoken replies
- Zustand for cart/memory state

## 🏃 Run locally

```bash
pnpm install
```

Create `.env.local`:

```
GROQ_API_KEY=gsk_your_key                    # console.groq.com (free)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co    # optional
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                # optional
```

Without Supabase keys the app runs on a built-in 16-product demo catalog.
With them, run `supabase/schema.sql`, `supabase/seed.sql`, and
`supabase/orders.sql` in the Supabase SQL Editor first.

```bash
pnpm dev   # → http://localhost:3000
```

Voice input needs Chrome on `localhost` or HTTPS.

## 📁 Key files

```
app/api/[transport]/route.ts   MCP server (the 6 tools)
app/api/chat/route.ts          AI agent + MCP client
lib/products.ts                Data layer (Supabase, local fallback)
lib/persona.ts                 Agent system prompt (multilingual)
components/criteria-bar.tsx    Editable agent memory pills
components/chat-message.tsx    Renders text + tool results (cards, banners)
supabase/*.sql                 Schema, seed data, orders table
```

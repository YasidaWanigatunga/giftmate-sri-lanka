import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { searchProducts, getProductById, createOrder } from "@/lib/products";

// MCP tools return a text block (for the model) plus structuredContent
// (the exact payload our UI renders).
function ok(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload as Record<string, unknown>,
  };
}

const handler = createMcpHandler(
  (server) => {
    // ── Agent memory ─────────────────────────────────────────────────────
    server.registerTool(
      "update_memory",
      {
        title: "Update agent memory",
        description:
          "Update the agent's visible memory pills (occasion, recipient, city, budget, date, preference, avoid).",
        inputSchema: {
          occasion: z.string().optional(),
          recipient: z.string().optional(),
          location: z.string().optional(),
          budget: z.number().optional(),
          deliveryDate: z.string().optional(),
          preference: z.string().optional(),
          avoid: z.string().optional(),
        },
      },
      async (criteria) => ok({ updated: criteria })
    );

    // ── Kapruka-style supplier system ────────────────────────────────────
    server.registerTool(
      "kapruka_search_products",
      {
        title: "Search supplier products",
        description:
          "Search the Kapruka-style supplier catalog for gifts matching the criteria.",
        inputSchema: {
          occasion: z.string().optional(),
          recipient: z.string().optional(),
          location: z.string().optional(),
          maxBudget: z.number().optional(),
          category: z.string().optional(),
        },
      },
      async ({ occasion, recipient, location, maxBudget, category }) => {
        const products = await searchProducts({
          occasion,
          recipient,
          location,
          maxBudget,
          category,
        });
        return ok({ products });
      }
    );

    server.registerTool(
      "kapruka_get_product",
      {
        title: "Get product details",
        description: "Fetch full details for a single product by its id.",
        inputSchema: { productId: z.string() },
      },
      async ({ productId }) => {
        const product = await getProductById(productId);
        if (!product) return ok({ found: false, message: "Product not found." });
        return ok({ found: true, product });
      }
    );

    server.registerTool(
      "kapruka_check_delivery",
      {
        title: "Check delivery",
        description:
          "Check if a product can be delivered to a city by a given date.",
        inputSchema: {
          productId: z.string(),
          city: z.string(),
          date: z.string().optional(),
        },
      },
      async ({ productId, city, date }) => {
        const product = await getProductById(productId);
        if (!product) return ok({ available: false, message: "Product not found." });

        const cityAvailable = product.cities.some(
          (c) => c.toLowerCase() === city.toLowerCase()
        );
        if (!cityAvailable) {
          return ok({
            available: false,
            message: `Sorry, ${product.name} cannot currently be delivered to ${city}.`,
          });
        }

        const isSameDay =
          date && new Date(date).toDateString() === new Date().toDateString();
        if (isSameDay && !product.sameDayAvailable) {
          return ok({
            available: true,
            warning: `Same-day delivery for ${product.name} may not be guaranteed — please confirm with the store.`,
          });
        }
        return ok({
          available: true,
          message: `${product.name} can be delivered to ${city}.`,
        });
      }
    );

    server.registerTool(
      "kapruka_add_to_cart",
      {
        title: "Add to cart",
        description: "Add a product to the user's cart.",
        inputSchema: {
          productId: z.string(),
          quantity: z.number().default(1),
        },
      },
      async ({ productId, quantity }) => {
        const product = await getProductById(productId);
        if (!product) return ok({ success: false, message: "Product not found." });
        return ok({
          success: true,
          item: { ...product, quantity },
          message: `Added ${product.name} (x${quantity}) to cart.`,
        });
      }
    );

    server.registerTool(
      "kapruka_create_order",
      {
        title: "Create order",
        description:
          "Place the order for the current cart. Pass the items and the cart total.",
        inputSchema: {
          items: z
            .array(
              z.object({
                productId: z.string(),
                name: z.string(),
                price: z.number(),
                quantity: z.number(),
              })
            )
            .default([]),
          totalAmount: z.number(),
          city: z.string().optional(),
        },
      },
      async ({ items, totalAmount, city }) => {
        const { orderId, recorded } = await createOrder({
          items,
          totalAmount,
          city,
        });
        return ok({
          orderId,
          recorded,
          checkoutUrl: `/checkout/${orderId}`,
          totalAmount,
          message: recorded
            ? `Order ${orderId} recorded.`
            : `Order ${orderId} created (demo mode — database not configured).`,
        });
      }
    );
  },
  {},
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };

import { tool } from "ai";
import { z } from "zod";
import { mockProducts } from "./mock-products";

export const tools = {
  updateCriteria: tool({
    description: "Update the visible criteria pills based on what the user has said.",
    inputSchema: z.object({
      occasion: z.string().optional(),
      recipient: z.string().optional(),
      location: z.string().optional(),
      budget: z.number().optional(),
      deliveryDate: z.string().optional(),
      preference: z.string().optional(),
      avoid: z.string().optional(),
    }),
    execute: async (criteria) => {
      return { updated: criteria };
    },
  }),

  searchProducts: tool({
    description: "Search for gift products matching the active criteria.",
    inputSchema: z.object({
      occasion: z.string().optional(),
      recipient: z.string().optional(),
      location: z.string().optional(),
      maxBudget: z.number().optional(),
      category: z.string().optional(),
    }),
    execute: async ({ occasion, recipient, location, maxBudget, category }) => {
      let results = mockProducts;

      if (occasion) {
        results = results.filter((p) =>
          p.occasions.some((o) => o.toLowerCase().includes(occasion.toLowerCase()))
        );
      }
      if (recipient) {
        results = results.filter((p) =>
          p.recipients.some((r) => r.toLowerCase().includes(recipient.toLowerCase()))
        );
      }
      if (location) {
        results = results.filter((p) =>
          p.cities.some((c) => c.toLowerCase().includes(location.toLowerCase()))
        );
      }
      if (maxBudget) {
        results = results.filter((p) => p.price <= maxBudget);
      }
      if (category) {
        results = results.filter((p) => p.category === category);
      }

      // Fallback: if nothing matches, return cheapest 4 products overall
      if (results.length === 0) {
        results = [...mockProducts].sort((a, b) => a.price - b.price);
      }

      return { products: results.slice(0, 6) };
    },
  }),

  checkDelivery: tool({
    description: "Check if a product can be delivered to a city by a given date.",
    inputSchema: z.object({
      productId: z.string(),
      city: z.string(),
      date: z.string().optional(),
    }),
    execute: async ({ productId, city, date }) => {
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) return { available: false, message: "Product not found." };

      const cityAvailable = product.cities.some(
        (c) => c.toLowerCase() === city.toLowerCase()
      );

      if (!cityAvailable) {
        return {
          available: false,
          message: `Sorry, ${product.name} cannot currently be delivered to ${city}.`,
        };
      }

      const isSameDay = date && new Date(date).toDateString() === new Date().toDateString();
      if (isSameDay && !product.sameDayAvailable) {
        return {
          available: true,
          warning: `Same-day delivery for ${product.name} may not be guaranteed — please confirm with the store.`,
        };
      }

      return { available: true, message: `${product.name} can be delivered to ${city}.` };
    },
  }),

  addToCart: tool({
    description: "Add a product to the user's cart.",
    inputSchema: z.object({
      productId: z.string(),
      quantity: z.number().default(1),
    }),
    execute: async ({ productId, quantity }) => {
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) return { success: false, message: "Product not found." };
      return {
        success: true,
        item: { ...product, quantity },
        message: `Added ${product.name} (x${quantity}) to cart.`,
      };
    },
  }),

  createCheckout: tool({
    description: "Create a mock checkout/payment link for the cart.",
    inputSchema: z.object({
      totalAmount: z.number(),
    }),
    execute: async ({ totalAmount }) => {
      const fakeId = Math.random().toString(36).substring(2, 10);
      return {
        checkoutUrl: `https://giftmate-sri-lanka.vercel.app/checkout/${fakeId}`,
        totalAmount,
        message: "Mock checkout link created!",
      };
    },
  }),
};
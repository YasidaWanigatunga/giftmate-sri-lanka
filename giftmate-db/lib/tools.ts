import { tool } from "ai";
import { z } from "zod";
import { searchProducts, getProductById } from "./products";

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
      const products = await searchProducts({
        occasion,
        recipient,
        location,
        maxBudget,
        category,
      });
      return { products };
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
      const product = await getProductById(productId);
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

      const isSameDay =
        date && new Date(date).toDateString() === new Date().toDateString();
      if (isSameDay && !product.sameDayAvailable) {
        return {
          available: true,
          warning: `Same-day delivery for ${product.name} may not be guaranteed — please confirm with the store.`,
        };
      }

      return {
        available: true,
        message: `${product.name} can be delivered to ${city}.`,
      };
    },
  }),

  addToCart: tool({
    description: "Add a product to the user's cart.",
    inputSchema: z.object({
      productId: z.string(),
      quantity: z.number().default(1),
    }),
    execute: async ({ productId, quantity }) => {
      const product = await getProductById(productId);
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

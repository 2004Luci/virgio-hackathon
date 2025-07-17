import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  discountPercentage: integer("discount_percentage"),
  category: text("category").notNull(),
  collection: text("collection"),
  fabric: text("fabric"),
  color: text("color"),
  print: text("print"),
  fit: text("fit"),
  features: text("features"),
  length: text("length"),
  sizes: json("sizes").$type<string[]>().notNull(),
  images: json("images").$type<string[]>().notNull(),
  thumbnails: json("thumbnails").$type<string[]>().notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  inventory: json("inventory").$type<Record<string, number>>().notNull(),
  careInstructions: text("care_instructions"),
  materialComposition: text("material_composition"),
  sustainability: text("sustainability"),
  modelInfo: text("model_info"),
  costPerWear: integer("cost_per_wear"),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  quantity: integer("quantity").notNull().default(1),
  sessionId: text("session_id").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

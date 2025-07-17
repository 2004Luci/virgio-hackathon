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

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const sizeRecommendations = pgTable("size_recommendations", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: text("user_id").notNull(),
  recommendedSize: text("recommended_size").notNull(),
  actualSize: text("actual_size"),
  accepted: boolean("accepted"),
  reason: text("reason"),
});

export const purchaseHistory = pgTable("purchase_history", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  returned: boolean("returned").default(false),
  exchanged: boolean("exchanged").default(false),
  returnReason: text("return_reason"),
});

export const notificationSignups = pgTable("notification_signups", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  size: text("size").notNull(),
  email: text("email").notNull(),
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

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
});

export const insertSizeRecommendationSchema = createInsertSchema(sizeRecommendations).omit({
  id: true,
});

export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory).omit({
  id: true,
});

export const insertNotificationSignupSchema = createInsertSchema(notificationSignups).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type SizeRecommendation = typeof sizeRecommendations.$inferSelect;
export type InsertSizeRecommendation = z.infer<typeof insertSizeRecommendationSchema>;
export type PurchaseHistory = typeof purchaseHistory.$inferSelect;
export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;
export type NotificationSignup = typeof notificationSignups.$inferSelect;
export type InsertNotificationSignup = z.infer<typeof insertNotificationSignupSchema>;

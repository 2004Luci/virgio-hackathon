import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Get cart items
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'default';
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  // Add to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'default';
      const data = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(data);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  // Update cart item
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const cartItem = await storage.updateCartItem(id, quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In production, use proper JWT or session management
      res.json({ 
        message: "Login successful", 
        admin: { id: admin.id, username: admin.username, role: admin.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Get analytics data
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analyticsData = await storage.getAnalyticsData();
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Get size recommendation for product and user
  app.get("/api/size-recommendation/:productId/:userId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const userId = req.params.userId;
      const recommendation = await storage.getSizeRecommendation(productId, userId);
      
      if (!recommendation) {
        // Generate a dummy recommendation
        const dummyRecommendation = {
          productId,
          userId,
          recommendedSize: "M",
          reason: "Considering the fabric stretchability and based on your past purchases and returns, we recommend going one size up for optimal comfort."
        };
        return res.json(dummyRecommendation);
      }
      
      res.json(recommendation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get size recommendation" });
    }
  });

  // Create notification signup
  app.post("/api/notification-signup", async (req, res) => {
    try {
      const { productId, size, email } = req.body;
      const signup = await storage.createNotificationSignup({
        productId: parseInt(productId),
        size,
        email
      });
      res.json({ message: "Notification signup successful", signup });
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification signup" });
    }
  });

  // Accept/reject size recommendation
  app.post("/api/size-recommendation/:id/response", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { accepted, actualSize } = req.body;
      await storage.updateSizeRecommendationAcceptance(id, accepted, actualSize);
      res.json({ message: "Recommendation response recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record recommendation response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

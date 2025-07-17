import { 
  users, 
  products, 
  cartItems,
  adminUsers, 
  sizeRecommendations,
  purchaseHistory,
  notificationSignups,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type CartItem, 
  type InsertCartItem,
  type AdminUser,
  type InsertAdminUser,
  type SizeRecommendation,
  type InsertSizeRecommendation,
  type PurchaseHistory,
  type InsertPurchaseHistory,
  type NotificationSignup,
  type InsertNotificationSignup
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;

  // Admin functions
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  
  // Size recommendations
  getSizeRecommendation(productId: number, userId: string): Promise<SizeRecommendation | undefined>;
  createSizeRecommendation(recommendation: InsertSizeRecommendation): Promise<SizeRecommendation>;
  updateSizeRecommendationAcceptance(id: number, accepted: boolean, actualSize?: string): Promise<void>;
  
  // Purchase history
  getPurchaseHistory(userId: string): Promise<PurchaseHistory[]>;
  createPurchaseHistory(history: InsertPurchaseHistory): Promise<PurchaseHistory>;
  
  // Notification signups
  createNotificationSignup(signup: InsertNotificationSignup): Promise<NotificationSignup>;
  
  // Analytics
  getAnalyticsData(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "100% Viscose Relaxed Lace-Tie Pants",
        description: "Effortlessly stylish relaxed fit pants with lace-tie accents and high-low hem. Made from 100% sustainably sourced viscose for ultimate comfort.",
        price: 2590,
        category: "Bottoms",
        collection: "Alara",
        fabric: "100% Viscose",
        color: "Blue",
        print: "Solid",
        fit: "High-Low",
        features: "Relaxed Lace-Tie Pants",
        length: "Regular",
        sizes: ["26", "28", "30", "32", "34", "36"],
        images: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1915_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1896_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Copy_of_Virgio_-_3rd_July1909_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1900_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Copy_of_Virgio_-_3rd_July1891_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1912_copy.jpg?v=1752575207&width=800&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1911_copy.jpg?v=1752575207&width=800&crop=center"
        ],
        thumbnails: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1915_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1896_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Copy_of_Virgio_-_3rd_July1909_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1900_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Copy_of_Virgio_-_3rd_July1891_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1912_copy.jpg?v=1752575207&width=72&height=108&crop=center",
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Virgio_-_3rd_July1911_copy.jpg?v=1752575207&width=72&height=108&crop=center"
        ],
        inStock: true,
        inventory: { "26": 5, "28": 8, "30": 12, "32": 15, "34": 10, "36": 7 },
        careInstructions: "Machine wash cold, hang dry, do not bleach",
        materialComposition: "100% Viscose - sustainably sourced",
        sustainability: "Being 100% sustainably sourced, this fabric is feather-light, breathable, and effortlessly smooth. The best part? It helps reduce environmental waste!",
        modelInfo: "Layla is 5'4\" tall and is wearing a size XS",
        costPerWear: 288
      },
      {
        name: "100% Cotton High-Waisted Balloon Fit Pants",
        description: "High-waisted balloon fit pants crafted from premium cotton for ultimate comfort and style.",
        price: 2590,
        category: "Bottoms",
        collection: "Runa",
        fabric: "100% Cotton",
        color: "Beige",
        print: "Solid",
        fit: "Balloon Fit",
        features: "High-Waisted Balloon Fit",
        length: "Regular",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/DSCF0839_00008c4b-4ac0-44b7-96e8-3310dc7fdc24.jpg?v=1749621335&width=800&crop=center"
        ],
        thumbnails: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/DSCF0839_00008c4b-4ac0-44b7-96e8-3310dc7fdc24.jpg?v=1749621335&width=72&height=108&crop=center"
        ],
        inStock: true,
        inventory: { "XS": 5, "S": 8, "M": 12, "L": 15, "XL": 10 },
        careInstructions: "Machine wash cold, tumble dry low",
        materialComposition: "100% Premium Cotton",
        costPerWear: 288
      },
      {
        name: "Linen Straight Fit Pleated Trousers",
        description: "Elegant linen trousers with pleated details for a sophisticated look.",
        price: 2205,
        originalPrice: 2590,
        discountPercentage: 15,
        category: "Bottoms",
        collection: "Alba",
        fabric: "Linen",
        color: "Cream",
        print: "Solid",
        fit: "Straight Fit",
        features: "Pleated Details",
        length: "Regular",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/1stoctvirgio-00804.jpg?v=1749621395&width=800&crop=center"
        ],
        thumbnails: [
          "https://cdn.shopify.com/s/files/1/0785/1674/8585/files/1stoctvirgio-00804.jpg?v=1749621395&width=72&height=108&crop=center"
        ],
        inStock: true,
        inventory: { "XS": 3, "S": 6, "M": 8, "L": 10, "XL": 5 },
        careInstructions: "Dry clean recommended",
        materialComposition: "100% Linen",
        costPerWear: 245
      },
      {
        name: "Elegant Floral Midi Dress",
        description: "Beautiful floral midi dress perfect for any occasion.",
        price: 3290,
        category: "Dress",
        collection: "Bloom",
        fabric: "100% Cotton",
        color: "Floral",
        print: "Floral",
        fit: "A-Line",
        features: "Midi Length, Floral Print",
        length: "Midi",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80"
        ],
        thumbnails: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=72&h=108&q=80"
        ],
        inStock: true,
        inventory: { "XS": 4, "S": 7, "M": 10, "L": 12, "XL": 8 },
        careInstructions: "Machine wash cold, hang dry",
        materialComposition: "100% Cotton",
        costPerWear: 365
      },
      {
        name: "Classic Cotton Button-Down Shirt",
        description: "Timeless cotton shirt perfect for professional and casual wear.",
        price: 1990,
        category: "Shirt",
        collection: "Classic",
        fabric: "100% Cotton",
        color: "White",
        print: "Solid",
        fit: "Regular Fit",
        features: "Button-Down Collar",
        length: "Regular",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80"
        ],
        thumbnails: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=72&h=108&q=80"
        ],
        inStock: true,
        inventory: { "XS": 6, "S": 10, "M": 15, "L": 12, "XL": 8 },
        careInstructions: "Machine wash warm, iron if needed",
        materialComposition: "100% Cotton",
        costPerWear: 221
      },
      {
        name: "Sustainable Linen Midi Dress",
        description: "Elegant linen midi dress with a flattering A-line silhouette, perfect for any occasion.",
        price: 3490,
        category: "Dress",
        collection: "Bloom",
        fabric: "100% Linen",
        color: "Sage Green",
        print: "Solid",
        fit: "A-Line",
        features: "Midi Length, Side Pockets",
        length: "Midi",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
          "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"
        ],
        thumbnails: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=72&h=108&q=80",
          "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=72&h=108&q=80",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=72&h=108&q=80"
        ],
        inStock: true,
        inventory: { "XS": 4, "S": 7, "M": 10, "L": 12, "XL": 8 },
        careInstructions: "Machine wash cold, hang dry",
        materialComposition: "100% Organic Linen",
        sustainability: "Made from sustainably sourced organic linen, this dress is both stylish and eco-friendly.",
        modelInfo: "Model is 5'7\" and wearing size S",
        costPerWear: 387
      },
      {
        name: "Essential Cotton Crop Top",
        description: "Versatile cotton crop top that pairs perfectly with high-waisted bottoms.",
        price: 1490,
        category: "Top",
        collection: "Essentials",
        fabric: "100% Cotton",
        color: "Black",
        print: "Solid",
        fit: "Cropped Fit",
        features: "Crew Neck, Short Sleeves",
        length: "Crop",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a13ba7?w=800&q=80",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80"
        ],
        thumbnails: [
          "https://images.unsplash.com/photo-1583496661160-fb5886a13ba7?w=72&h=108&q=80",
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=72&h=108&q=80"
        ],
        inStock: true,
        inventory: { "XS": 8, "S": 12, "M": 15, "L": 10, "XL": 6 },
        careInstructions: "Machine wash cold, tumble dry low",
        materialComposition: "100% Organic Cotton",
        modelInfo: "Model is 5'6\" and wearing size M",
        costPerWear: 165
      },
      {
        name: "Coordinated Two-Piece Set",
        description: "Matching crop top and wide-leg pants set in soft organic cotton blend.",
        price: 4290,
        originalPrice: 4990,
        discountPercentage: 14,
        category: "Co-ord Set",
        collection: "Harmony",
        fabric: "Organic Cotton Blend",
        color: "Cream",
        print: "Solid",
        fit: "Relaxed Fit",
        features: "Two-Piece Set, Matching Design",
        length: "Regular",
        sizes: ["XS", "S", "M", "L", "XL"],
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
          "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a13ba7?w=800&q=80"
        ],
        thumbnails: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=72&h=108&q=80",
          "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=72&h=108&q=80",
          "https://images.unsplash.com/photo-1583496661160-fb5886a13ba7?w=72&h=108&q=80"
        ],
        inStock: true,
        inventory: { "XS": 3, "S": 6, "M": 8, "L": 5, "XL": 4 },
        careInstructions: "Machine wash cold, lay flat to dry",
        materialComposition: "70% Organic Cotton, 30% Recycled Polyester",
        sustainability: "Made with sustainable materials and responsible manufacturing processes.",
        modelInfo: "Model is 5'8\" and wearing size S",
        costPerWear: 477
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      id,
      name: insertProduct.name,
      description: insertProduct.description,
      price: insertProduct.price,
      category: insertProduct.category,
      sizes: insertProduct.sizes as string[],
      images: insertProduct.images as string[],
      thumbnails: insertProduct.thumbnails as string[],
      inStock: insertProduct.inStock ?? true,
      inventory: insertProduct.inventory,
      // Optional fields with default values
      length: insertProduct.length || null,
      originalPrice: insertProduct.originalPrice || null,
      discountPercentage: insertProduct.discountPercentage || null,
      collection: insertProduct.collection || null,
      fabric: insertProduct.fabric || null,
      color: insertProduct.color || null,
      print: insertProduct.print || null,
      fit: insertProduct.fit || null,
      features: insertProduct.features || null,
      careInstructions: insertProduct.careInstructions || null,
      materialComposition: insertProduct.materialComposition || null,
      sustainability: insertProduct.sustainability || null,
      modelInfo: insertProduct.modelInfo || null,
      costPerWear: insertProduct.costPerWear || null
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity || 1
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
    }
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...insertProduct,
        sizes: insertProduct.sizes as string[],
        images: insertProduct.images as string[],
        thumbnails: insertProduct.thumbnails as string[],
        inventory: insertProduct.inventory as Record<string, number>
      })
      .returning();
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const [item] = await db
      .insert(cartItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Admin functions
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdmin(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db
      .insert(adminUsers)
      .values(insertAdmin)
      .returning();
    return admin;
  }

  // Size recommendations
  async getSizeRecommendation(productId: number, userId: string): Promise<SizeRecommendation | undefined> {
    const [recommendation] = await db
      .select()
      .from(sizeRecommendations)
      .where(eq(sizeRecommendations.productId, productId))
      .where(eq(sizeRecommendations.userId, userId));
    return recommendation || undefined;
  }

  async createSizeRecommendation(insertRecommendation: InsertSizeRecommendation): Promise<SizeRecommendation> {
    const [recommendation] = await db
      .insert(sizeRecommendations)
      .values(insertRecommendation)
      .returning();
    return recommendation;
  }

  async updateSizeRecommendationAcceptance(id: number, accepted: boolean, actualSize?: string): Promise<void> {
    await db
      .update(sizeRecommendations)
      .set({ accepted, actualSize })
      .where(eq(sizeRecommendations.id, id));
  }

  // Purchase history
  async getPurchaseHistory(userId: string): Promise<PurchaseHistory[]> {
    return await db.select().from(purchaseHistory).where(eq(purchaseHistory.userId, userId));
  }

  async createPurchaseHistory(insertHistory: InsertPurchaseHistory): Promise<PurchaseHistory> {
    const [history] = await db
      .insert(purchaseHistory)
      .values(insertHistory)
      .returning();
    return history;
  }

  // Notification signups
  async createNotificationSignup(insertSignup: InsertNotificationSignup): Promise<NotificationSignup> {
    const [signup] = await db
      .insert(notificationSignups)
      .values(insertSignup)
      .returning();
    return signup;
  }

  // Analytics
  async getAnalyticsData(): Promise<any> {
    // Generate dummy analytics data
    return {
      fabricReturns: {
        "Cotton": 12,
        "Viscose": 8,
        "Linen": 5,
        "Polyester": 15,
        "Silk": 3
      },
      fabricExchanges: {
        "Cotton": 7,
        "Viscose": 4,
        "Linen": 2,
        "Polyester": 9,
        "Silk": 1
      },
      returnReasons: {
        "Size too small": 35,
        "Size too large": 28,
        "Quality issues": 12,
        "Color mismatch": 8,
        "Fabric feel": 10,
        "Style preference": 7
      },
      sizeRecommendationAcceptance: {
        "2024-01": 78,
        "2024-02": 82,
        "2024-03": 85,
        "2024-04": 88,
        "2024-05": 91,
        "2024-06": 89,
        "2024-07": 93
      },
      sizingData: {
        golden: { S: 1, M: 2, L: 2, XL: 1 },
        actual: { S: 0.8, M: 2.1, L: 1.9, XL: 1.2 }
      }
    };
  }
}

// Initialize with database storage
const databaseStorage = new DatabaseStorage();

// Initialize sample data in database
async function initializeSampleData() {
  try {
    // Check if products already exist
    const existingProducts = await databaseStorage.getProducts();
    if (existingProducts.length > 0) {
      return; // Data already exists
    }

    // Create sample products from MemStorage
    const memStorage = new MemStorage();
    const sampleProducts = await memStorage.getProducts();
    
    for (const product of sampleProducts) {
      const { id, ...insertProduct } = product;
      await databaseStorage.createProduct(insertProduct as InsertProduct);
    }

    // Create default admin user
    try {
      const existingAdmin = await databaseStorage.getAdminByUsername("admin");
      if (!existingAdmin) {
        await databaseStorage.createAdmin({
          username: "admin",
          password: "admin123", // In production, use proper password hashing
          role: "admin"
        });
        console.log("Default admin user created: admin/admin123");
      }
    } catch (error) {
      console.log("Admin user may already exist");
    }

    // Create sample size recommendations and purchase history
    try {
      await databaseStorage.createSizeRecommendation({
        productId: 1,
        userId: "user123",
        recommendedSize: "M",
        reason: "Based on fabric stretchability and past purchases"
      });

      await databaseStorage.createPurchaseHistory({
        userId: "user123",
        productId: 1,
        size: "S",
        returned: true,
        returnReason: "Size too small"
      });
    } catch (error) {
      console.log("Sample analytics data may already exist");
    }
    
    console.log("Sample data initialized successfully");
  } catch (error) {
    console.error("Error initializing sample data:", error);
  }
}

export const storage = databaseStorage;

// Initialize sample data on startup
initializeSampleData();

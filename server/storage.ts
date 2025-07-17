import { users, products, cartItems, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem } from "@shared/schema";

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
    const product: Product = { ...insertProduct, id };
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
    const item: CartItem = { ...insertItem, id };
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

export const storage = new MemStorage();

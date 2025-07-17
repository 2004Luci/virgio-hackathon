import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CartItem } from "@shared/schema";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  const { data: cartItems } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
  });

  useEffect(() => {
    if (cartItems) {
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    }
  }, [cartItems]);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <img 
                src="https://cdn.shopify.com/oxygen-v2/23879/21990/45558/2073582/build/_assets/VirgioIcon-dark-LIXEJ3S2.svg" 
                alt="Virgio" 
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Info, Truck, DollarSign, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCartMutation = useMutation({
    mutationFn: async (data: { productId: number; size: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to bag",
        description: "Item has been added to your shopping bag",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to bag",
        variant: "destructive",
      });
    },
  });

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size before adding to bag",
        variant: "destructive",
      });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      size: selectedSize,
      quantity: 1,
    });
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: isWishlisted 
        ? "Item has been removed from your wishlist" 
        : "Item has been added to your wishlist",
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        {product.collection && (
          <h2 className="text-gray-600 text-sm mb-2">{product.collection}</h2>
        )}
        <h1 className="text-2xl lg:text-3xl font-bold text-black mb-4">{product.name}</h1>
        
        {/* Price */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-2xl font-bold text-black">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-lg text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
          {product.discountPercentage && (
            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">(Inclusive of all taxes)</p>
        
        {/* Cost per wear */}
        {product.costPerWear && (
          <div className="flex items-center space-x-2 mb-6">
            <Info className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Cost/Wear: ₹{product.costPerWear}</span>
          </div>
        )}
      </div>

      {/* Product Features */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>Relaxed fit</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>Lace-tie accents</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>High-low hem</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{product.sustainability || `${product.fabric} for light comfort`}</span>
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-medium text-black">Select Size</label>
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-black transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" />
            </svg>
            <span>Size Guide</span>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {product.sizes.map((size) => {
            const inventory = product.inventory as Record<string, number>;
            const isAvailable = inventory[size] > 0;
            
            return (
              <button
                key={size}
                onClick={() => isAvailable && setSelectedSize(size)}
                disabled={!isAvailable}
                className={`px-4 py-3 border rounded text-center transition-colors ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : isAvailable
                    ? 'border-gray-200 hover:border-black'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
        
        {product.modelInfo && (
          <p className="text-sm text-gray-500">{product.modelInfo}</p>
        )}
      </div>

      {/* Add to Cart Section */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Button 
            onClick={handleAddToBag}
            disabled={addToCartMutation.isPending || !selectedSize}
            className="flex-1 bg-black text-white py-4 px-8 font-medium hover:bg-gray-800 transition-colors"
          >
            {addToCartMutation.isPending ? "ADDING..." : "ADD TO BAG"}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            className="p-4 border border-gray-200 rounded hover:border-black transition-colors"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Delivery & Returns */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium text-black mb-4">Delivery & Returns</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-3">
            <Truck className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">Free Shipping above ₹1499</span>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">Cash on delivery available</span>
          </div>
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">15 Days hassle-free return/exchange</span>
          </div>
        </div>
      </div>
    </div>
  );
}

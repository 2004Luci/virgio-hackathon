import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Bell, ChevronRight } from "lucide-react";
import type { Product } from "@shared/schema";

interface AIInsightsProps {
  product: Product;
  selectedSize: string;
  onFindOutWhy: () => void;
}

export default function AIInsights({ product, selectedSize, onFindOutWhy }: AIInsightsProps) {
  const [email, setEmail] = useState("");
  const [showNotifyForm, setShowNotifyForm] = useState(false);

  // Get size recommendation for this product (using dummy user ID)
  const { data: recommendation } = useQuery({
    queryKey: ["/api/size-recommendation", product.id, "user123"],
  });

  const isOutOfStock = selectedSize && product.inventory[selectedSize] === 0;
  const recommendedSize = recommendation?.recommendedSize || "M";
  const shouldRecommendSizeUp = selectedSize && selectedSize !== recommendedSize;

  const handleNotifyMe = async () => {
    if (!email) return;
    
    try {
      const response = await fetch("/api/notification-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          size: selectedSize,
          email,
        }),
      });

      if (response.ok) {
        setShowNotifyForm(false);
        setEmail("");
        alert("You'll be notified when this size is back in stock!");
      }
    } catch (error) {
      console.error("Failed to sign up for notifications:", error);
    }
  };

  return (
    <Card className="border-blue-100 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-blue-900">AI Size Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Recommendation */}
        <div className="space-y-3">
          {shouldRecommendSizeUp ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Considering the fabric stretchability and based on your past purchases and returns, 
                    we recommend going with size <Badge variant="secondary" className="mx-1">{recommendedSize}</Badge> 
                    for optimal comfort.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-900">
                Perfect choice! Size {selectedSize || "M"} is ideal for you based on our AI analysis.
              </p>
            </div>
          )}

          {/* Out of Stock Notification */}
          {isOutOfStock && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-900 mb-2">
                  This size is currently unavailable
                </p>
                
                {!showNotifyForm ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNotifyForm(true)}
                    className="mr-2"
                  >
                    <Bell className="h-4 w-4 mr-1" />
                    Notify me
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleNotifyMe}>
                        Notify Me
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowNotifyForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-red-700 mt-2">
                  Meanwhile, check 'Find out why?' below for detailed analysis.
                </p>
              </div>
            </div>
          )}

          {/* Find Out Why Link */}
          <button
            onClick={onFindOutWhy}
            className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 font-medium group"
          >
            <span>Find out why?</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
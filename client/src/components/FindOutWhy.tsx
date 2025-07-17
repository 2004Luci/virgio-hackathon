import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, User, Shirt, RotateCcw } from "lucide-react";
import type { Product } from "@shared/schema";

interface FindOutWhyProps {
  product: Product;
}

export default function FindOutWhy({ product }: FindOutWhyProps) {
  // Simulate fabric stretchability based on fabric type
  const getStretchability = (fabric: string) => {
    const stretchMap: Record<string, number> = {
      "viscose": 85,
      "cotton": 45,
      "linen": 25,
      "polyester": 70,
      "silk": 40,
    };
    return stretchMap[fabric?.toLowerCase()] || 60;
  };

  const stretchability = getStretchability(product.fabric || "cotton");
  const isLowStretch = stretchability < 50;

  return (
    <div id="find-out-why" className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Out Why?</h2>
        <p className="text-gray-600">AI-powered analysis behind our size recommendation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fabric Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shirt className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Fabric Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Stretchability Rating</span>
                <Badge variant={isLowStretch ? "destructive" : "default"}>
                  {stretchability}%
                </Badge>
              </div>
              <Progress value={stretchability} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">
                {product.fabric} fabric - {isLowStretch ? "Low" : "High"} stretch
              </p>
            </div>
            
            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Material Composition</h4>
              <p className="text-xs text-gray-600">
                {product.materialComposition || `100% ${product.fabric}`}
              </p>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Fit Profile</h4>
              <p className="text-xs text-gray-600">
                {product.fit || "Regular fit"} - {isLowStretch ? "Consider sizing up" : "True to size"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Your Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Past Purchases</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Denim Jeans (Size S)</span>
                  <Badge variant="outline" className="text-xs">Returned</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Cotton Dress (Size M)</span>
                  <Badge variant="outline" className="text-xs">Kept</Badge>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Linen Top (Size M)</span>
                  <Badge variant="outline" className="text-xs">Kept</Badge>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Return Pattern</h4>
              <p className="text-xs text-gray-600">
                You returned denim items that ran small. Denim has low stretch similar to this {product.fabric} item.
              </p>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Size Preference</h4>
              <p className="text-xs text-gray-600">
                Based on successful purchases, you prefer a comfortable fit with slight room.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">AI Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-sm text-purple-900 mb-2">Recommendation Logic</h4>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• {product.fabric} fabric has {isLowStretch ? "limited" : "good"} stretch</li>
                <li>• You returned similar low-stretch items before</li>
                <li>• Size M provides optimal comfort for your preferences</li>
                <li>• 94% of similar customers agreed with this recommendation</li>
              </ul>
            </div>

            <div className="pt-2 border-t">
              <h4 className="font-medium text-sm mb-2">Confidence Score</h4>
              <div className="flex items-center space-x-2">
                <Progress value={94} className="flex-1 h-2" />
                <span className="text-sm font-medium">94%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                High confidence based on fabric analysis and your history
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <RotateCcw className="h-4 w-4" />
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why We Recommend This</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              We noted you returned your last denim jeans as they ran small. Since denim has low stretch (similar to this {product.fabric} item), 
              and based on your successful purchases in size M, our AI recommends sticking with size M for this {product.name}. 
              This size provides the comfortable fit you prefer while accounting for the fabric's limited stretch properties.
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              Our recommendation engine analyzed over 10,000 similar customer profiles and found that 94% of customers with 
              your purchase history and size preferences were satisfied with this recommendation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState } from "react";
import { ChevronDown, ChevronUp, DollarSign, Leaf, Calendar, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface CostOfWearingProps {
  product: Product;
}

export default function CostOfWearing({ product }: CostOfWearingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate cost per wear based on product price and estimated usage
  const price = product.price / 100; // Convert cents to dollars
  const estimatedWears = 50; // Base estimate
  const costPerWear = (price / estimatedWears).toFixed(2);
  
  // Estimate wash cycles based on fabric type
  const getWashCycles = (fabric: string) => {
    const washMap: Record<string, number> = {
      "viscose": 30,
      "cotton": 40,
      "linen": 35,
      "polyester": 60,
      "silk": 25,
    };
    return washMap[fabric?.toLowerCase()] || 40;
  };

  const estimatedWashCycles = getWashCycles(product.fabric || "cotton");
  const washCostPerCycle = 0.75; // Average cost including water, detergent, electricity
  const totalWashCost = (estimatedWashCycles * washCostPerCycle).toFixed(2);
  const totalCostOfOwnership = (price + parseFloat(totalWashCost)).toFixed(2);

  // Sustainability metrics
  const getSustainabilityScore = (fabric: string) => {
    const sustainabilityMap: Record<string, number> = {
      "viscose": 75,
      "cotton": 60,
      "linen": 90,
      "polyester": 40,
      "silk": 65,
    };
    return sustainabilityMap[fabric?.toLowerCase()] || 70;
  };

  const sustainabilityScore = getSustainabilityScore(product.fabric || "cotton");

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="font-medium text-gray-900">Cost of wearing this garment</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cost Per Wear */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-sm">Cost Per Wear</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${costPerWear}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Based on {estimatedWears} estimated wears
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {price < 100 ? "Great Value" : price < 200 ? "Good Value" : "Premium"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Wash Cycles */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-sm">Care Cost</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${totalWashCost}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {estimatedWashCycles} wash cycles @ ${washCostPerCycle} each
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    {product.fabric === "linen" ? "Delicate Care" : "Easy Care"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Total Cost of Ownership */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <CardTitle className="text-sm">Total Ownership</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${totalCostOfOwnership}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Purchase + care costs over lifespan
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    2-3 Year Lifespan
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Sustainability */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-sm">Sustainability</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{sustainabilityScore}%</div>
                <p className="text-xs text-gray-600 mt-1">
                  Environmental impact score
                </p>
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      sustainabilityScore > 80 ? "text-green-600" : 
                      sustainabilityScore > 60 ? "text-yellow-600" : "text-red-600"
                    }`}
                  >
                    {sustainabilityScore > 80 ? "Eco-Friendly" : 
                     sustainabilityScore > 60 ? "Moderate Impact" : "High Impact"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="mt-6 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Detailed Cost Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial Purchase Price</span>
                <span className="font-medium">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Care Costs</span>
                <span className="font-medium">${totalWashCost}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-medium">
                <span>Total Cost of Ownership</span>
                <span>${totalCostOfOwnership}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Cost Per Wear</span>
                <span className="font-bold">${costPerWear}</span>
              </div>
            </div>
          </div>

          {/* Sustainability Insights */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Sustainability Insights</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• {product.fabric} fabric is {sustainabilityScore > 70 ? "relatively" : "less"} eco-friendly</li>
              <li>• Estimated carbon footprint: {(price * 0.1).toFixed(1)} kg CO2</li>
              <li>• {product.fabric === "linen" ? "Biodegradable and renewable" : "Consider eco-friendly care practices"}</li>
              <li>• Proper care extends garment life by 40%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
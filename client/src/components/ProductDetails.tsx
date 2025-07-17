import type { Product } from "@shared/schema";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="mt-12 space-y-8">
      {/* Fabric & Product Details */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-xl font-bold text-black mb-6">Fabric & Product Details</h3>
        
        {/* Fabric Info */}
        {product.sustainability && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <img 
                src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/New_Image_Viscose.png" 
                alt={`${product.fabric} fabric texture`}
                className="w-16 h-16 rounded"
              />
              <div>
                <h4 className="font-medium text-black mb-2">{product.fabric}</h4>
                <p className="text-sm text-gray-600">{product.sustainability}</p>
              </div>
            </div>
          </div>
        )}

        {/* Fabric Properties */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Stretch</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Softness</span>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Transparency</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">Dyed with azo-free, non-toxic dyes; rigorously tested for color fastness and shrinkage!</p>

        {/* Product Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fabric</span>
              <span className="text-black">{product.fabric}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Colour</span>
              <span className="text-black">{product.color}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Print</span>
              <span className="text-black">{product.print}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fit</span>
              <span className="text-black">{product.fit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Features</span>
              <span className="text-black">{product.features}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Length</span>
              <span className="text-black">{product.length}</span>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        {product.careInstructions && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-black mb-2">Care Instructions</h4>
            <p className="text-sm text-gray-600">{product.careInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}

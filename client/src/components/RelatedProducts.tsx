import type { Product } from "@shared/schema";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <div className="mt-16">
      <h3 className="text-xl font-bold text-black mb-8">You may also like</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="space-y-2">
              {product.collection && (
                <h4 className="font-medium text-black">{product.collection}</h4>
              )}
              <p className="text-sm text-gray-600">{product.name}</p>
              <div className="flex items-center space-x-2">
                <p className="font-bold text-black">₹{product.price.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

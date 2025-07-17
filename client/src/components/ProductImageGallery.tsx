import { useState } from "react";
import type { Product } from "@shared/schema";

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={product.images[selectedImageIndex]} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {product.thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`flex-shrink-0 w-16 h-20 bg-gray-100 rounded border-2 overflow-hidden transition-colors ${
              selectedImageIndex === index 
                ? 'border-black' 
                : 'border-gray-200 hover:border-black'
            }`}
          >
            <img 
              src={thumbnail} 
              alt={`${product.name} view ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Header from "@/components/Header";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductDetails from "@/components/ProductDetails";
import RelatedProducts from "@/components/RelatedProducts";
import Footer from "@/components/Footer";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id ? parseInt(params.id) : 1; // Default to first product

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Update page title when product loads
  useEffect(() => {
    if (product) {
      document.title = `${product.collection ? product.collection + ' - ' : ''}${product.name} | Virgio`;
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const filteredRelatedProducts = relatedProducts?.filter(p => p.id !== product.id).slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery product={product} />
          <ProductInfo product={product} />
        </div>
        
        <ProductDetails product={product} />
        
        {filteredRelatedProducts.length > 0 && (
          <RelatedProducts products={filteredRelatedProducts} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Product } from "@shared/schema";

export default function HomePage() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Update page title for homepage
  useEffect(() => {
    document.title = "Virgio - The Only Good Fashion Company | Sustainable Women's Clothing";
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center space-y-8 px-4">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-black tracking-tight">
            The Only Good
            <br />
            Fashion Company
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Sustainable fashion for the modern woman. Discover our collection of ethically made clothing.
          </p>
          <button className="bg-black text-white px-8 py-4 text-lg font-medium hover:bg-gray-800 transition-colors">
            SHOP NOW
          </button>
        </div>
      </section>

      {/* Awards Banner */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097541.png?v=1752497884&width=100&crop=center" alt="Award 1" className="h-12 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/4979434_53bd383c-eb73-4755-aceb-2a369f07cd1b.png?v=1750414987&width=100&crop=center" alt="Award 2" className="h-12 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/dweb_banner.png?v=1751614396&width=100&crop=center" alt="Award 3" className="h-12 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097312.png?v=1749124157&width=100&crop=center" alt="Award 4" className="h-12 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/4979435_1.png?v=1750416840&width=100&crop=center" alt="Award 5" className="h-12 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/20796.png?v=1750407852&width=100&crop=center" alt="Award 6" className="h-12 object-contain mx-auto" />
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            This Isn't Trending. It's Leading.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.slice(0, 6).map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    {product.collection && (
                      <h3 className="text-lg font-semibold text-black">{product.collection}</h3>
                    )}
                    <p className="text-gray-600">{product.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-black">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                      {product.discountPercentage && (
                        <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            Got Plans? We've Got Outfits.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="aspect-square bg-white rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097485_336afecc-eb92-47ae-867b-93c136d338b1.png?v=1752571581&width=100&height=76&crop=center" alt="Workwear" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-xl font-semibold">Workwear</h3>
              <p className="text-gray-600">Professional pieces that work as hard as you do</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="aspect-square bg-white rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097486_0ae062b1-c097-4279-a0d6-be3bdf523c31.png?v=1752571577&width=100&height=75&crop=center" alt="Casual" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-xl font-semibold">Casual</h3>
              <p className="text-gray-600">Effortless everyday essentials</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="aspect-square bg-white rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097488_9911f065-e728-4cb0-9fc2-99e9269814e7.png?v=1752571577&width=100&height=75&crop=center" alt="Party" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-xl font-semibold">Party</h3>
              <p className="text-gray-600">Statement pieces for special occasions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-black">
            The Fashion Press Can't Stop. Neither Should You.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097239_fd73953e-968a-40ef-811b-d99ae1fc424c.png?v=1747845084&width=100&height=33&crop=center" alt="Press 1" className="h-8 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/ind_Desktop_0e4db958-dd38-4f07-9856-4b027e7c926b.png?v=1748336563&width=100&height=33&crop=center" alt="Press 2" className="h-8 object-contain mx-auto" />
            <img src="https://cdn.shopify.com/s/files/1/0785/1674/8585/files/Frame_48097244.png?v=1747821272&width=100&height=22&crop=center" alt="Press 3" className="h-8 object-contain mx-auto" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
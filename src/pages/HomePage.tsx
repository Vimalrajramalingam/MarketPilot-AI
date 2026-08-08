import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Store } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { OwnPickupSection } from '../components/OwnPickupSection';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  stores: Store[];
  userLocation: string;
  wishlist: string[];
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  onToggleWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onReserveProduct: (product: Product, store: Store) => void;
  onOpenAIModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  stores,
  userLocation,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onSelectProduct,
  onReserveProduct,
}) => {
  const navigate = useNavigate();

  // Selected 8 featured products for a single clean product grid
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <HeroBanner
        onSearch={(q, pickup) => {
          navigate(`/search?q=${encodeURIComponent(q)}${pickup ? '&pickup=nearby' : ''}`);
        }}
        onNavigateToPickup={() => navigate('/pickup')}
        userLocation={userLocation}
      />

      {/* 2. Categories Row */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white tracking-tight">Categories</h2>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
              className="bg-[#121625] border border-slate-800 hover:border-blue-500/50 p-4 rounded-xl cursor-pointer group transition text-center space-y-2 shadow-sm"
            >
              <div className="w-12 h-12 mx-auto rounded-lg overflow-hidden bg-[#0a0d16] p-1 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition duration-200"
                />
              </div>
              <h3 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition truncate">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section id="featured-products-section" className="max-w-7xl mx-auto px-4 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Featured Products</h2>
          <button
            onClick={() => navigate('/search')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={(product) => navigate(`/product/${product.id}`)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(p.id)}
            />
          ))}
        </div>
      </section>

      {/* 4. Own Pickup Section */}
      <OwnPickupSection
        stores={stores}
        products={products}
        onReserveProduct={onReserveProduct}
        userLocation={userLocation}
      />
    </div>
  );
};


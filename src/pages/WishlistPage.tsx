import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistPageProps {
  products: Product[];
  wishlist: string[];
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  onToggleWishlist: (productId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  const navigate = useNavigate();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          My Wishlist ({wishlistedProducts.length} Saved)
        </h1>
        <p className="text-xs text-slate-400">Items saved for quick 15-minute pickup or future purchase</p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-12 rounded-3xl text-center space-y-4 shadow-xl">
          <Heart className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-400">
            Tap the heart icon on any product card to save it for quick access later.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg transition hover:bg-blue-500"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={(prod) => navigate(`/product/${prod.id}`)}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

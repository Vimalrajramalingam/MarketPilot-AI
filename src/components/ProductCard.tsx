import React, { useState } from 'react';
import { Star, Zap, ShoppingCart, Heart, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const [imgError, setImgError] = useState(false);

  const discountText = product.discountPercentage > 0 ? `${product.discountPercentage}% OFF` : null;
  const pickupBadgeText = product.urgentPickup
    ? `Pickup in ${product.estimatedPickupTime || '15m'}`
    : product.pickupAvailable
    ? 'Pickup Available'
    : null;

  return (
    <div className="group bg-[#121625] rounded-xl border border-slate-800 hover:border-slate-700 transition duration-200 flex flex-col overflow-hidden relative shadow-sm hover:shadow-md">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {discountText && (
            <span className="bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
              {discountText}
            </span>
          )}
          {pickupBadgeText && !discountText && (
            <span className="bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-white" />
              {pickupBadgeText}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-full backdrop-blur-md transition pointer-events-auto border ${
            isWishlisted
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-black/50 border-slate-700/80 text-slate-300 hover:text-white hover:bg-black/70'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div
        onClick={() => onSelectProduct(product)}
        className="w-full h-48 bg-[#0b0e17] relative p-4 flex items-center justify-center cursor-pointer group-hover:bg-[#0f1322] transition"
      >
        {!imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain mx-auto group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80"
            alt={product.name}
            className="max-h-full max-w-full object-contain mx-auto group-hover:scale-105 transition duration-300"
          />
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 border-t border-slate-800/80">
        <div className="space-y-1">
          {/* Brand */}
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {product.brand}
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-slate-100 hover:text-blue-400 transition cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold pt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-slate-500 font-normal text-[11px]">({product.reviewCount})</span>
          </div>
          {/* Pickup nearby indicator */}
          {product.pickupAvailable && (
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 pt-0.5">
              <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>⚡ Pickup nearby</span>
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectProduct(product)}
              className="bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 font-semibold text-xs py-2 px-2 rounded-lg transition flex items-center justify-center gap-1"
            >
              <Zap className="w-3 h-3 text-blue-400 group-hover:text-white" />
              <span>Own Pickup</span>
            </button>

            <button
              onClick={() => onAddToCart(product, 'delivery')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs py-2 px-2 rounded-lg border border-slate-700 transition flex items-center justify-center gap-1"
            >
              <ShoppingCart className="w-3 h-3 text-slate-300" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


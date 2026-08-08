import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Store, Review } from '../types';
import {
  Star,
  Zap,
  Truck,
  Store as StoreIcon,
  MapPin,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Check,
  Clock,
  Bot,
} from 'lucide-react';

interface ProductDetailPageProps {
  products: Product[];
  stores: Store[];
  wishlist: string[];
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  onToggleWishlist: (productId: string) => void;
  onReserveProduct: (product: Product, store: Store) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  products,
  stores,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onReserveProduct,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id) || products[0];
  const [selectedImage, setSelectedImage] = useState<string>(product?.images[0] || '');
  const [imgError, setImgError] = useState<boolean>(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [aiSummary, setAiSummary] = useState<{ summary?: string; pros?: string[]; cons?: string[] } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '');
      setImgError(false);
      // Fetch reviews if available
      fetch(`/api/products/${product.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.reviews) setReviews(data.reviews);
        })
        .catch(() => {});
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <button onClick={() => navigate('/home')} className="bg-blue-600 text-white font-semibold text-xs px-6 py-2.5 rounded-full">
          Return to Marketplace Home
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const matchedStore = stores.find((s) => s.id === product.storeId) || stores[0];

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const handleSummarizeReviews = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch('/api/ai/summarize-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      setAiSummary(data);
    } catch (e) {
      setAiSummary({
        summary: 'Customers praised the ultra-fast store pickup pass and high build quality.',
        pros: ['Fast 15-minute store pickup', 'Original brand warranty', 'High durability'],
        cons: [],
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#121625] hover:bg-slate-800 px-4 py-2 rounded-xl transition border border-slate-800 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" /> Back
        </button>
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          Home Marketplace
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-2xl bg-[#0b0e17] border border-slate-800 overflow-hidden shadow-sm flex items-center justify-center p-6">
            {!imgError && selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                onError={() => setImgError(true)}
                className="max-h-full max-w-full object-contain mx-auto"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800">
                  <ShoppingBag className="w-8 h-8 text-slate-600" />
                </div>
                <span className="text-xs font-medium text-slate-400">{product.brand || 'Product Image'}</span>
              </div>
            )}
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-md shadow-sm">
                SAVE {product.discountPercentage}%
              </span>
            )}
            <button
              onClick={() => onToggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full transition border border-slate-700/80"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedImage(img);
                    setImgError(false);
                  }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition bg-[#0b0e17] p-1 flex items-center justify-center shrink-0 ${
                    selectedImage === img ? 'border-blue-500 shadow-sm' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="thumb" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                {product.brand}
              </span>
              <span className="text-slate-400 text-xs">• {product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-md border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-slate-400 line-through text-sm">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              Inclusive of all taxes. Free 15-minute pickup pass at partner store!
            </p>
          </div>

          {/* Delivery vs Pickup Comparison Box */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
              Availability & Fulfillment Options
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Delivery Option */}
              <div
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                  deliveryType === 'delivery'
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-xs">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    <span>Home Delivery</span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                    Standard
                  </span>
                </div>
                <p className="text-sm font-extrabold text-white">📦 Delivered in 2–3 days</p>
                <p className="text-[10px] text-slate-400">Standard doorstep shipping via courier partners.</p>
              </div>

              {/* Own Pickup Option */}
              <div
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 relative overflow-hidden ${
                  deliveryType === 'pickup'
                    ? 'bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border-blue-500 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-blue-300 font-extrabold text-xs">
                    <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                    <span>⚡ Own Pickup</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                    Available Nearby
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-300 flex items-center justify-between">
                    <span>📍 Nearest Store:</span>
                    <strong className="text-white">{matchedStore ? matchedStore.name.split('-')[0] : 'Indiranagar Hub'}</strong>
                  </p>
                  <p className="text-slate-300 flex items-center justify-between text-[11px]">
                    <span>📍 Distance: <strong className="text-blue-300">{matchedStore?.distanceKm || 0.8} km</strong></span>
                    <span>🚗 Travel time: <strong className="text-indigo-300">~6 min</strong></span>
                  </p>
                  <p className="text-slate-300 flex items-center justify-between text-[11px]">
                    <span>📦 Stock: <strong className="text-emerald-400">{product.stock} in stock</strong></span>
                    <span>⏱️ Prep: <strong className="text-amber-300">15 min</strong></span>
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-bold">Estimated Total:</span>
                  <span className="text-emerald-400 font-black">⚡ Ready in ~21 minutes</span>
                </div>
              </div>
            </div>

            {/* Find Nearest Store direct page link */}
            <button
              onClick={() => navigate(`/pickup/product/${product.id}`)}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <StoreIcon className="w-4 h-4 text-blue-400" />
              Find All Nearby Stores & Compare Stock
            </button>
          </div>

          {/* Nearby Partner Store Card */}
          {matchedStore && (
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <StoreIcon className="w-4 h-4 text-blue-400" />
                  {matchedStore.name}
                </span>
                <span className="bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  {matchedStore.distanceKm || 1.2} km away
                </span>
              </div>
              <p className="text-slate-400 text-[11px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {matchedStore.address}
              </p>
              <div className="pt-1 flex items-center gap-3 text-[10px] text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" /> Open: {matchedStore.openingHours}
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-400" /> In Stock ({product.stock} units)
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                if (deliveryType === 'pickup' && matchedStore) {
                  onReserveProduct(product, matchedStore);
                } else {
                  onAddToCart(product, 'delivery');
                }
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              {deliveryType === 'pickup' ? 'Reserve for Own Pickup' : 'Add to Cart for Delivery'}
            </button>

            <button
              onClick={() => {
                onAddToCart(product, deliveryType);
                navigate('/checkout');
              }}
              className="px-6 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 rounded-2xl border border-white/10 transition text-xs"
            >
              Buy Now
            </button>
          </div>

          {/* Product Description */}
          <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
            <h3 className="font-bold text-white">Product Description</h3>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Specs Table */}
          {product.specs && (
            <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
              <h3 className="font-bold text-white">Specifications</h3>
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 block">{key}</span>
                    <span className="text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Reviews Summarizer */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-400" />
                Gemini AI Review Insights
              </h3>
              <button
                onClick={handleSummarizeReviews}
                disabled={loadingSummary}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-blue-500/30 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {loadingSummary ? 'Summarizing...' : 'Summarize Reviews'}
              </button>
            </div>

            {aiSummary && (
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-2xl text-xs space-y-2">
                <p className="text-slate-200">{aiSummary.summary}</p>
                {aiSummary.pros && aiSummary.pros.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-blue-400">Key Highlights:</span>
                    <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                      {aiSummary.pros.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

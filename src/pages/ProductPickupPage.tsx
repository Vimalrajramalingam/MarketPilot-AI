import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Store, CartItem } from '../types';
import {
  UserLocation,
  DEFAULT_USER_LOCATION,
  POPULAR_LOCATIONS,
  rankStoresForProduct,
  PickupSortOption,
  StoreOption,
  getGoogleMapsDirectionsUrl,
} from '../utils/locationUtils';
import { LocationModal } from '../components/LocationModal';
import {
  MapPin,
  Clock,
  Car,
  Zap,
  ShoppingBag,
  ArrowLeft,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

interface ProductPickupPageProps {
  products: Product[];
  stores: Store[];
  onReserveProduct: (product: Product, store: Store) => void;
  currentUserLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

export const ProductPickupPage: React.FC<ProductPickupPageProps> = ({
  products,
  stores,
  onReserveProduct,
  currentUserLocation,
  onSelectLocation,
}) => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === productId) || products[0];

  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [sortBy, setSortBy] = useState<PickupSortOption>('nearest');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <button
          onClick={() => navigate('/search')}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl"
        >
          Browse Products
        </button>
      </div>
    );
  }

  // Get ranked store options using active user location GPS
  const storeOptions: StoreOption[] = rankStoresForProduct(
    product,
    stores,
    products,
    currentUserLocation,
    radiusKm,
    sortBy
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-300 border border-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
              <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
              LOCATION-BASED OWN PICKUP
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Find It Nearby. Get It Today.
            </h1>
            <p className="text-xs text-slate-400">
              Don't wait 2–3 days for delivery. Pick up directly at a local store in about 1 hour.
            </p>
          </div>
        </div>

        {/* Location Selector Pill */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 pl-3 rounded-2xl">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Your Location</p>
              <p className="text-xs font-bold text-white max-w-[160px] truncate">
                {currentUserLocation.name}
              </p>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="ml-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* Requested Product Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/30 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={product.images[0]}
            alt={product.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80';
            }}
            className="w-16 h-16 rounded-2xl object-cover bg-black/40 border border-white/10 shrink-0"
          />
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
              {product.brand} • {product.category}
            </span>
            <h2 className="text-base font-extrabold text-white">{product.name}</h2>
            <p className="text-xs text-slate-400">
              MRP: <span className="text-white font-extrabold text-sm">₹{product.price.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[10px]">Standard Delivery:</span>
            <span className="text-slate-300 font-bold">📦 2–3 Days</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-left text-xs">
            <span className="text-blue-400 font-bold block text-[10px]">Own Pickup:</span>
            <span className="text-emerald-400 font-black">⚡ Ready Today (~15m)</span>
          </div>
        </div>
      </div>

      {/* Filter & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
        {/* Search Radius Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-blue-400" /> Search Radius:
          </span>
          {[5, 10, 20].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                radiusKm === r
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        {/* Sort Filter Options */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" /> Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as PickupSortOption)}
            className="bg-slate-900 border border-white/10 rounded-xl text-xs font-bold text-white px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="nearest">Nearest Distance</option>
            <option value="fastest">Fastest Pickup</option>
            <option value="cheapest">Lowest Price</option>
            <option value="highest_rated">Highest Rated Store</option>
          </select>
        </div>
      </div>

      {/* Store Results Section */}
      {storeOptions.length === 0 ? (
        /* NO AVAILABLE STORE FALLBACK */
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-10 rounded-3xl text-center space-y-6 shadow-xl max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">No Nearby Stores Have Stock Within {radiusKm} km</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find a partner store with immediate stock within {radiusKm} km of {currentUserLocation.name}. Try expanding your search radius or choose home delivery.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {radiusKm < 20 && (
              <button
                onClick={() => setRadiusKm(radiusKm === 5 ? 10 : 20)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-lg shadow-blue-600/30"
              >
                Expand Search Radius to {radiusKm === 5 ? '10 km' : '20 km'}
              </button>
            )}
            <button
              onClick={() => navigate('/checkout')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-2xl transition border border-white/10"
            >
              Show Home Delivery Options (2-3 Days)
            </button>
          </div>
        </div>
      ) : (
        /* STORE CARDS GRID */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Found <strong className="text-white">{storeOptions.length} stores</strong> with ready stock within {radiusKm} km
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Stores Open Now
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {storeOptions.map((opt) => {
              const mapsUrl = getGoogleMapsDirectionsUrl(
                currentUserLocation.lat,
                currentUserLocation.lng,
                opt.store.lat,
                opt.store.lng,
                opt.store.name,
                opt.store.address,
                currentUserLocation.address || currentUserLocation.name
              );

              return (
                <div
                  key={opt.store.id}
                  className={`p-6 rounded-3xl border transition shadow-xl relative space-y-4 ${
                    opt.isBestOption
                      ? 'bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border-blue-500 shadow-blue-900/20'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Badge for Best Match */}
                  {opt.isBestOption && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] px-3.5 py-1 rounded-full shadow-lg">
                      ⭐ BEST PICKUP OPTION — NEAREST & FASTEST
                    </div>
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Store Info */}
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{opt.store.name}</h3>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          ⭐ {opt.store.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        {opt.store.address}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>🕒 Hours: {opt.store.openingHours}</span>
                        <span>📞 {opt.store.phone}</span>
                      </p>
                    </div>

                    {/* Price & Stock Badge */}
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Store Price</p>
                      <p className="text-xl font-black text-white">₹{opt.price.toLocaleString('en-IN')}</p>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          opt.stock > 3
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        📦 {opt.stock} in stock
                      </span>
                    </div>
                  </div>

                  {/* Distance & Travel Time Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 border border-white/10 p-3 rounded-2xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
                      <span className="font-extrabold text-blue-300 flex items-center gap-1">
                        📍 {opt.distanceKm} km away
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Drive Time</span>
                      <span className="font-extrabold text-indigo-300 flex items-center gap-1">
                        🚗 ~{opt.driveTimeMins} min
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Prep Time</span>
                      <span className="font-extrabold text-emerald-300 flex items-center gap-1">
                        ⏱️ {opt.prepTimeMins} min
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Estimated Total</span>
                      <span className="font-black text-amber-300 flex items-center gap-1">
                        ⚡ ~{opt.totalTimeMins} minutes
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={getGoogleMapsDirectionsUrl(
                          currentUserLocation.lat,
                          currentUserLocation.lng,
                          opt.store.lat,
                          opt.store.lng,
                          opt.store.name,
                          opt.store.address,
                          currentUserLocation.address || currentUserLocation.name
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 font-bold text-xs px-3.5 py-2.5 rounded-2xl transition flex items-center gap-1.5 border border-blue-500/40 shadow-md"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        📍 Live GPS Directions
                      </a>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-[11px] px-3 py-2.5 rounded-2xl transition flex items-center gap-1 border border-white/10"
                      >
                        Map Coordinates ({currentUserLocation.lat.toFixed(3)}, {currentUserLocation.lng.toFixed(3)})
                      </a>
                    </div>

                    <button
                      onClick={() => onReserveProduct(opt.product, opt.store)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-6 py-3 rounded-2xl transition shadow-xl shadow-blue-600/30 flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      Reserve & Pick Up Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentUserLocation}
        onSelectLocation={onSelectLocation}
      />
    </div>
  );
};


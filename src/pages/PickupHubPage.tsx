import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Store } from '../types';
import {
  UserLocation,
  DEFAULT_USER_LOCATION,
  POPULAR_LOCATIONS,
  rankStoresForProduct,
  getGoogleMapsDirectionsUrl,
} from '../utils/locationUtils';
import { LocationModal } from '../components/LocationModal';
import {
  Zap,
  MapPin,
  Search,
  Compass,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  Navigation,
  Clock,
  Store as StoreIcon,
} from 'lucide-react';

interface PickupHubPageProps {
  products: Product[];
  stores: Store[];
  onReserveProduct: (product: Product, store: Store) => void;
  currentUserLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
}

export const PickupHubPage: React.FC<PickupHubPageProps> = ({
  products,
  stores,
  onReserveProduct,
  currentUserLocation,
  onSelectLocation,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(5);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Filter products that support pickup
  const pickupProducts = products.filter((p) => p.pickupAvailable);

  const filteredProducts = pickupProducts.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              LOCATION-BASED OWN PICKUP HUB
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Need It Today? Don't Wait 2–3 Days.
            </h1>
            <p className="text-xs text-slate-300">
              Find partner vendor stores near you with real-time stock and pick up your items within about 1 hour.
            </p>
          </div>

          {/* Location Badge & Selector */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Current Pickup Location
                </span>
                <span className="text-xs font-extrabold text-white">{currentUserLocation.name}</span>
              </div>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-1.5 rounded-xl transition"
            >
              Change Location
            </button>
          </div>
        </div>

        {/* Search Bar & Radius Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="What do you need right now? (e.g., Power Bank, iPhone Charger, Adapter)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/20 pl-11 pr-4 py-3 rounded-2xl text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-between bg-slate-900/90 border border-white/20 px-4 py-2 rounded-2xl text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> Radius:
            </span>
            <div className="flex items-center gap-1">
              {[5, 10, 20].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadiusKm(r)}
                  className={`px-3 py-1 rounded-xl font-bold transition text-xs ${
                    radiusKm === r
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Products Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            In-Stock Products Ready For Pickup Near You
          </h2>
          <span className="text-xs text-slate-400">
            Showing items within <strong className="text-white">{radiusKm} km</strong>
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No products found for "{searchQuery}"</h3>
            <p className="text-xs text-slate-400">
              Try searching for another keyword or expand your radius.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const options = rankStoresForProduct(
                product,
                stores,
                products,
                currentUserLocation,
                radiusKm
              );

              const bestOpt = options[0];

              return (
                <div
                  key={product.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-3xl space-y-4 hover:border-blue-500/50 transition shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative flex items-center justify-center p-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80';
                        }}
                        className="max-h-full max-w-full object-contain"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Zap className="w-3 h-3 fill-white" /> Own Pickup Ready
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">
                        {product.brand}
                      </span>
                      <h3 className="font-extrabold text-white text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-base font-black text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Store match info */}
                    {bestOpt ? (
                      <div className="bg-black/40 border border-white/10 p-3 rounded-2xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400 text-[11px] truncate max-w-[180px]">
                            🏢 {bestOpt.store.name}
                          </span>
                          <span className="text-blue-300 font-extrabold text-[10px]">
                            {bestOpt.distanceKm} km away
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-300">
                          <span>🚗 Drive: ~{bestOpt.driveTimeMins} min</span>
                          <span className="text-amber-300 font-bold">
                            ⚡ Total: ~{bestOpt.totalTimeMins} min
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-2xl text-[11px] text-amber-300">
                        No partner stores within {radiusKm} km currently.
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/pickup/product/${product.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    Find Nearest Store <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentUserLocation}
        onSelectLocation={onSelectLocation}
      />
    </div>
  );
};


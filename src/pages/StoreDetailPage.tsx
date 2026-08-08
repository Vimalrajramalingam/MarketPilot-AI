import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, Product } from '../types';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { MapPin, Clock, Phone, Navigation, Zap, Star, ShieldCheck, ArrowLeft, ShoppingBag } from 'lucide-react';

interface StoreDetailPageProps {
  stores: Store[];
  products: Product[];
  onReserveProduct: (product: Product, store: Store) => void;
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({
  stores,
  products,
  onReserveProduct,
  onAddToCart,
}) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();

  const store = stores.find((s) => s.id === storeId) || stores[0];

  if (!store) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white">
        <h2 className="text-xl font-bold">Store Not Found</h2>
        <button
          onClick={() => navigate('/pickup')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl"
        >
          Back to Pickup Map
        </button>
      </div>
    );
  }

  const storeProducts = products.filter(
    (p) => p.storeId === store.id || p.vendorId === store.vendorId
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/pickup')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pickup Locations
        </button>
        <div className="text-xs text-slate-400">
          Home / Pickup / <span className="text-white font-bold">{store.name}</span>
        </div>
      </div>

      {/* Store Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900/80 to-indigo-900/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              15-MINUTE OWN PICKUP HUB
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{store.name}</h1>
            <p className="text-slate-300 text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              {store.address}, {store.pincode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
              target="_blank"
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 text-xs shadow-lg shadow-blue-600/30"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
          </div>
        </div>

        {/* Store Metadata Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400">Opening Hours</p>
              <p className="font-bold text-white">{store.openingHours}</p>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <Phone className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-[10px] text-slate-400">Store Contact</p>
              <p className="font-bold text-white">{store.phone}</p>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <p className="text-[10px] text-slate-400">Store Rating</p>
              <p className="font-bold text-white">{store.rating || 4.9} / 5.0</p>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] text-slate-400">Distance</p>
              <p className="font-bold text-white">{store.distanceKm || 1.2} km away</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Embed Container */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-3xl space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> Live Interactive Store Location
          </h3>
          <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/10">
            <GoogleMapEmbed lat={store.lat} lng={store.lng} storeName={store.name} />
          </div>
        </div>

        {/* Store In-Stock Products */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="font-extrabold text-white text-lg">
              Available Stock at {store.name}
            </h2>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              {storeProducts.length} Items Ready for Instant Pickup
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {storeProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white/5 border border-white/10 hover:border-blue-500/50 backdrop-blur-md p-4 rounded-2xl space-y-3 transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <h4
                      onClick={() => navigate(`/product/${p.id}`)}
                      className="font-bold text-white text-xs hover:text-blue-400 cursor-pointer transition line-clamp-2"
                    >
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{p.brand}</p>
                    <p className="text-blue-400 font-extrabold text-sm">
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => onReserveProduct(p, store)}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl transition shadow-md text-center"
                  >
                    Reserve Pickup
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(p, 'pickup');
                      navigate('/cart');
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

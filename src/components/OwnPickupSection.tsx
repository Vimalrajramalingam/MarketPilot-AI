import React from 'react';
import { Zap, ArrowRight, Store as StoreIcon, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, Store as StoreType } from '../types';

interface OwnPickupSectionProps {
  stores: StoreType[];
  products: Product[];
  onReserveProduct: (product: Product, store: StoreType) => void;
  userLocation: string;
}

export const OwnPickupSection: React.FC<OwnPickupSectionProps> = ({
  stores,
  products,
  onReserveProduct,
  userLocation,
}) => {
  const navigate = useNavigate();

  // Filter pickup-enabled product previews
  const pickupPreviews = products.filter((p) => p.pickupAvailable || p.urgentPickup).slice(0, 4);

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto text-slate-100">
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 rounded-3xl border border-blue-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              ⚡ NEED IT TODAY?
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Don't Wait 2–3 Days For Delivery.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Find the nearest partner store near <strong className="text-white">{userLocation}</strong> that has your item in stock right now and pick it up within about 1 hour.
            </p>
          </div>

          <button
            onClick={() => navigate('/pickup')}
            className="self-start md:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition flex items-center gap-2 shrink-0 shadow-xl shadow-blue-600/30"
          >
            <span>Find Products Near Me</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {pickupPreviews.map((prod) => (
            <div
              key={prod.id}
              onClick={() => navigate(`/pickup/product/${prod.id}`)}
              className="bg-black/40 rounded-2xl border border-white/10 p-4 hover:border-blue-500/50 transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-slate-900 rounded-xl shrink-0 p-1.5 flex items-center justify-center overflow-hidden border border-white/10">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    ⚡ 0.8 km • ~21 min
                  </span>
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition">
                    {prod.name}
                  </h4>
                  <div className="text-xs font-black text-white mt-0.5">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pickup/product/${prod.id}`);
                }}
                className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold py-2 rounded-xl transition text-center"
              >
                Find Store & Reserve
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

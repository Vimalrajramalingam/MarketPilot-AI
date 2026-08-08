import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/mockData';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
          <Layers className="w-3.5 h-3.5" />
          MARKETPLACE TAXONOMY
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          All Marketplace Categories
        </h1>
        <p className="text-xs text-slate-400">
          Browse verified multi-vendor inventories available for immediate Own Pickup or Home Delivery
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
            className="bg-white/5 border border-white/10 hover:border-blue-500/50 backdrop-blur-md rounded-3xl overflow-hidden cursor-pointer group transition shadow-xl space-y-4 p-5"
          >
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                {cat.itemCount}+ Products
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400">Pickup & Delivery Ready</p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition shadow-md">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

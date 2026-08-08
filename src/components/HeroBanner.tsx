import React, { useState } from 'react';
import { Search, MapPin, Zap, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onSearch: (query: string, pickupOnly: boolean) => void;
  onNavigateToPickup: () => void;
  userLocation: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onNavigateToPickup,
  userLocation,
}) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#0e1322] to-[#0a0c14] py-16 px-4 border-b border-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Shop Smart. <span className="text-blue-500">Pick Up Faster.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Find products online or collect them from nearby stores in{' '}
          <span className="text-white font-semibold">{userLocation}</span>.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => {
              const elem = document.getElementById('featured-products-section');
              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              else onSearch('', false);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-blue-600/20 transition active:scale-95"
          >
            Shop Now
          </button>
          <button
            onClick={onNavigateToPickup}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm px-8 py-3.5 rounded-full border border-slate-700 transition flex items-center gap-2 active:scale-95"
          >
            <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
            Find Nearby Stores
          </button>
        </div>

        {/* Integrated Quick Search */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products, brands, or store inventory..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#13182a] border border-slate-700/80 text-white placeholder-slate-400 text-sm pl-12 pr-28 py-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2 rounded-full transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};


import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES } from '../data/mockData';
import { Search, Filter, Store, Star, ArrowUpDown, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  products: Product[];
  wishlist: string[];
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  onToggleWishlist: (productId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  products,
  wishlist,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const pickupParam = searchParams.get('pickup') === 'nearby' || searchParams.get('pickup') === 'true';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [pickupOnly, setPickupOnly] = useState(pickupParam);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (pickupOnly && !p.pickupAvailable) return false;
      if (selectedCategory !== 'all' && !p.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, pickupOnly, selectedBrand, maxPrice, minRating, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      q: searchQuery,
      category: selectedCategory,
      pickup: pickupOnly ? 'nearby' : 'false',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Search Header Form */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-4 shadow-2xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, or categories..."
              className="w-full bg-white/5 text-white pl-10 pr-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setPickupOnly(!pickupOnly)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs transition flex items-center gap-2 ${
                pickupOnly
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4" />
              Pickup Only
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Main Filter Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              Filter Products
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
                setPickupOnly(false);
                setMaxPrice(150000);
                setMinRating(0);
                setSortBy('featured');
                setSearchParams({});
              }}
              className="text-[11px] text-slate-400 hover:text-white underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-200">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0e1220] text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-200">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#0e1220] text-white p-2.5 rounded-xl border border-white/10 focus:outline-none"
            >
              <option value="all">All Brands</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between font-semibold text-slate-200">
              <span>Max Price</span>
              <span className="text-blue-400">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="299"
              max="150000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 text-xs">
            <label className="font-semibold text-slate-200">Minimum Rating</label>
            <div className="flex gap-1.5">
              {[0, 4.0, 4.5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setMinRating(r)}
                  className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center gap-1 ${
                    minRating === r
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400" />
                  {r === 0 ? 'Any' : `${r}+`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Marketplace Results
              </h1>
              <p className="text-xs text-slate-400">
                Found {filteredProducts.length} items matching your filter preferences
              </p>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0e1220] text-white p-2 rounded-xl border border-white/10 focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center space-y-3">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">No products match your filters</h3>
              <p className="text-xs text-slate-400">Try broadening your search query or resetting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

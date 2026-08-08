import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  MapPin,
  Search,
  Bot,
  Bell,
  Heart,
  User as UserIcon,
  Store,
  ShieldCheck,
  Zap,
  CheckCircle,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { User, UserRole, AppNotification } from '../types';

interface NavbarProps {
  currentUser: User;
  onSelectRole: (role: UserRole) => void;
  onLogout?: () => void;
  cartCount: number;
  wishlistCount: number;
  notifications: AppNotification[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIModal: () => void;
  onOpenNotifications: () => void;
  onSearchSubmit: (query: string, pickupOnly: boolean) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  userLocation: string;
  onChangeLocation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  onLogout,
  cartCount,
  wishlistCount,
  notifications,
  onOpenCart,
  onOpenWishlist,
  onOpenAIModal,
  onOpenNotifications,
  onSearchSubmit,
  onNavigate,
  currentPage,
  userLocation,
  onChangeLocation,
}) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupFilter, setPickupFilter] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const isHome = location.pathname === '/home' || location.pathname === '/';
  const isCheckoutOrPayment = location.pathname === '/checkout' || location.pathname === '/payment';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim(), pickupFilter);
      onNavigate('search');
    }
  };

  // Minimal distraction-free Header for Checkout & Payment
  if (isCheckoutOrPayment) {
    return (
      <header className="sticky top-0 z-40 bg-[#0d111d]/95 backdrop-blur-md text-slate-100 border-b border-white/10 shadow-xl py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-extrabold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              MP
            </div>
            <div>
              <div className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MarketPilot <span className="text-blue-400 text-xs font-bold">AI</span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">100% Encrypted & Secure Checkout</span>
            <span className="sm:hidden">Secure Checkout</span>
          </div>

          <button
            onClick={() => onNavigate(location.pathname === '/payment' ? 'checkout' : 'cart')}
            className="text-xs text-slate-300 hover:text-white font-semibold transition flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{location.pathname === '/payment' ? 'Checkout' : 'Cart'}</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0a0c14]/90 backdrop-blur-md text-slate-100 border-b border-white/10 shadow-2xl">
      {/* Top Bar - USP & Role Switcher (ONLY shown on Home) */}
      {isHome && (
        <div className="bg-[#0f1423] px-4 py-1.5 text-xs text-slate-300 border-b border-white/10 relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-blue-400 font-medium">
              <Zap className="w-3.5 h-3.5 fill-blue-400" />
              Own Pickup: Find nearby store & pick up in 15 mins!
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline text-slate-300">
              ⚡ Flat ₹100 OFF on all Own Pickup orders (Use code: <strong className="text-blue-300">PICKUP100</strong>)
            </span>
          </div>

          {/* Quick Role Switcher for Testing/Role Navigation */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">Active Portal:</span>
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold border border-white/10 transition shadow-sm"
              >
                {currentUser.role === 'customer' && <UserIcon className="w-3.5 h-3.5 text-blue-400" />}
                {currentUser.role === 'vendor' && <Store className="w-3.5 h-3.5 text-emerald-400" />}
                {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                <span className="capitalize">{currentUser.role} Mode</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#131722] rounded-2xl shadow-2xl border border-slate-700/80 py-2 z-[100] text-slate-100 ring-1 ring-black/50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Persona
                  </div>
                  <button
                    onClick={() => {
                      onSelectRole('customer');
                      setRoleDropdownOpen(false);
                      onNavigate('home');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'customer' ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-blue-400" /> Customer App
                    </span>
                    {currentUser.role === 'customer' && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('vendor');
                      setRoleDropdownOpen(false);
                      onNavigate('vendor-dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'vendor' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-emerald-400" /> Vendor Dashboard
                    </span>
                    {currentUser.role === 'vendor' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('admin');
                      setRoleDropdownOpen(false);
                      onNavigate('admin-dashboard');
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'admin' ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin Dashboard
                    </span>
                    {currentUser.role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 border-t border-white/10 font-bold mt-1 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition duration-200">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MarketPilot
              </span>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider">
                AI
              </span>
            </div>
          </div>
        </button>

        {/* Location Selector */}
        <button
          onClick={onChangeLocation}
          className="hidden lg:flex items-center gap-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-slate-200 px-3.5 py-1.5 rounded-full text-xs transition backdrop-blur-sm"
          title="Click to update GPS location"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] text-green-400 font-medium">Pickup/Delivery Location</div>
            <div className="font-semibold text-white truncate max-w-[130px]">{userLocation}</div>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Ask AI or search laptops, chargers, gaming..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121625] hover:bg-[#161b2e] focus:bg-[#121625] border border-slate-700/80 focus:border-blue-500 text-slate-100 placeholder-slate-400 text-sm pl-10 pr-36 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition shadow-inner"
            />

            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              <label
                className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition select-none ${
                  pickupFilter
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={pickupFilter}
                  onChange={(e) => setPickupFilter(e.target.checked)}
                  className="sr-only"
                />
                <Store className="w-3 h-3 text-blue-400" />
                <span>Pickup</span>
              </label>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs px-3.5 py-1 rounded-full shadow-md shadow-blue-600/30 transition"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Right Actions (AI, Wishlist, Cart, Notifs, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-xs px-3.5 py-2 rounded-full shadow-lg shadow-blue-500/20 transition group border border-white/10"
          >
            <Bot className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition duration-200" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full relative transition border border-transparent hover:border-white/10"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full relative transition border border-transparent hover:border-white/10 flex items-center gap-1"
            title="Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full relative transition border border-transparent hover:border-white/10"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition"
              title="Account & Settings"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-blue-400/40"
              />
              <span className="hidden xl:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#131722] rounded-2xl shadow-2xl border border-slate-700/80 py-2 z-[100] text-slate-200 ring-1 ring-black/50 divide-y divide-white/10">
                <div className="px-4 py-2.5">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                    {currentUser.role} Mode
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition text-slate-200"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('orders');
                    }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition text-slate-200"
                  >
                    <Package className="w-4 h-4 text-slate-400" /> My Orders & QR Passes
                  </button>
                </div>

                <div className="py-1">
                  <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Portal Navigation
                  </div>
                  <button
                    onClick={() => {
                      onSelectRole('customer');
                      setUserMenuOpen(false);
                      onNavigate('home');
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'customer' ? 'text-blue-400 font-bold bg-blue-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-blue-400" /> Customer App
                    </span>
                    {currentUser.role === 'customer' && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('vendor');
                      setUserMenuOpen(false);
                      onNavigate('vendor-dashboard');
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'vendor' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-emerald-400" /> Vendor Dashboard
                    </span>
                    {currentUser.role === 'vendor' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectRole('admin');
                      setUserMenuOpen(false);
                      onNavigate('admin-dashboard');
                    }}
                    className={`w-full text-left px-4 py-1.5 text-xs flex items-center justify-between hover:bg-white/10 transition ${
                      currentUser.role === 'admin' ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Admin Dashboard
                    </span>
                    {currentUser.role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                </div>

                {onLogout && (
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-red-400 hover:bg-red-500/10 font-bold transition"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links depending on Role */}
          {currentUser.role === 'vendor' && (
            <button
              onClick={() => onNavigate('vendor-dashboard')}
              className={`hidden md:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                currentPage === 'vendor-dashboard'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-white/10 text-emerald-400 border-white/10 hover:bg-white/15'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Vendor Dashboard
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`hidden md:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                currentPage === 'admin-dashboard'
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-white/10 text-indigo-300 border-white/10 hover:bg-white/15'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Dashboard
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sub-header (Row 2: Home, Categories, Own Pickup, Deals, Orders) */}
      <nav className="bg-[#0b0e17] px-4 py-2 text-xs border-t border-slate-800 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center gap-8 text-slate-300 font-semibold">
          <button
            onClick={() => onNavigate('home')}
            className={`hover:text-blue-400 transition ${
              currentPage === 'home' || location.pathname === '/' || location.pathname === '/home'
                ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5'
                : 'text-slate-300'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`hover:text-blue-400 transition ${
              currentPage === 'categories' || location.pathname === '/categories'
                ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5'
                : 'text-slate-300'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onNavigate('pickup')}
            className={`flex items-center gap-1.5 hover:text-blue-400 transition ${
              currentPage === 'pickup' || location.pathname === '/pickup'
                ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5'
                : 'text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            <span>Own Pickup</span>
          </button>
          <button
            onClick={() => onNavigate('search')}
            className={`hover:text-blue-400 transition ${
              currentPage === 'search' || location.pathname === '/search'
                ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5'
                : 'text-slate-300'
            }`}
          >
            Deals
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className={`hover:text-blue-400 transition ${
              currentPage === 'orders' || location.pathname === '/orders'
                ? 'text-blue-400 font-bold border-b-2 border-blue-500 pb-0.5'
                : 'text-slate-300'
            }`}
          >
            Orders
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-3">
          <button
            onClick={onChangeLocation}
            className="w-full flex items-center gap-2 bg-slate-800 p-2.5 rounded-lg text-xs text-slate-200"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Location: {userLocation}</span>
          </button>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="bg-slate-800 p-2.5 rounded-lg text-left text-slate-200 hover:bg-slate-700"
            >
              🏠 Home Marketplace
            </button>
            <button
              onClick={() => {
                onNavigate('own-pickup');
                setMobileMenuOpen(false);
              }}
              className="bg-emerald-950 text-emerald-300 p-2.5 rounded-lg text-left font-bold"
            >
              🏪 Own Pickup Map
            </button>
            <button
              onClick={() => {
                onNavigate('urgent-products');
                setMobileMenuOpen(false);
              }}
              className="bg-rose-950 text-rose-300 p-2.5 rounded-lg text-left font-bold"
            >
              🔥 15-Min Urgent Need
            </button>
            <button
              onClick={() => {
                onNavigate('orders');
                setMobileMenuOpen(false);
              }}
              className="bg-slate-800 p-2.5 rounded-lg text-left text-slate-200 hover:bg-slate-700"
            >
              📦 Track Orders & QR
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

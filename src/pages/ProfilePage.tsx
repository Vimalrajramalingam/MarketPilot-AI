import React from 'react';
import { User, UserRole, Order } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, ShieldCheck, Store, Package, LogOut } from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  orders: Order[];
  onSelectRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  orders,
  onSelectRole,
  onLogout,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
        {/* User Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 pb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
            {currentUser.name.charAt(0)}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-extrabold text-white">{currentUser.name}</h1>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                {currentUser.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> {currentUser.email}
            </p>
            <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> {currentUser.phone || '+91 98765 43210'}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>

        {/* Portal Switching Quick Controls */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm">Switch Account Portal Mode</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => onSelectRole('customer')}
              className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                currentUser.role === 'customer'
                  ? 'bg-blue-600/20 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <UserIcon className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-bold text-xs">Customer App</p>
                <p className="text-[10px] text-slate-400">Shop & 15-min Pickup</p>
              </div>
            </button>

            <button
              onClick={() => onSelectRole('vendor')}
              className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                currentUser.role === 'vendor'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Store className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="font-bold text-xs">Vendor Portal</p>
                <p className="text-[10px] text-slate-400">Manage Products & Orders</p>
              </div>
            </button>

            <button
              onClick={() => onSelectRole('admin')}
              className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                currentUser.role === 'admin'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="font-bold text-xs">Admin Portal</p>
                <p className="text-[10px] text-slate-400">System Monitoring</p>
              </div>
            </button>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="space-y-3 text-xs border-t border-white/10 pt-6">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" /> Saved Delivery Addresses
          </h3>
          <div className="bg-black/30 border border-white/10 p-4 rounded-2xl space-y-1">
            <p className="font-bold text-white">Default Residence</p>
            <p className="text-slate-300">#42, 100ft Road, Indiranagar, Bengaluru, KA - 560038</p>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="space-y-3 text-xs border-t border-white/10 pt-6">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" /> Account Statistics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-extrabold text-blue-400">{orders.length}</span>
              <p className="text-[10px] text-slate-400 mt-1">Total Orders</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
              <span className="text-2xl font-extrabold text-emerald-400">
                {orders.filter((o) => o.fulfillmentType === 'pickup').length}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">15-Min Pickup Passes</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="text-2xl font-extrabold text-amber-400">₹100</span>
              <p className="text-[10px] text-slate-400 mt-1">Saved via Pickup Pass</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

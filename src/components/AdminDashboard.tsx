import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart2,
  Lock,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Vendor, User, Order, Product } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  vendors: Vendor[];
  orders: Order[];
  products: Product[];
  onApproveVendor: (vendorId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  vendors,
  orders,
  products,
  onApproveVendor,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'fraud' | 'analytics'>('overview');

  const totalMarketplaceSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const platformCommission = Math.round(totalMarketplaceSales * 0.05); // 5% marketplace commission
  const pendingVendors = vendors.filter((v) => !v.isApproved);

  const categoryDistribution = [
    { name: 'Mobiles & Acc', value: 45, color: '#10b981' },
    { name: 'Laptops & Gaming', value: 25, color: '#3b82f6' },
    { name: 'Audio & Wearables', value: 20, color: '#f59e0b' },
    { name: 'Urgent Essentials', value: 10, color: '#f43f5e' },
  ];

  const vendorPerformanceData = [
    { name: 'ABC Electronics', revenue: 845000, pickups: 340 },
    { name: 'XYZ Mobiles', revenue: 612000, pickups: 210 },
    { name: 'Tech World', revenue: 1450000, pickups: 580 },
    { name: 'Apex Gear', revenue: 380000, pickups: 120 },
  ];

  return (
    <div className="bg-slate-950 min-h-screen py-8 px-4 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-purple-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-xl border border-purple-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                MarketPilot Admin Control Room
                <span className="bg-purple-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
              </h1>
              <p className="text-xs text-purple-200">
                Multi-Vendor Marketplace Governance • Fraud Monitoring & Commission Tracking
              </p>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Platform Governance
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'vendors' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏪 Vendor Approvals
            {pendingVendors.length > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingVendors.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fraud')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'fraud' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Fraud & Risk Monitor
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">1 Flag</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-4 rounded-xl transition ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Marketplace Revenue Charts
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Gross Merchandise Value (GMV)</div>
                <div className="text-2xl font-black text-white">₹{totalMarketplaceSales.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">+22.8% WoW</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Platform Commission (5%)</div>
                <div className="text-2xl font-black text-emerald-400">₹{platformCommission.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-slate-400">Net platform revenue</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Approved Vendors</div>
                <div className="text-2xl font-black text-white">{vendors.length}</div>
                <div className="text-[11px] text-purple-400 font-semibold">{pendingVendors.length} Pending Approval</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Total Products Listed</div>
                <div className="text-2xl font-black text-white">{products.length}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">100% Verified Stores</div>
              </div>
            </div>

            {/* Recharts Vendor Revenue Bar Chart */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white">Top Vendor GMV & Pickup Volume</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vendorPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VENDOR APPROVALS */}
        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-400" />
              Vendor Registration Requests
            </h3>

            <div className="space-y-3">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={v.logo} alt={v.storeName} className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {v.storeName}
                        {v.isApproved ? (
                          <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                            Approved
                          </span>
                        ) : (
                          <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                            Pending Approval
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px]">{v.description}</p>
                    </div>
                  </div>

                  {!v.isApproved && (
                    <button
                      onClick={() => onApproveVendor(v.id)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1 shrink-0"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Vendor
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FRAUD MONITOR */}
        {activeTab === 'fraud' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                AI Fraud & Suspicious Listing Detector
              </div>
              <p className="text-xs text-slate-300">
                MarketPilot AI automatically scans for unnatural price drops, duplicate QR scans, or fake pickup locations.
              </p>

              <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>Flagged Alert #8921 - Unverified Store Location</span>
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded font-black">HIGH RISK</span>
                </div>
                <p className="text-slate-300">
                  Seller "Apex Mobile Accessories" listed 100 units of iPhone 15 at ₹2,999 (95% below market rate).
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-3 py-1.5 rounded-lg">
                    Freeze Vendor Account
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg">
                    Dismiss Warning
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS PIE CHART */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Marketplace Category Revenue Share</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

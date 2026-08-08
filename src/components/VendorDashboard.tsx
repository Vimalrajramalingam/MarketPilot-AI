import React, { useState } from 'react';
import {
  Store,
  Package,
  QrCode,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Zap,
  Search,
  Check,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Product, Order, User } from '../types';
import { VendorAITools } from './VendorAITools';

interface VendorDashboardProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (prodData: Partial<Product>) => void;
  onUpdateProduct: (id: string, prodData: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onVerifyQR: (qrCode: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onVerifyQR,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory' | 'ai'>('overview');
  const [qrInput, setQrInput] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Mobiles & Accessories');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImg, setNewProdImg] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80');
  const [newProdPickup, setNewProdPickup] = useState(true);

  // Filter products & orders for this vendor
  const vendorProducts = products.filter((p) => p.vendorId === 'ven_abc' || p.vendorId === currentUser.id);
  const vendorOrders = orders.filter((o) => o.vendorId === 'ven_abc' || o.vendorId === currentUser.id);

  const totalRevenue = vendorOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingPickupOrders = vendorOrders.filter((o) => o.deliveryType === 'pickup' && o.orderStatus !== 'PICKED_UP');
  const lowStockProducts = vendorProducts.filter((p) => p.stock <= p.lowStockThreshold);

  const salesChartData = [
    { month: 'Mon', revenue: 42000, pickups: 18 },
    { month: 'Tue', revenue: 58000, pickups: 24 },
    { month: 'Wed', revenue: 65000, pickups: 29 },
    { month: 'Thu', revenue: 84000, pickups: 38 },
    { month: 'Fri', revenue: 92000, pickups: 45 },
    { month: 'Sat', revenue: 110000, pickups: 52 },
    { month: 'Sun', revenue: 125000, pickups: 60 },
  ];

  const handleScanQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    onVerifyQR(qrInput.trim());
    setScanMessage(`Verified & Handed over order for QR: ${qrInput}`);
    setQrInput('');
    setTimeout(() => setScanMessage(null), 4000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;

    onAddProduct({
      name: newProdName,
      category: newProdCategory,
      price: parseFloat(newProdPrice),
      originalPrice: parseFloat(newProdPrice) * 1.3,
      stock: parseInt(newProdStock) || 10,
      lowStockThreshold: 3,
      images: [newProdImg],
      pickupAvailable: newProdPickup,
      urgentPickup: newProdPickup,
      estimatedPickupTime: '15 mins',
      brand: 'Vendor Brand',
      sku: `SKU-${Date.now()}`,
      vendorId: 'ven_abc',
      vendorName: 'ABC Electronics',
      storeId: 'store_abc_1',
      storeName: 'ABC Electronics - Indiranagar',
      rating: 5.0,
      reviewCount: 1,
    });

    setShowAddModal(false);
    setNewProdName('');
    setNewProdPrice('');
  };

  return (
    <div className="bg-slate-950 min-h-screen py-8 px-4 text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Vendor Header */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl border border-emerald-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                ABC Electronics Portal
                <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Verified Store
                </span>
              </h1>
              <p className="text-xs text-slate-400">Indiranagar Branch • Own Pickup Station Active</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-xl transition ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Analytics & Sales
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Products ({vendorProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏪 Orders & QR Scanner
            {pendingPickupOrders.length > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingPickupOrders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚠️ Inventory Alerts
            {lowStockProducts.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {lowStockProducts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'ai' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🤖 Vendor AI Hub
          </button>
        </div>

        {/* TAB 1: OVERVIEW & RECHARTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Total Revenue</div>
                <div className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">+18.4% from last week</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Total Vendor Orders</div>
                <div className="text-2xl font-black text-white">{vendorOrders.length}</div>
                <div className="text-[11px] text-sky-400 font-semibold">
                  {pendingPickupOrders.length} Ready for Store Pickup
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Active Products</div>
                <div className="text-2xl font-black text-white">{vendorProducts.length}</div>
                <div className="text-[11px] text-emerald-400 font-semibold">100% Pickup Enabled</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400 text-xs font-medium">Store Pickup Share</div>
                <div className="text-2xl font-black text-emerald-400">64%</div>
                <div className="text-[11px] text-slate-400">Average collection time: 12 mins</div>
              </div>
            </div>

            {/* Recharts Revenue Chart */}
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Weekly Revenue & Pickup Velocity</h3>
                  <p className="text-xs text-slate-400">Real-time breakdown of store pickup orders vs delivery</p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesChartData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendorProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 relative flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 truncate">
                      <div className="font-bold text-sm text-white truncate">{p.name}</div>
                      <div className="text-xs text-emerald-400 font-bold">₹{p.price.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Stock: <span className="text-white font-bold">{p.stock} units</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                      Pickup Enabled
                    </span>

                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & QR CODE SCANNER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Vendor QR Scanner Tool */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-emerald-500/30 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <QrCode className="w-5 h-5" />
                Store Counter QR Verification Terminal
              </div>
              <p className="text-xs text-slate-300">
                Enter or scan the customer's QR pickup token to instantly verify order authenticity and mark item as picked up.
              </p>

              <form onSubmit={handleScanQR} className="flex gap-2 max-w-lg">
                <input
                  type="text"
                  placeholder="Enter QR token (e.g. MP-QR-8921-ABC-STORE)..."
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  className="flex-1 bg-slate-950 text-white placeholder-slate-500 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-lg transition shrink-0"
                >
                  Verify QR
                </button>
              </form>

              {scanMessage && (
                <div className="bg-emerald-500/20 text-emerald-400 p-3 rounded-xl border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {scanMessage}
                </div>
              )}
            </div>

            {/* Vendor Orders List */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 bg-slate-900 border-b border-slate-800 font-bold text-xs text-slate-300 flex items-center justify-between">
                <span>All Store Orders ({vendorOrders.length})</span>
                <span className="text-emerald-400 font-normal text-[11px]">
                  Step-by-step: Accept ➔ Mark Ready ➔ Verify QR ➔ Complete Pickup
                </span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {vendorOrders.map((ord) => {
                  const status = ord.orderStatus || 'PLACED';
                  const isPickup = ord.deliveryType === 'pickup';

                  return (
                    <div key={ord.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="font-mono font-bold text-white flex items-center gap-2">
                          {ord.id}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              status === 'PICKED_UP'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : status === 'READY_FOR_PICKUP'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-amber-400/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {status}
                          </span>
                          {isPickup && (
                            <span className="bg-blue-600/30 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">
                              🏪 Own Pickup
                            </span>
                          )}
                        </div>
                        <div className="text-slate-300">
                          Customer: <strong className="text-white">{ord.customerName}</strong> ({ord.customerPhone})
                        </div>
                        <div className="text-slate-400">
                          Items: {ord.items.map((i) => i.product?.name || (i as any).productName).join(', ')}
                        </div>
                        {isPickup && (
                          <div className="text-[11px] text-amber-300 font-mono">
                            Pickup Deadline: ~30 minutes
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right space-y-1">
                          <div className="font-black text-emerald-400 text-sm">
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            QR Token: {ord.pickupQRCode || 'MP-PU-PASS'}
                          </div>
                        </div>

                        {/* Order Action Buttons for Vendor */}
                        {isPickup && status !== 'PICKED_UP' && (
                          <div className="flex items-center gap-1.5">
                            {(status === 'PLACED' || status === 'CONFIRMED') && (
                              <button
                                onClick={() => {
                                  onVerifyQR(ord.pickupQRCode || ord.id);
                                  setScanMessage(`Accepted & Preparing order #${ord.id}`);
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition"
                              >
                                [Accept]
                              </button>
                            )}

                            {status === 'PREPARING' && (
                              <button
                                onClick={() => {
                                  onVerifyQR(ord.pickupQRCode || ord.id);
                                  setScanMessage(`Marked order #${ord.id} as READY FOR PICKUP`);
                                }}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl transition"
                              >
                                [Mark Ready]
                              </button>
                            )}

                            {status === 'READY_FOR_PICKUP' && (
                              <button
                                onClick={() => {
                                  onVerifyQR(ord.pickupQRCode || ord.id);
                                  setScanMessage(`Verified QR & Completed pickup for order #${ord.id}`);
                                }}
                                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] px-3 py-1.5 rounded-xl transition shadow-md"
                              >
                                [Complete Pickup]
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INVENTORY ALERTS */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Low Stock & Threshold Alerts
            </h3>

            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-white text-sm">{p.name}</div>
                      <div className="text-amber-400 font-semibold">Only {p.stock} units remaining!</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onUpdateProduct(p.id, { stock: p.stock + 20 })}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl transition"
                  >
                    Restock +20 Units
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VENDOR AI HUB */}
        {activeTab === 'ai' && (
          <VendorAITools
            vendorId="ven_abc"
            onApplyGeneratedProduct={(pData) => {
              onAddProduct({
                name: pData.title,
                description: pData.description,
                price: pData.suggestedPrice || 999,
                stock: 15,
                category: 'Mobiles & Accessories',
                vendorId: 'ven_abc',
                vendorName: 'ABC Electronics',
                storeId: 'store_abc_1',
                pickupAvailable: true,
                urgentPickup: true,
                images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'],
              });
              setActiveTab('products');
            }}
          />
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 max-w-md w-full space-y-4">
            <h3 className="text-lg font-black text-white">Add Product to Store</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Ultra Fast Charger"
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="499"
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="10"
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pickupCheck"
                  checked={newProdPickup}
                  onChange={(e) => setNewProdPickup(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500"
                />
                <label htmlFor="pickupCheck" className="text-slate-200 font-medium cursor-pointer">
                  Enable 15-Minute Own Pickup at Store
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-slate-950 py-3 rounded-xl font-black"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { Package, Clock, QrCode, Store, Truck, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';

interface OrdersPageProps {
  orders: Order[];
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-400" />
          My Orders & Pickup Passes
        </h1>
        <p className="text-xs text-slate-400">
          Track real-time status of your Own Pickup passes and Home Deliveries
        </p>
      </div>

      {(!orders || orders.length === 0) ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-12 rounded-3xl text-center space-y-4 shadow-xl">
          <Package className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No active orders yet</h3>
          <p className="text-xs text-slate-400">Your placed orders and pickup QR passes will appear here.</p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg hover:bg-blue-500 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPickup = order.deliveryType === 'pickup' || (order as any).fulfillmentType === 'pickup';

            return (
              <div
                key={order.id}
                className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-4 shadow-xl hover:border-blue-500/30 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Order ID</span>
                    <p className="text-sm font-extrabold text-white">{order.id}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isPickup
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isPickup ? '🏪 Store Pickup' : '🚚 Home Delivery'}
                    </span>

                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
                      {(order.orderStatus || 'PLACED').replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => {
                    const name = item.product?.name || (item as any).productName || 'Product Item';
                    const img = item.product?.images?.[0] || (item as any).productImage || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=150&q=80';
                    const unitPrice = item.product?.price ?? (item as any).price ?? 0;
                    const qty = item.quantity || 1;

                    return (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=150&q=80';
                            }}
                            className="w-10 h-10 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white">{name}</p>
                            <p className="text-slate-400">
                              Qty: {qty} × ₹{unitPrice.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <span className="font-extrabold text-white">
                          ₹{(unitPrice * qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400">Total Paid: </span>
                    <span className="font-extrabold text-blue-400 text-sm">
                      ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPickup && (
                      <button
                        onClick={() => navigate(`/pickup/qr/${order.id}`)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                      >
                        <QrCode className="w-4 h-4" />
                        View Pickup QR Pass
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1 border border-white/10"
                    >
                      Track Status <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

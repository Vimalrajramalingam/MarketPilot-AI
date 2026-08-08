import React, { useState } from 'react';
import { Package, QrCode, MapPin, Clock, CheckCircle2, ChevronRight, Store, ArrowLeft, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { QRPickupModal } from './QRPickupModal';

interface OrdersViewProps {
  orders: Order[];
  onBackToHome: () => void;
  onVerifyQR: (qrCode: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onBackToHome, onVerifyQR }) => {
  const [selectedQROrder, setSelectedQROrder] = useState<Order | null>(null);

  return (
    <div className="bg-slate-950 min-h-screen py-10 px-4 text-slate-100">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Your Marketplace Orders & Passes</h1>
              <p className="text-xs text-slate-400">Track delivery status & access instant store pickup QR codes</p>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs px-3 py-1 rounded-full border border-emerald-500/30">
              {orders.length} Active Orders
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((ord) => {
              const isPickup = ord.deliveryType === 'pickup';
              const isPickedUp = ord.orderStatus === 'PICKED_UP';

              return (
                <div
                  key={ord.id}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="font-mono font-bold text-sm text-white flex items-center gap-2">
                        {ord.id}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isPickedUp
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-emerald-400">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Payment: {ord.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 truncate">
                          <div className="font-bold text-white truncate">{item.product.name}</div>
                          <div className="text-slate-400">Qty: {item.quantity} • ₹{item.product.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Status Stepper */}
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/80 text-xs space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-300">
                      <span>Fulfillment Mode: {isPickup ? '15-Min Own Pickup' : 'Home Delivery'}</span>
                      {isPickup && ord.pickupStore && (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Store className="w-3.5 h-3.5" /> {ord.pickupStore.name}
                        </span>
                      )}
                    </div>

                    {isPickup && (
                      <div className="pt-2 flex items-center justify-between">
                        <div className="text-slate-400 text-[11px]">
                          {isPickedUp
                            ? 'Collected successfully from store!'
                            : 'Order is packed & ready at store counter. Show QR pass.'}
                        </div>

                        <button
                          onClick={() => setSelectedQROrder(ord)}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg transition flex items-center gap-1 shrink-0"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          View QR Pass
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QR Code Modal Popup */}
      {selectedQROrder && (
        <QRPickupModal
          order={selectedQROrder}
          onClose={() => setSelectedQROrder(null)}
          onVerifyQR={onVerifyQR}
        />
      )}
    </div>
  );
};

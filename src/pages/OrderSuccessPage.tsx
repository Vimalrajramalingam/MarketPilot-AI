import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader';
import { CheckCircle, Zap, ArrowRight, ShoppingBag, MapPin, Package, QrCode } from 'lucide-react';

interface OrderSuccessPageProps {
  orders: Order[];
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orders }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id) || orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <CheckoutStepsHeader currentStep="success" />

      {/* Success Hero Card */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Payment & Order Confirmed!
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Order #{order?.id || 'ORD-2026-8921'} Placed
          </h1>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {order?.deliveryType === 'pickup'
              ? 'Your 15-minute Own Pickup QR pass is generated and ready for store counter verification.'
              : 'Your order has been sent to our fulfillment vendor and will arrive shortly.'}
          </p>
        </div>

        {/* Order Details Preview Box */}
        <div className="bg-black/40 border border-white/10 p-6 rounded-2xl text-left space-y-4 max-w-lg mx-auto text-xs">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-slate-400">Total Paid:</span>
            <span className="text-blue-400 font-extrabold text-base">
              ₹{order?.totalAmount?.toLocaleString('en-IN') || '499'}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-slate-400">Fulfillment Method:</span>
            <span className="font-bold text-white uppercase flex items-center gap-1">
              {order?.deliveryType === 'pickup' ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> Own Pickup (15-Min)
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5 text-blue-400" /> Standard Doorstep Delivery
                </>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Payment Method:</span>
            <span className="font-bold text-white uppercase">{order?.paymentMethod || 'UPI'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {order?.deliveryType === 'pickup' && (
            <button
              onClick={() => navigate(`/pickup/qr/${order.id}`)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" /> View 15-Min QR Pickup Pass
            </button>
          )}

          <button
            onClick={() => navigate(`/orders/${order?.id}`)}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
          >
            Track Order Status <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

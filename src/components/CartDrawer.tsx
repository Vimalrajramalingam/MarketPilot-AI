import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Zap, Truck, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onProceedToCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('PICKUP100'); // Default bonus

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon === 'PICKUP100' ? 100 : 0;
  const shippingFee = subtotal > 1000 || cartItems.some((i) => i.deliveryType === 'pickup') ? 0 : 49;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'PICKUP100') {
      setAppliedCoupon('PICKUP100');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-slate-100">
      {/* Drawer Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-400" />
          <h3 className="font-extrabold text-base text-white">Your Marketplace Cart ({cartItems.length})</h3>
        </div>

        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-300">Your cart is empty</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Browse products or search for nearby store stock to reserve in 15 minutes!
            </p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product.id}
              className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3 relative shadow-md"
            >
              <div className="flex gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 truncate">
                  <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                  <div className="text-emerald-400 font-extrabold text-xs mt-0.5">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        item.deliveryType === 'pickup'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {item.deliveryType === 'pickup' ? (
                        <>
                          <Zap className="w-3 h-3 fill-emerald-400" />
                          15m Own Pickup
                        </>
                      ) : (
                        <>
                          <Truck className="w-3 h-3" /> Home Delivery
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromCart(item.product.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded transition"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold text-white px-2">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Coupon Section */}
      {cartItems.length > 0 && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-4 text-xs">
          {/* Coupon Code Box */}
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Promo Code (Try: PICKUP100)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full bg-slate-900 text-white placeholder-slate-500 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-800 uppercase font-mono focus:outline-none focus:border-emerald-500"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-2 rounded-xl transition"
            >
              Apply
            </button>
          </form>

          {appliedCoupon && (
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-xl border border-emerald-500/20 text-[11px] font-bold flex items-center justify-between">
              <span>Code 'PICKUP100' Applied: ₹100 Flat Pickup Bonus!</span>
              <span>-₹100</span>
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Discount</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Shipping / Delivery Fee</span>
              <span>{shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}</span>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 font-black text-sm text-white">
              <span>Grand Total</span>
              <span className="text-lg text-emerald-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onProceedToCheckout();
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

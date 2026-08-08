import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Coupon } from '../types';
import { INITIAL_COUPONS } from '../data/mockData';
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  Zap,
  Truck,
  ArrowRight,
  ShieldCheck,
  Store,
  CheckCircle,
} from 'lucide-react';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
}) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const shipping = subtotal > 1000 || cart.some((i) => i.deliveryType === 'pickup') ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const found = INITIAL_COUPONS.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (found) {
      if (subtotal < found.minOrder) {
        setCouponError(`Minimum order amount for code ${found.code} is ₹${found.minOrder}`);
      } else {
        setAppliedCoupon(found);
      }
    } else {
      setCouponError('Invalid promo code. Try: PICKUP100 or WELCOME10');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-400">
            Explore our 15-minute Own Pickup & Home Delivery marketplace items.
          </p>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-2xl shadow-xl transition"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <CheckoutStepsHeader currentStep="cart" />

      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-400" />
            Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
          </h1>
          <p className="text-xs text-slate-400">Review items and choose delivery or pickup pass</p>
        </div>
        <button
          onClick={onClearCart}
          className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-20 h-20 rounded-2xl object-cover bg-black/40 border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    {item.deliveryType === 'pickup' ? '🏪 Store Pickup Pass' : '🚚 Home Delivery'}
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.product.name}</h3>
                  <p className="text-xs text-slate-400">{item.product.vendorName}</p>
                  <p className="text-sm font-black text-white">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-300 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    className="p-1 hover:bg-white/10 rounded-lg text-slate-300 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-blue-400">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                  <button
                    onClick={() => onRemoveFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
            Order Summary
          </h2>

          {/* Coupon Form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" /> Apply Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. PICKUP100"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 text-white text-xs px-3 py-2 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
            {appliedCoupon && (
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Code '{appliedCoupon.code}' applied! (-₹{discount})
              </p>
            )}
          </form>

          {/* Price Calculations */}
          <div className="space-y-2 text-xs border-t border-b border-white/10 py-4">
            <div className="flex justify-between text-slate-300">
              <span>Bag Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-300">
              <span>Convenience / Delivery Fee</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>

            <div className="flex justify-between font-extrabold text-white text-base pt-2">
              <span>Total Payable</span>
              <span className="text-blue-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-xs"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

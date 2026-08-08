import React, { useState } from 'react';
import { ShoppingBag, MapPin, Zap, Truck, CheckCircle, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { CartItem, User, Order, Store } from '../types';
import { FlipCardPayment } from './FlipCardPayment';

interface CheckoutViewProps {
  cartItems: CartItem[];
  currentUser: User;
  onCompleteOrder: (newOrder: Order) => void;
  onBackToShopping: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  currentUser,
  onCompleteOrder,
  onBackToShopping,
}) => {
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('pickup');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = deliveryType === 'pickup' ? 100 : 0; // Flat ₹100 pickup bonus
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const handlePaymentSubmit = async (method: 'upi' | 'card' | 'cod' | 'razorpay') => {
    setIsProcessing(true);

    try {
      const mockPickupStore: Store = {
        id: 'store_abc_1',
        vendorId: 'ven_abc',
        name: 'ABC Electronics - Indiranagar Store',
        address: '100 Feet Road, Indiranagar, Bengaluru',
        pincode: '560038',
        lat: 12.9716,
        lng: 77.5946,
        phone: '+91 80 2525 9900',
        openingHours: '10:00 AM - 09:30 PM',
        pickupEnabled: true,
        rating: 4.8,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          deliveryType,
          pickupStore: deliveryType === 'pickup' ? mockPickupStore : undefined,
          shippingAddress: {
            street: address,
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode,
          },
          paymentMethod: method,
          customer: currentUser,
        }),
      });

      const newOrder = await res.json();
      setIsProcessing(false);
      onCompleteOrder(newOrder);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 text-slate-100 relative z-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={onBackToShopping}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md transition border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketplace Checkout</h1>
            <p className="text-xs text-slate-400">Select delivery preference & secure payment mode</p>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choose Fulfillment Option
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryType('pickup')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 backdrop-blur-md ${
                  deliveryType === 'pickup'
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold shrink-0">
                  <Zap className="w-5 h-5 fill-blue-400" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    15-Min Own Pickup
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      SAVE ₹100
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Reserve item & collect with QR pass at local store</p>
                </div>
              </div>

              <div
                onClick={() => setDeliveryType('delivery')}
                className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3 backdrop-blur-md ${
                  deliveryType === 'delivery'
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Home Delivery</div>
                  <p className="text-xs text-slate-400 mt-0.5">Delivered to address within 2-3 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Address & Contact Info */}
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-3 text-xs backdrop-blur-sm">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              {deliveryType === 'pickup' ? 'Contact Details for Store QR Pass' : 'Shipping Address'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white/5 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-white/5 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Mobile Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 text-white p-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3D Flip Card & Payment Form */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              Secure Payment Gateway
            </h3>

            <FlipCardPayment
              totalAmount={totalAmount}
              deliveryType={deliveryType}
              onSubmitPayment={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

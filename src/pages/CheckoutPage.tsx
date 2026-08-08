import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Store } from '../types';
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader';
import {
  MapPin,
  Phone,
  User as UserIcon,
  Store as StoreIcon,
  Truck,
  Zap,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  stores: Store[];
  onProceedToPayment: (checkoutData: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    pincode: string;
    fulfillmentType: 'delivery' | 'pickup';
    selectedStoreId?: string;
  }) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  stores,
  onProceedToPayment,
}) => {
  const navigate = useNavigate();

  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('pickup');
  const [selectedStoreId, setSelectedStoreId] = useState(stores[0]?.id || '');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addressLine, setAddressLine] = useState('#42, 100ft Road, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onProceedToPayment({
      fullName,
      phone,
      addressLine,
      city,
      pincode,
      fulfillmentType,
      selectedStoreId: fulfillmentType === 'pickup' ? selectedStoreId : undefined,
    });
    navigate('/payment');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <CheckoutStepsHeader currentStep="checkout" />

      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-blue-400" />
          Checkout & Fulfillment Details
        </h1>
        <p className="text-xs text-slate-400">
          Choose where you want to collect your order or deliver
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Details */}
        <div className="md:col-span-7 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-6 shadow-xl">
          {/* Fulfillment Switcher */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-3.5 rounded-2xl border-2 transition text-left flex flex-col gap-1 ${
                  fulfillmentType === 'pickup'
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-400 fill-blue-400" /> 15-Min Own Pickup
                </span>
                <span className="text-[10px] text-slate-300">Pick up directly at partner store</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-3.5 rounded-2xl border-2 transition text-left flex flex-col gap-1 ${
                  fulfillmentType === 'delivery'
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-400" /> Home Delivery
                </span>
                <span className="text-[10px] text-slate-300">Doorstep shipping in 2-3 days</span>
              </button>
            </div>
          </div>

          {/* Store Selection if Pickup */}
          {fulfillmentType === 'pickup' && (
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-200 flex items-center gap-1.5">
                <StoreIcon className="w-4 h-4 text-blue-400" /> Choose Pickup Store
              </label>
              <select
                value={selectedStoreId}
                onChange={(e) => setSelectedStoreId(e.target.value)}
                className="w-full bg-[#0e1220] text-white p-3 rounded-2xl border border-white/10 focus:outline-none"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.distanceKm || 1.2} km away)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-white border-b border-white/10 pb-2">
              Contact & Address Details
            </h3>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {fulfillmentType === 'delivery' && (
              <>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 text-xs"
          >
            <span>Continue to Payment Options</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Order Summary */}
        <div className="md:col-span-5 bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">
            Review Order Items ({cart.length})
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((i) => (
              <div key={i.product.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={i.product.images[0]}
                    alt={i.product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-10 h-10 rounded-xl object-cover bg-black/40"
                  />
                  <div>
                    <p className="font-bold text-white truncate max-w-[150px]">{i.product.name}</p>
                    <p className="text-slate-400">Qty: {i.quantity}</p>
                  </div>
                </div>
                <span className="font-extrabold text-white">
                  ₹{(i.product.price * i.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-1 text-xs">
            <div className="flex justify-between font-extrabold text-white text-base">
              <span>Subtotal</span>
              <span className="text-blue-400">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[10px] text-slate-400">Taxes included. Secure checkout powered by Razorpay.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

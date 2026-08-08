import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import { UserLocation, getGoogleMapsDirectionsUrl } from '../utils/locationUtils';
import {
  Package,
  MapPin,
  Clock,
  QrCode,
  ArrowLeft,
  CheckCircle,
  Truck,
  Store,
  Phone,
  ShieldCheck,
  Navigation,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface OrderDetailPageProps {
  orders: Order[];
  currentUserLocation?: UserLocation;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ orders = [], currentUserLocation }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const order = (orders || []).find((o) => o.id === id) || orders[0];

  const [courierProgress, setCourierProgress] = useState(45); // percentage along route
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setCourierProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <button onClick={() => navigate('/orders')} className="text-blue-400 underline text-xs">
          Back to My Orders
        </button>
      </div>
    );
  }

  const isPickup = order.deliveryType === 'pickup' || (order as any).fulfillmentType === 'pickup';

  const timelineSteps = isPickup
    ? ['PLACED', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP']
    : ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  const currentStepIndex = timelineSteps.indexOf(order.orderStatus);

  const addressDisplay = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : order.shippingAddress
    ? `${(order.shippingAddress as any).addressLine || ''}, ${(order.shippingAddress as any).city || ''} ${(order.shippingAddress as any).pincode || ''}`
    : 'Store Pickup Location';

  const storeName = order.pickupStore?.name || (order as any).storeName || 'Partner Electronics Store';
  const storeLat = order.pickupStore?.lat || 10.9621;
  const storeLng = order.pickupStore?.lng || 78.0786;

  // Compute live courier lat/lng based on active user GPS
  const userLat = currentUserLocation?.lat ?? 10.9621;
  const userLng = currentUserLocation?.lng ?? 78.0786;
  const courierLat = storeLat + (userLat - storeLat) * (courierProgress / 100);
  const courierLng = storeLng + (userLng - storeLng) * (courierProgress / 100);

  const remainingDistNum = Math.max(0.2, Number((3.2 * (1 - courierProgress / 100)).toFixed(1)));
  const remainingDistanceKm = remainingDistNum.toFixed(1);
  const remainingMins = Math.max(2, Math.ceil(remainingDistNum * 3));

  const directionsUrl = getGoogleMapsDirectionsUrl(userLat, userLng, storeLat, storeLng);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </button>

      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl space-y-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              {isPickup ? '🏪 Store Pickup Order' : '🚚 Home Delivery Order'}
            </span>
            <h1 className="text-2xl font-extrabold text-white">Order #{order.id}</h1>
            <p className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {isPickup && (
            <button
              onClick={() => navigate(`/pickup/qr/${order.id}`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-xl transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Show Pickup QR Pass
            </button>
          )}
        </div>

        {/* Status Tracker */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Live Fulfillment Tracker
          </h2>

          <div className="flex items-center justify-between relative py-2">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-white/10 -translate-y-1/2 z-0" />
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= (currentStepIndex >= 0 ? currentStepIndex : 3);
              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      isCompleted
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                        : 'bg-slate-800 text-slate-500 border border-white/10'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center max-w-[70px] ${
                      isCompleted ? 'text-blue-300' : 'text-slate-500'
                    }`}
                  >
                    {step.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* REAL-TIME LIVE GPS MAP TRACKING PANEL */}
        <div className="bg-slate-900 border border-blue-500/30 p-5 rounded-3xl space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  {isPickup ? 'Store Pickup Navigation Map' : 'Live Delivery Courier Tracker'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isPickup
                    ? 'Route map to partner store location'
                    : 'Real-time GPS agent position on map'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 border border-white/10"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" /> Directions
              </a>

              {!isPickup && (
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Tracking GPS...' : 'Simulate Live Motion'}
                </button>
              )}
            </div>
          </div>

          {/* Embedded Map */}
          <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 relative">
            <GoogleMapEmbed
              lat={isPickup ? storeLat : courierLat}
              lng={isPickup ? storeLng : courierLng}
              customerLat={userLat}
              customerLng={userLng}
              storeName={isPickup ? storeName : 'Delivery Agent (En Route)'}
              storeAddress={isPickup ? order.pickupStore?.address : 'En Route to Delivery Location'}
              customerAddress={currentUserLocation?.address || currentUserLocation?.name}
            />

            {!isPickup && (
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span>GPS Live: Agent {courierProgress}% Completed</span>
              </div>
            )}
          </div>

          {/* Delivery Courier Agent Details */}
          {!isPickup && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/40 border border-white/10 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Assigned Courier Agent</span>
                <span className="font-extrabold text-white">Karthik Subramanian</span>
                <p className="text-[10px] text-slate-400">TVS iQube EV (TN 47 AZ 8821)</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Estimated Arrival</span>
                <span className="font-extrabold text-emerald-400">⚡ ~{remainingMins} minutes</span>
                <p className="text-[10px] text-slate-400">{remainingDistanceKm} km distance remaining</p>
              </div>

              <div className="flex items-center justify-end">
                <a
                  href="tel:+919840055443"
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Phone className="w-4 h-4" /> Call Delivery Agent
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Pickup Store or Delivery Address */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 text-xs">
          <h3 className="font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            {isPickup ? 'Pickup Store Location' : 'Delivery Address'}
          </h3>
          <p className="text-slate-300">{isPickup ? storeName : addressDisplay}</p>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-xs">Purchased Items</h3>
          <div className="space-y-2">
            {(order.items || []).map((item, idx) => {
              const name = item.product?.name || (item as any).productName || 'Product Item';
              const img = item.product?.images?.[0] || (item as any).productImage || 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=150&q=80';
              const unitPrice = item.product?.price ?? (item as any).price ?? 0;
              const qty = item.quantity || 1;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={img}
                      alt={name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="w-12 h-12 rounded-xl object-cover bg-black/40 border border-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white">{name}</h4>
                      <span className="text-slate-400">Qty: {qty}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-white">
                    ₹{(unitPrice * qty).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-400">Payment Method: </span>
            <span className="font-bold text-white uppercase">{order.paymentMethod || 'UPI'}</span>
            <span className="ml-2 text-emerald-400 font-bold">({order.paymentStatus || 'paid'})</span>
          </div>
          <div>
            <span className="text-slate-400">Grand Total: </span>
            <span className="text-lg font-extrabold text-blue-400">
              ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

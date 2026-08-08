import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import {
  QrCode,
  ArrowLeft,
  Store,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Navigation,
  Clock,
  Car,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/locationUtils';

interface QRPassPageProps {
  orders: Order[];
}

export const QRPassPage: React.FC<QRPassPageProps> = ({ orders = [] }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Live 30-minute countdown state
  const [timeLeftMins, setTimeLeftMins] = useState<number>(30);
  const [timeLeftSecs, setTimeLeftSecs] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftSecs((prevSecs) => {
        if (prevSecs > 0) return prevSecs - 1;
        setTimeLeftMins((prevMins) => {
          if (prevMins > 0) {
            return prevMins - 1;
          }
          clearInterval(interval);
          return 0;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const order = (orders || []).find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Pickup Pass Not Found</h2>
        <button
          onClick={() => navigate('/orders')}
          className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl"
        >
          Return to My Orders
        </button>
      </div>
    );
  }

  const reservationId = order.id.startsWith('MP-PU-')
    ? order.id
    : `MP-PU-${order.id.slice(-6).toUpperCase()}`;

  const qrCodeText = order.pickupQRCode || `MARKETPILOT-RESERVATION-${reservationId}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(reservationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storeName = order.pickupStore?.name || (order as any).storeName || 'ABC Electronics - Indiranagar';
  const storeAddress =
    order.pickupStore?.address || '100 Feet Road, Near Toit, Indiranagar, Bengaluru';
  const storeLat = order.pickupStore?.lat || 12.9784;
  const storeLng = order.pickupStore?.lng || 77.6408;

  const googleMapsUrl = getGoogleMapsDirectionsUrl(12.9716, 77.6412, storeLat, storeLng);

  const firstItem = order.items?.[0];
  const productName = firstItem?.product?.name || (firstItem as any)?.productName || 'iPhone 20W Charger';

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 px-4 py-2 rounded-xl transition border border-white/10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </button>

      {/* Reservation Pass Card */}
      <div className="bg-gradient-to-b from-blue-950 via-slate-900 to-black border border-blue-500/40 backdrop-blur-xl p-6 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Reservation Confirmation Header */}
        <div className="space-y-2 relative z-10 border-b border-white/10 pb-5">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3.5 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PRODUCT RESERVED
          </div>
          <h1 className="text-2xl font-black text-white">{productName}</h1>
          <p className="text-xs text-slate-300">
            Reserved at <strong className="text-white">{storeName}</strong>
          </p>
        </div>

        {/* Expiration Countdown Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-amber-300 font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-spin" /> Reservation Expires In:
          </span>
          <span className="font-black text-amber-300 font-mono text-sm">
            {String(timeLeftMins).padStart(2, '0')}:{String(timeLeftSecs).padStart(2, '0')}
          </span>
        </div>

        {/* Time & Distance Details Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 border border-white/10 p-3 rounded-2xl text-xs text-left">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Distance</span>
            <span className="font-extrabold text-blue-300">📍 0.8 km</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Travel Time</span>
            <span className="font-extrabold text-indigo-300">🚗 ~6 min</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Prep Time</span>
            <span className="font-extrabold text-emerald-300">⏱️ 15 min</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Estimated Total</span>
            <span className="font-black text-amber-300">⚡ ~21 min</span>
          </div>
        </div>

        {/* QR Code Pass Box */}
        <div className="bg-white p-5 rounded-3xl shadow-2xl mx-auto w-60 h-60 flex flex-col items-center justify-center border-4 border-blue-500 relative">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              qrCodeText
            )}`}
            alt="Pickup QR Pass"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Reservation ID & Copy Code */}
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center justify-between text-xs">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Reservation ID
            </span>
            <span className="text-sm font-black font-mono text-white">{reservationId}</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy ID'}
          </button>
        </div>

        {/* Store Info */}
        <div className="bg-black/40 border border-white/10 p-4 rounded-2xl text-left space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <Store className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{storeName}</span>
          </div>
          <p className="text-slate-400 text-[11px] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {storeAddress}
          </p>
        </div>

        {/* Required Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-2 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
          >
            <Navigation className="w-4 h-4" />
            Get Directions
          </a>

          <button
            onClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-2 rounded-2xl transition border border-white/10 flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            View QR Code
          </button>

          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-2 rounded-2xl transition border border-white/10 flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            View Order
          </button>
        </div>
      </div>
    </div>
  );
};

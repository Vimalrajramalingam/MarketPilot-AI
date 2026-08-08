import React, { useState } from 'react';
import { QrCode, Store, MapPin, Clock, CheckCircle, Navigation, X, Copy, Check, Zap } from 'lucide-react';
import { Order } from '../types';

interface QRPickupModalProps {
  order: Order;
  onClose: () => void;
  onVerifyQR: (qrCode: string) => void;
}

export const QRPickupModal: React.FC<QRPickupModalProps> = ({ order, onClose, onVerifyQR }) => {
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const qrCodeText = order.pickupQRCode || `MP-QR-${order.id.split('-')[2]}-STORE`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCodeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateScan = () => {
    setVerifying(true);
    setTimeout(() => {
      onVerifyQR(qrCodeText);
      setVerifying(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-md w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 p-2 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
            <QrCode className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black text-white">Pickup Pass & QR</h3>
          <p className="text-xs text-slate-300 mt-1">Show this QR code at store counter for instant handover</p>
        </div>

        {/* QR Display Container */}
        <div className="p-6 space-y-6 text-slate-100">
          <div className="bg-white p-6 rounded-2xl border-4 border-emerald-500/40 text-slate-950 flex flex-col items-center justify-center relative shadow-inner">
            {/* Simulated Animated Scanner Beam */}
            <div className="w-full h-1 bg-emerald-500/60 shadow-lg shadow-emerald-500 animate-pulse mb-3 rounded-full" />

            <div className="w-48 h-48 bg-slate-900 p-3 rounded-xl flex flex-col items-center justify-center text-white text-center shadow-lg">
              <QrCode className="w-32 h-32 text-emerald-400" />
              <div className="text-[10px] font-mono font-bold text-slate-400 mt-1 truncate max-w-full">
                {qrCodeText}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-800">{qrCodeText}</span>
              <button
                onClick={handleCopyCode}
                className="text-slate-600 hover:text-slate-900 p-1 rounded transition"
                title="Copy Token"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5 text-sm">
              <Store className="w-4 h-4 text-emerald-400" />
              {order.pickupStore?.name || 'Partner Store'}
            </div>
            <p className="text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              {order.pickupStore?.address}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-slate-300">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" /> Est. Ready: {order.pickupStore?.estimatedPickupTime || '15 mins'}
              </span>

              {order.pickupStore && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.pickupStore.lat},${order.pickupStore.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" /> Navigation
                </a>
              )}
            </div>
          </div>

          {/* Quick Vendor QR Verification Test Button */}
          {order.orderStatus !== 'PICKED_UP' ? (
            <button
              onClick={handleSimulateScan}
              disabled={verifying}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {verifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Verifying with Vendor...
                </div>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Simulate Vendor QR Scan (Verify Order)
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Order Verified & Picked Up!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

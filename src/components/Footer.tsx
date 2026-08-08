import React from 'react';
import { Zap, ShieldCheck, MapPin, Heart, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/5 backdrop-blur-md text-slate-400 border-t border-white/10 text-xs py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">MarketPilot AI</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            AI-powered hybrid multi-vendor marketplace connecting online buyers with immediate 15-minute local store pickup networks across India.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Core Features</h4>
          <ul className="space-y-2 text-slate-400">
            <li>15-Minute Own Pickup Engine</li>
            <li>Gemini AI Shopping Assistant</li>
            <li>Contactless Store QR Scanner</li>
            <li>Vendor Demand Forecasting</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Popular Hub Cities</h4>
          <ul className="space-y-2 text-slate-400">
            <li>Bengaluru (Indiranagar, Koramangala)</li>
            <li>Mumbai (Andheri East, Bandra)</li>
            <li>Delhi NCR (Gurugram, CP)</li>
            <li>Hyderabad (HITECH City)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">Trust & Security</h4>
          <p className="text-slate-400 leading-relaxed">
            100% verified local shops. 256-bit SSL encrypted payments via Razorpay, UPI & Cards.
          </p>
          <div className="mt-3 flex items-center gap-2 text-blue-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Guaranteed Genuine Warranty</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
        <div>© 2026 MarketPilot AI Inc. All rights reserved.</div>
        <div className="flex items-center gap-1">
          <span>Shop Smart. Pick Up Faster. Powered by AI.</span>
        </div>
      </div>
    </footer>
  );
};

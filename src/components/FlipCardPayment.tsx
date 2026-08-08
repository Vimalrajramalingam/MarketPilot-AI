import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, ShieldCheck, Zap, Smartphone, DollarSign } from 'lucide-react';

interface FlipCardPaymentProps {
  totalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  onSubmitPayment: (method: 'upi' | 'card' | 'cod' | 'razorpay') => void;
  isProcessing: boolean;
}

export const FlipCardPayment: React.FC<FlipCardPaymentProps> = ({
  totalAmount,
  deliveryType,
  onSubmitPayment,
  isProcessing,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'razorpay' | 'cod'>('card');
  const [isFlipped, setIsFlipped] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardHolder, setCardHolder] = useState('RAHUL SHARMA');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('•••');
  const [upiId, setUpiId] = useState('rahul@okaxis');

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
      {/* Method Tabs */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
            paymentMethod === 'card'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
            paymentMethod === 'upi'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>UPI / GPay</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('razorpay')}
          className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
            paymentMethod === 'razorpay'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Razorpay</span>
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('cod')}
          className={`py-2 px-1 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
            paymentMethod === 'cod'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>COD</span>
        </button>
      </div>

      {/* Credit / Debit Card 3D Flip Interface */}
      {paymentMethod === 'card' && (
        <div className="space-y-6">
          {/* 3D Flip Card Container */}
          <div className="w-full h-52 relative perspective-1000 group">
            <div
              className={`w-full h-full duration-500 transition-transform transform-style-3d relative rounded-2xl shadow-2xl cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* FRONT OF CARD */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-indigo-900 p-6 text-white flex flex-col justify-between shadow-2xl border border-emerald-400/30 backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-xs font-black tracking-widest text-emerald-200 uppercase">
                    MARKETPILOT SECURE CARD
                  </div>
                  <div className="w-10 h-7 bg-amber-400/80 rounded-md border border-amber-300 shadow-inner flex items-center justify-center text-[10px] font-bold text-slate-900">
                    CHIP
                  </div>
                </div>

                <div className="text-lg sm:text-xl font-mono tracking-widest font-bold my-2 text-white drop-shadow">
                  {cardNumber || '4532 •••• •••• 8921'}
                </div>

                <div className="flex justify-between items-end text-xs uppercase font-medium text-slate-200">
                  <div>
                    <div className="text-[9px] text-emerald-200">CARDHOLDER</div>
                    <div className="font-bold tracking-wider text-sm truncate max-w-[180px]">
                      {cardHolder || 'RAHUL SHARMA'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-emerald-200">EXPIRES</div>
                    <div className="font-bold font-mono text-sm">{expiry || '12/28'}</div>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-6 text-white flex flex-col justify-between shadow-2xl border border-slate-700 backface-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="w-full h-10 bg-slate-950 rounded -mx-6 mt-1" />

                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 text-right uppercase">CVV / CVC</div>
                  <div className="bg-white text-slate-900 font-mono font-bold text-right pr-4 py-1.5 rounded-lg text-sm tracking-widest shadow-inner">
                    {cvv || '•••'}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center">
                  256-bit AES Encrypted • MarketPilot Razorpay Gateway
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                onFocus={() => setIsFlipped(false)}
                placeholder="4532 8901 2345 8921"
                className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  onFocus={() => setIsFlipped(false)}
                  placeholder="RAHUL SHARMA"
                  className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="12/28"
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    placeholder="123"
                    className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPI Form */}
      {paymentMethod === 'upi' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Pay via Instant UPI App
            </div>
            <p className="text-slate-400">Supported: Google Pay, PhonePe, PayTM, BHIM UPI</p>

            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@upi or mobile number"
              className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* Razorpay Form */}
      {paymentMethod === 'razorpay' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Zap className="w-4 h-4 fill-sky-400" />
            Razorpay Secure Checkout Portal
          </div>
          <p className="text-slate-300">
            Clicking pay will launch the Razorpay modal supporting NetBanking, Wallets, and International Cards.
          </p>
        </div>
      )}

      {/* COD Form */}
      {paymentMethod === 'cod' && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-amber-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {deliveryType === 'pickup' ? 'Pay at Store Counter' : 'Cash on Delivery'}
          </div>
          <p className="text-slate-300">
            {deliveryType === 'pickup'
              ? 'Pay directly in cash or UPI when collecting your item at the store.'
              : 'Pay cash to delivery agent when order arrives at your address.'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={() => onSubmitPayment(paymentMethod)}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Order</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        256-bit SSL Encryption • Guaranteed Marketplace Return Protection
      </div>
    </div>
  );
};

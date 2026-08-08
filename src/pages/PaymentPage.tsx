import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order } from '../types';
import { FlipCardPayment } from '../components/FlipCardPayment';
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader';
import { ShieldCheck } from 'lucide-react';

interface PaymentPageProps {
  cart: CartItem[];
  onCompletePayment: (paymentMethod: 'card' | 'upi' | 'cod' | 'razorpay') => Promise<Order>;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({ cart, onCompletePayment }) => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handlePayNow = async (method: 'upi' | 'card' | 'cod' | 'razorpay') => {
    setProcessing(true);
    try {
      const createdOrder = await onCompletePayment(method);
      if (createdOrder) {
        navigate(`/order-success/${createdOrder.id}`);
      } else {
        navigate('/orders');
      }
    } catch (e) {
      navigate('/orders');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <CheckoutStepsHeader currentStep="payment" />

      <div className="border-b border-white/10 pb-4 text-center space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          MarketPilot Razorpay Gateway
        </h1>
        <p className="text-xs text-slate-400">
          256-bit encrypted SSL checkout • Instant 15-minute Own Pickup QR Pass Generation
        </p>
      </div>

      <FlipCardPayment
        totalAmount={subtotal}
        deliveryType={cart.some((i) => i.deliveryType === 'pickup') ? 'pickup' : 'delivery'}
        onSubmitPayment={handlePayNow}
        isProcessing={processing}
      />
    </div>
  );
};

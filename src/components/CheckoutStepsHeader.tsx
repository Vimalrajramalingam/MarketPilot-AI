import React from 'react';
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from 'lucide-react';

interface CheckoutStepsHeaderProps {
  currentStep: 'cart' | 'checkout' | 'payment' | 'success';
}

export const CheckoutStepsHeader: React.FC<CheckoutStepsHeaderProps> = ({ currentStep }) => {
  const steps = [
    { id: 'cart', label: '1. Cart', icon: ShoppingBag },
    { id: 'checkout', label: '2. Shipping & Pickup', icon: MapPin },
    { id: 'payment', label: '3. Payment', icon: CreditCard },
    { id: 'success', label: '4. Confirmed', icon: CheckCircle },
  ];

  const getStepIndex = (stepId: string) => {
    switch (stepId) {
      case 'cart':
        return 1;
      case 'checkout':
        return 2;
      case 'payment':
        return 3;
      case 'success':
        return 4;
      default:
        return 1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 -z-0" />
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentIndex;
          const isCompleted = stepNum < currentIndex;
          const Icon = s.icon;

          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition duration-300 ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/30'
                    : 'bg-[#121626] border border-white/10 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-extrabold transition ${
                  isActive ? 'text-blue-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

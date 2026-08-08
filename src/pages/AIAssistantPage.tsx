import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { Bot, Sparkles, Send, Zap, ShoppingBag, Lightbulb, UserCheck, Store, HelpCircle } from 'lucide-react';

interface AIAssistantPageProps {
  products: Product[];
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  userRole?: 'customer' | 'vendor' | 'admin';
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ products, onAddToCart, userRole = 'customer' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customer' | 'vendor'>(userRole === 'vendor' ? 'vendor' : 'customer');
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; recommendedProducts?: Product[]; advice?: string }>
  >([
    {
      role: 'assistant',
      text: 'Hello! I am MarketPilot AI, your intelligent assistant. I can answer questions for both Customers (product recommendations, store pickup details, price comparisons) and Vendors (QR verification, product listings, store pickup discounts, stock advice). How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const customerPrompts = [
    'Find gaming laptops under ₹1,20,000 for 15-min pickup',
    'Recommend fast USB-C chargers under ₹1,000',
    'How does 15-minute Own Pickup with QR Pass work?',
    'Best wireless noise cancelling headphones near me',
  ];

  const vendorPrompts = [
    'How do I verify customer QR codes at my store?',
    'How do I list new products and enable store pickup?',
    'How to boost sales with dynamic pickup discounts?',
    'How can I check low stock alerts for my inventory?',
  ];

  const handleSend = async (queryText?: string) => {
    const promptText = queryText || input;
    if (!promptText.trim()) return;

    const userMsg = { role: 'user' as const, text: promptText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/shopping-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          query: promptText,
          role: activeTab,
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || `Here is the information regarding your question:`,
          recommendedProducts: data.recommendedProducts && data.recommendedProducts.length > 0 ? data.recommendedProducts : undefined,
          advice: data.advice,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Thank you for asking: "${promptText}". MarketPilot AI helps customers find products with 15-minute Own Pickup and helps vendors manage inventory, scan QR codes, and boost store footfall!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
            <Bot className="w-4 h-4 text-blue-400" />
            GEMINI MARKETPLACE ASSISTANT
          </div>
          <h1 className="text-2xl font-extrabold text-white">MarketPilot AI Assistant</h1>
          <p className="text-xs text-slate-400">
            AI-powered answers for Customer shopping queries & Vendor store management operations
          </p>
        </div>

        {/* Tab Toggle: Customer vs Vendor Mode */}
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'customer'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Customer Queries
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition ${
              activeTab === 'vendor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Vendor Queries
          </button>
        </div>
      </div>

      {/* Preset Prompts based on active mode */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-blue-400" /> Suggested Questions ({activeTab === 'customer' ? 'Customer Mode' : 'Vendor Mode'}):
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          {(activeTab === 'customer' ? customerPrompts : vendorPrompts).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-full transition flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl min-h-[420px] flex flex-col justify-between shadow-2xl space-y-6">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 text-xs ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] space-y-3 ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-black/40 text-slate-200 border border-white/10'
                }`}
              >
                <div className="leading-relaxed whitespace-pre-line">{m.text}</div>

                {m.advice && (
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium text-[11px] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{m.advice}</span>
                  </div>
                )}

                {m.recommendedProducts && m.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="font-bold text-blue-400 text-[11px] block">
                      Recommended Products:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0"
                            />
                            <div className="truncate">
                              <p className="font-bold text-white text-[11px] truncate max-w-[120px]">
                                {p.name}
                              </p>
                              <span className="text-blue-400 font-extrabold text-[11px]">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              onAddToCart(p, 'pickup');
                              navigate('/cart');
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shrink-0"
                            title="Add to Cart for Pickup"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-black/40 p-4 rounded-2xl text-slate-400 border border-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>MarketPilot Gemini AI is processing your question...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              activeTab === 'customer'
                ? 'Ask AI anything about products, prices, store pickup, or orders...'
                : 'Ask AI about vendor QR verification, stock alerts, listings, or sales growth...'
            }
            className="flex-1 bg-white/5 border border-white/10 text-white text-xs p-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold px-5 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-1.5 text-xs shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

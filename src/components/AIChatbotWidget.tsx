import React, { useState } from 'react';
import { Bot, Sparkles, Send, X, ShoppingBag, Zap, RefreshCw, ChevronRight, MessageSquare } from 'lucide-react';
import { Product } from '../types';

interface AIChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, deliveryType: 'delivery' | 'pickup') => void;
  userLocation: string;
  userRole?: 'customer' | 'vendor' | 'admin';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedProducts?: Product[];
  advice?: string;
  timestamp: string;
}

export const AIChatbotWidget: React.FC<AIChatbotWidgetProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
  userLocation,
  userRole = 'customer',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I'm MarketPilot AI, your smart shopping & local pickup assistant. Ask me any question as a customer (products, prices, store pickup) or vendor (QR verification, listings, stock advice).`,
      advice: `Try asking: "I need a gaming laptop under ₹80,000" or "How do I verify customer QR codes at my store?"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [budgetInput, setBudgetInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText?: string) => {
    const q = queryText || inputQuery.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/shopping-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          budget: budgetInput ? parseFloat(budgetInput) : undefined,
          userLocation,
          role: userRole,
        }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Here is the answer to your request:',
        recommendedProducts: data.recommendedProducts || [],
        advice: data.advice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'Thank you for asking! MarketPilot AI provides 15-minute store pickup for customers and full inventory management for vendors.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Gaming laptop under ₹80,000',
    `Urgent iPhone charger near ${userLocation}`,
    'Compare Sony WH-1000XM5 vs AirPods Pro',
    'Best gift items under ₹5,000',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#0e1220]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              MarketPilot AI Assistant
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            </h3>
            <p className="text-[10px] text-blue-300 font-medium">Powered by Gemini AI • Live Catalog Search</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-md backdrop-blur-md ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-blue-600/20'
                  : 'bg-white/10 text-slate-200 border border-white/10 rounded-bl-none'
              }`}
            >
              <div className="text-xs">{msg.text}</div>

              {/* Buying Advice */}
              {msg.advice && (
                <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] text-blue-300 font-medium flex items-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                  <span>{msg.advice}</span>
                </div>
              )}

              {/* Recommended Product Cards */}
              {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {msg.recommendedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-2 hover:border-blue-500/40 transition"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="truncate flex-1">
                          <div className="font-bold text-white truncate">{prod.name}</div>
                          <div className="text-blue-400 font-bold">₹{prod.price.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            onSelectProduct(prod);
                            onClose();
                          }}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-slate-200 py-1 px-2 rounded-lg text-[10px] font-bold border border-white/10 transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => onAddToCart(prod, 'pickup')}
                          className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md shadow-blue-600/20"
                        >
                          <Zap className="w-3 h-3 fill-white" /> Pickup
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-blue-400 text-xs p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
            <span>Gemini AI analyzing catalog & prices...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="p-3 bg-white/5 backdrop-blur-md border-t border-white/10 space-y-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(p)}
              className="bg-white/10 hover:bg-white/20 text-blue-300 border border-white/10 hover:border-blue-500/30 text-[10px] font-medium px-2.5 py-1 rounded-full transition text-left truncate max-w-full"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white/5 backdrop-blur-md border-t border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Max Budget ₹ (Optional)"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-32 bg-white/5 text-slate-100 placeholder-slate-500 text-xs px-2.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Ask AI anything..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
              className="w-full bg-white/5 text-slate-100 placeholder-slate-500 text-xs pl-3 pr-10 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
            <button
              onClick={() => handleSendQuery()}
              disabled={loading || !inputQuery.trim()}
              className="absolute right-1.5 top-1.5 p-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg transition shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

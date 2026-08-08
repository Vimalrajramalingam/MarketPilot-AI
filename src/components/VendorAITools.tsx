import React, { useState } from 'react';
import { Bot, Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Check, ArrowRight } from 'lucide-react';

interface VendorAIToolsProps {
  vendorId: string;
  onApplyGeneratedProduct?: (productData: any) => void;
}

export const VendorAITools: React.FC<VendorAIToolsProps> = ({ vendorId, onApplyGeneratedProduct }) => {
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Mobiles & Accessories');
  const [featuresInput, setFeaturesInput] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');

  const [loadingGen, setLoadingGen] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  const [coachInsights, setCoachInsights] = useState<any[]>([
    {
      type: 'inventory_alert',
      title: 'Low Stock Risk',
      message: 'Your Anker 65W Charger has 14 units remaining. Based on current sales velocity, stock will deplete in 4 days.',
    },
    {
      type: 'pricing_tip',
      title: 'Dynamic Pickup Incentive',
      message: 'Enabling a 5% pickup discount on high-margin audio gear increases foot traffic to your Indiranagar store by 35%.',
    },
  ]);
  const [loadingCoach, setLoadingCoach] = useState(false);

  const handleGenerateListing = async () => {
    if (!titleInput.trim()) return;
    setLoadingGen(true);

    try {
      const res = await fetch('/api/ai/vendor/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput,
          category: categoryInput,
          features: featuresInput,
          targetPrice: proposedPrice ? parseFloat(proposedPrice) : undefined,
        }),
      });

      const data = await res.json();
      setGeneratedResult(data);
    } catch (e) {
      setGeneratedResult({
        title: `${titleInput} (AI Enhanced)`,
        description: `Premium quality ${titleInput}. Features: ${featuresInput || 'High performance and long durability'}. Perfect for everyday use.`,
        seoKeywords: [titleInput, categoryInput, 'fast pickup', 'marketplace warranty'],
        suggestedPrice: proposedPrice ? parseFloat(proposedPrice) : 999,
      });
    } finally {
      setLoadingGen(false);
    }
  };

  const handleFetchCoachInsights = async () => {
    setLoadingCoach(true);
    try {
      const res = await fetch('/api/ai/vendor/business-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId }),
      });
      const data = await res.json();
      if (data.insights && data.insights.length) {
        setCoachInsights(data.insights);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCoach(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-emerald-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/20">
            <Bot className="w-4 h-4 text-emerald-400" />
            VENDOR AI INTELLIGENCE HUB
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            AI Business Coach & Listing Optimizer
          </h2>
          <p className="text-xs text-slate-300">
            Leverage Gemini AI to generate SEO descriptions, predict stockouts, and optimize store pickup pricing.
          </p>
        </div>

        <button
          onClick={handleFetchCoachInsights}
          disabled={loadingCoach}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
        >
          {loadingCoach ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 fill-slate-950" />
          )}
          Refresh AI Insights
        </button>
      </div>

      {/* AI Business Coach Predictions Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          AI Stockout Predictions & Business Advice
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachInsights.map((insight, idx) => (
            <div
              key={idx}
              className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 shadow-xl hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  {insight.type === 'inventory_alert' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  )}
                  {insight.title}
                </span>
                <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  Gemini Predictive
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{insight.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Product Description & SEO Generator */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            AI Product Listing Generator
          </h3>
          <p className="text-xs text-slate-400">
            Enter rough product details and Gemini AI will write high-converting copy, SEO tags, and price recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Product Title</label>
            <input
              type="text"
              placeholder="e.g. Wireless Noise Cancelling Earbuds"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category</label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            >
              <option value="Mobiles & Accessories">Mobiles & Accessories</option>
              <option value="Laptops & Gaming">Laptops & Gaming</option>
              <option value="Audio & Wearables">Audio & Wearables</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Urgent Essentials">Urgent Essentials</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-slate-300 font-medium mb-1">Key Features / Bullet Points</label>
            <textarea
              rows={2}
              placeholder="e.g. 30hr battery, IPX5 waterproof, fast USB-C charging, active noise canceling"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Proposed Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 2499"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              className="w-full bg-slate-950 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateListing}
              disabled={loadingGen || !titleInput.trim()}
              className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {loadingGen ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Bot className="w-4 h-4" /> Generate Listing with Gemini
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Generated Output Display */}
        {generatedResult && (
          <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> AI Generated Listing Ready
              </span>
              <span className="text-xs font-black text-amber-300">
                Suggested Price: ₹{generatedResult.suggestedPrice?.toLocaleString('en-IN') || proposedPrice}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Optimized Title:</span>
                <p className="font-bold text-white text-sm mt-0.5">{generatedResult.title}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Description:</span>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{generatedResult.description}</p>
              </div>

              {generatedResult.seoKeywords && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-slate-400 text-[11px] font-medium mr-1">SEO Keywords:</span>
                  {generatedResult.seoKeywords.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="bg-slate-900 text-sky-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-800"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {onApplyGeneratedProduct && (
              <button
                onClick={() => onApplyGeneratedProduct(generatedResult)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                Use This Data to Add Product <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

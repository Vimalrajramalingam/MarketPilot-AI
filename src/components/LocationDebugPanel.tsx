import React, { useState } from 'react';
import { UserLocation } from '../utils/locationUtils';
import { Compass, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';

interface LocationDebugPanelProps {
  location: UserLocation;
}

export const LocationDebugPanel: React.FC<LocationDebugPanelProps> = ({ location }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-slate-950/95 border border-blue-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-[11px] font-mono text-slate-200 max-w-xs transition-all">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5 font-sans font-bold text-blue-400">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>GPS DEV PANEL</span>
          <span
            className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
              location.source === 'gps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {location.source === 'gps' ? '📍 REAL GPS' : '🔍 MANUAL'}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="pt-1.5 space-y-1">
        <div className="flex justify-between items-center text-white font-bold">
          <span className="truncate max-w-[170px]">{location.name}</span>
          <span className="text-[10px] text-emerald-400">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t border-white/10 space-y-1.5 text-[10px] text-slate-300">
            <div>
              <span className="text-slate-500 block font-sans">Location Source:</span>
              <strong className="text-white uppercase">{location.source || 'default'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block font-sans">Latitude:</span>
              <strong className="text-blue-300">{location.lat}</strong>
            </div>

            <div>
              <span className="text-slate-500 block font-sans">Longitude:</span>
              <strong className="text-blue-300">{location.lng}</strong>
            </div>

            <div>
              <span className="text-slate-500 block font-sans">Accuracy:</span>
              <strong className="text-emerald-300">
                {location.accuracy ? `${location.accuracy} meters` : 'Exact'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block font-sans">Timestamp:</span>
              <strong className="text-slate-200">
                {location.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Active Session'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block font-sans">Geocoded Address:</span>
              <p className="text-[9px] text-slate-300 line-clamp-2">{location.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

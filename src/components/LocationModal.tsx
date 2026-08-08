import React, { useState } from 'react';
import { UserLocation, POPULAR_LOCATIONS, forwardGeocode, getBestAvailableLocation } from '../utils/locationUtils';
import {
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Compass,
} from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [manualSearch, setManualSearch] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  if (!isOpen) return null;

  // Handle GPS Device Location Request using robust 4-tier detection
  const handleUseDeviceLocation = async () => {
    setIsGeoLoading(true);
    setGeoError(null);

    try {
      const bestLoc = await getBestAvailableLocation();
      console.log('CURRENT DEVICE LOCATION OBTAINED:', bestLoc);
      onSelectLocation(bestLoc);
      setIsGeoLoading(false);
      onClose();
    } catch (e) {
      console.warn('Location detection fallback:', e);
      setIsGeoLoading(false);
      onClose();
    }
  };

  // Handle manual address submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSearch.trim()) return;

    // Check if matched in popular locations first
    const matched = POPULAR_LOCATIONS.find((p) =>
      p.name.toLowerCase().includes(manualSearch.toLowerCase())
    );

    if (matched) {
      onSelectLocation({ ...matched, source: 'manual' });
      onClose();
      return;
    }

    setIsGeoLoading(true);
    const geocoded = await forwardGeocode(manualSearch.trim());
    setIsGeoLoading(false);

    if (geocoded) {
      onSelectLocation(geocoded);
      onClose();
    } else {
      setGeoError(`Could not pinpoint "${manualSearch.trim()}". Please enter a valid city, area, or landmark name.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Choose Pickup Location</h3>
              <p className="text-[11px] text-slate-400">
                Used to find nearest partner stores with live inventory.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRIMARY ACTION: Device GPS Button */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-blue-400 uppercase tracking-wider block">
            Primary Option — Device Location
          </label>

          <button
            onClick={handleUseDeviceLocation}
            disabled={isGeoLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm p-4 rounded-2xl transition shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <Navigation className={`w-5 h-5 ${isGeoLoading ? 'animate-spin' : 'animate-bounce'}`} />
            <span>
              {isGeoLoading ? 'Detecting GPS Location...' : '📍 Use My Current Location (GPS)'}
            </span>
          </button>
          <p className="text-[11px] text-slate-400 text-center">
            Allow location access so we can find the exact nearest store.
          </p>
        </div>

        {geoError && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-2xl flex items-start gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Location Permission Required</p>
              <p className="text-[11px] opacity-90">{geoError}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[10px] text-slate-500 font-bold uppercase">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        {/* SECONDARY ACTION: Manual Search Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Search Location Manually
          </label>

          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Enter area, city, address or landmark"
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 pl-10 pr-3 py-3 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-3 rounded-2xl border border-white/10 transition"
            >
              Set
            </button>
          </form>
        </div>

        {/* Current Active Location Display */}
        <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Currently Selected
              </span>
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  currentLocation.source === 'gps'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {currentLocation.source === 'gps' ? '📍 Device GPS' : '🔍 Manual'}
              </span>
            </div>
            <span className="text-xs font-black text-white flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {currentLocation.name}
            </span>
            <span className="text-[10px] text-slate-400 block truncate max-w-[280px]">
              {currentLocation.address}
            </span>
            {currentLocation.accuracy && (
              <span className="text-[9px] text-emerald-400/90 block font-mono mt-0.5">
                Accuracy: ~{currentLocation.accuracy} meters
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-500 text-right">
            {currentLocation.lat.toFixed(4)},<br />{currentLocation.lng.toFixed(4)}
          </span>
        </div>

        {/* Preset Locations */}
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowPopular(!showPopular)}
            className="text-[11px] font-bold text-slate-400 hover:text-white transition flex items-center gap-1 mx-auto mb-2"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>Select Popular Regional Cities</span>
          </button>

          {showPopular && (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {POPULAR_LOCATIONS.map((loc) => {
                const isSelected = currentLocation.name.toLowerCase().includes(loc.name.split(' ')[0].toLowerCase());
                const isKarur = loc.name.toLowerCase().includes('karur');
                return (
                  <button
                    key={loc.name}
                    onClick={() => {
                      onSelectLocation({ ...loc, source: 'manual' });
                      onClose();
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs transition relative overflow-hidden ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-2 ring-blue-500/50'
                        : isKarur
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 hover:bg-emerald-900/40'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {isKarur && (
                      <span className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-bl-md uppercase">
                        Active Choice
                      </span>
                    )}
                    <p className="font-bold text-[11px] truncate flex items-center gap-1">
                      <MapPin className={`w-3 h-3 ${isKarur ? 'text-emerald-400' : 'text-blue-400'}`} />
                      <span>{loc.name.split('(')[0].trim()}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">{loc.address}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

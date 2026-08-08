import React from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../utils/locationUtils';

interface GoogleMapEmbedProps {
  lat: number;
  lng: number;
  customerLat?: number;
  customerLng?: number;
  storeName?: string;
  storeAddress?: string;
  customerAddress?: string;
}

export const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  lat,
  lng,
  customerLat,
  customerLng,
  storeName,
  storeAddress,
  customerAddress,
}) => {
  // Embed exact store coordinates on Google Maps
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  const directionsUrl = getGoogleMapsDirectionsUrl(
    customerLat,
    customerLng,
    lat,
    lng,
    storeName,
    storeAddress,
    customerAddress
  );

  return (
    <div className="w-full h-full relative bg-slate-900 overflow-hidden group">
      <iframe
        title={storeName || 'Store Location'}
        src={mapUrl}
        className="w-full h-full border-0 opacity-90 group-hover:opacity-100 transition duration-300"
        loading="lazy"
        allowFullScreen
      />

      {/* Top Location Information Bar */}
      <div className="absolute top-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur border border-blue-500/40 text-white px-3 py-1.5 rounded-2xl text-[11px] font-sans shadow-xl flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="truncate max-w-[200px] sm:max-w-[280px]">
            <span className="text-[9px] text-blue-300 uppercase font-black block leading-none">Your Location</span>
            <span className="font-bold text-white truncate block">
              {customerAddress || (customerLat ? `${customerLat.toFixed(4)}, ${customerLng?.toFixed(4)}` : 'GPS Active')}
            </span>
          </div>
        </div>

        {storeName && (
          <div className="bg-slate-950/90 backdrop-blur border border-emerald-500/40 text-white px-3 py-1.5 rounded-2xl text-[11px] font-sans shadow-xl flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="truncate max-w-[180px] sm:max-w-[240px]">
              <span className="text-[9px] text-emerald-300 uppercase font-black block leading-none">Destination Store</span>
              <span className="font-bold text-white truncate block">{storeName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Direct Directions Launcher Button */}
      <div className="absolute bottom-3 right-3 z-10">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-blue-400/40 transition active:scale-95"
        >
          <Navigation className="w-4 h-4 text-white animate-bounce" />
          <span>Open Live Directions in Google Maps</span>
        </a>
      </div>
    </div>
  );
};


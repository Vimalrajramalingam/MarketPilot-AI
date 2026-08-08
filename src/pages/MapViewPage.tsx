import React, { useState } from 'react';
import { Store, Product } from '../types';
import { GoogleMapEmbed } from '../components/GoogleMapEmbed';
import {
  UserLocation,
  DEFAULT_USER_LOCATION,
  POPULAR_LOCATIONS,
  getNearbyStoresForUser,
  getGoogleMapsDirectionsUrl,
  haversineKm,
} from '../utils/locationUtils';
import { MapPin, Store as StoreIcon, Clock, Phone, Navigation, ShieldCheck, Zap } from 'lucide-react';

interface MapViewPageProps {
  stores: Store[];
  products: Product[];
  onReserveProduct: (product: Product, store: Store) => void;
  currentUserLocation: UserLocation;
}

export const MapViewPage: React.FC<MapViewPageProps> = ({
  stores,
  products,
  onReserveProduct,
  currentUserLocation,
}) => {
  const nearbyStores = getNearbyStoresForUser(currentUserLocation, stores, 50);

  const [selectedStore, setSelectedStore] = useState<Store>(
    nearbyStores[0] || stores[0] || INITIAL_STORES_FALLBACK
  );

  const activeStore = nearbyStores.find((s) => s.id === selectedStore.id) || selectedStore;

  const storeProducts = products.filter(
    (p) => p.storeId === activeStore?.id || p.vendorId === activeStore?.vendorId
  );

  const mapsUrl = getGoogleMapsDirectionsUrl(
    currentUserLocation.lat,
    currentUserLocation.lng,
    activeStore?.lat || 10.9621,
    activeStore?.lng || 78.0786
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-extrabold px-3 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
          OWN PICKUP MAP LOCATOR
        </div>
        <h1 className="text-2xl font-extrabold text-white">
          Nearby Partner Stores Near {currentUserLocation.name}
        </h1>
        <p className="text-xs text-slate-400">
          Find local shops with ready inventory. Reserve online and collect in 15 minutes!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stores List */}
        <div className="lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {nearbyStores.map((s) => {
            const dist = haversineKm(currentUserLocation.lat, currentUserLocation.lng, s.lat, s.lng);
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStore(s)}
                className={`p-4 rounded-3xl border transition cursor-pointer space-y-2 ${
                  activeStore?.id === s.id
                    ? 'bg-blue-600/20 border-blue-500 shadow-xl'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{s.name}</h3>
                  <span className="bg-blue-500/20 text-blue-300 font-extrabold text-[10px] px-2 py-0.5 rounded">
                    {dist} km
                  </span>
                </div>
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {s.address}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-300">
                  <span>🕒 {s.openingHours}</span>
                  <span>📞 {s.phone}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map View & Store Products */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-3xl space-y-4 shadow-2xl">
            <div className="h-80 w-full rounded-2xl overflow-hidden border border-white/10">
              <GoogleMapEmbed
                lat={activeStore?.lat || 10.9621}
                lng={activeStore?.lng || 78.0786}
                customerLat={currentUserLocation.lat}
                customerLng={currentUserLocation.lng}
                storeName={activeStore?.name}
                storeAddress={activeStore?.address}
                customerAddress={currentUserLocation.address || currentUserLocation.name}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <h2 className="font-extrabold text-white text-base">{activeStore?.name}</h2>
                <p className="text-slate-400">{activeStore?.address}</p>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg"
              >
                <Navigation className="w-3.5 h-3.5" /> Google Maps Directions
              </a>
            </div>
          </div>

          {/* Store Inventory Preview */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm">
              In-Stock Products at {activeStore?.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storeProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-white text-xs truncate max-w-[120px]">
                        {p.name}
                      </h4>
                      <span className="text-blue-400 font-extrabold text-xs">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onReserveProduct(p, activeStore)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition shadow-md"
                  >
                    Reserve
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const INITIAL_STORES_FALLBACK: Store = {
  id: 'store_karur_1',
  vendorId: 'ven_karur_1',
  name: 'Karur Digital World - Kovai Road',
  address: '14 Kovai Main Road, Karur, Tamil Nadu',
  pincode: '639002',
  lat: 10.9621,
  lng: 78.0786,
  distanceKm: 0.5,
  openingHours: '09:00 AM - 09:30 PM',
  phone: '+91 94431 12345',
  pickupEnabled: true,
  rating: 4.9,
};

import { Store, Product } from '../types';

export interface UserLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
  source?: 'gps' | 'manual';
}

export const DEFAULT_USER_LOCATION: UserLocation = {
  name: 'Karur, Tamil Nadu',
  address: 'Kovai Road, Jawahar Bazaar, Karur, Tamil Nadu 639001',
  lat: 10.9601,
  lng: 78.0766,
};

export const POPULAR_LOCATIONS: UserLocation[] = [
  {
    name: 'Karur (Kovai Road / Jawahar Bazaar)',
    address: 'Kovai Road, Jawahar Bazaar, Karur, Tamil Nadu 639001',
    lat: 10.9601,
    lng: 78.0766,
  },
  {
    name: 'Coimbatore (RS Puram / DB Road)',
    address: 'DB Road, RS Puram, Coimbatore, Tamil Nadu 641002',
    lat: 11.0018,
    lng: 76.9528,
  },
  {
    name: 'Coimbatore (Thudiyalur / Lovely Nagar)',
    address: 'Thudiyalur Bus Stand, NH 181, Coimbatore, Tamil Nadu 641034',
    lat: 11.0821,
    lng: 76.9312,
  },
  {
    name: 'Coimbatore (Gandhipuram)',
    address: 'Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012',
    lat: 11.0168,
    lng: 76.9558,
  },
  {
    name: 'Chennai, Tamil Nadu',
    address: 'Anna Salai, T. Nagar, Chennai, Tamil Nadu 600017',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    name: 'Indiranagar, Bengaluru',
    address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    lat: 12.9716,
    lng: 77.6412,
  },
  {
    name: 'Koramangala, Bengaluru',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru 560034',
    lat: 12.9352,
    lng: 77.6245,
  },
];

/**
 * Haversine formula to compute distance in kilometers between two lat/lng pairs
 */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.0;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // 1 decimal place
}

/**
 * Calculates driving time in minutes based on distance and urban traffic speeds
 */
export function estimateDriveTimeMins(distanceKm: number): number {
  if (distanceKm <= 0) return 3;
  // Avg urban speed: ~20-22 km/h + 2 mins traffic buffer
  const minutes = Math.ceil((distanceKm / 22) * 60) + 2;
  return Math.max(3, minutes);
}

/**
 * Returns Google Maps direction link from user location to vendor location
 */
export function getGoogleMapsDirectionsUrl(
  originLat?: number,
  originLng?: number,
  destLat?: number,
  destLng?: number,
  storeName?: string,
  storeAddress?: string,
  customerAddress?: string
): string {
  const destQuery = destLat && destLng
    ? `${destLat},${destLng}`
    : encodeURIComponent(`${storeName || ''} ${storeAddress || ''}`.trim());

  // If customer address is a human-readable street/area name, use it as origin
  if (customerAddress && customerAddress.length > 5 && !customerAddress.startsWith('GPS Lat') && !customerAddress.startsWith('GPS:')) {
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(customerAddress)}&destination=${destQuery}&travelmode=driving`;
  }

  // If coordinates are present, pass origin lat,lng and destination lat,lng
  if (originLat && originLng && destLat && destLng) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }

  // Fallback to "My Location" on device GPS
  return `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${destQuery}&travelmode=driving`;
}

/**
 * Reverse geocodes coordinates into human readable location name and address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{ name: string; address: string }> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdivision || addr.city_district || addr.town || addr.city || 'Near You';
      const city = addr.city || addr.state_district || addr.state || '';
      const name = city && suburb !== city ? `${suburb}, ${city}` : suburb;
      const address = data.display_name || `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      return { name, address };
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }
  return {
    name: `GPS Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
    address: `GPS Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
  };
}

/**
 * Forward geocodes query string into coordinates and display address
 */
export async function forwardGeocode(query: string): Promise<UserLocation | null> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return null;

  const trySearch = async (q: string): Promise<UserLocation | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const item = data[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          return {
            name: item.display_name.split(',')[0] || cleanQuery,
            address: item.display_name,
            lat,
            lng,
            source: 'manual',
          };
        }
      }
    } catch (err) {
      console.warn('Forward geocoding attempt failed:', err);
    }
    return null;
  };

  // Attempt 1: Direct query
  let result = await trySearch(cleanQuery);
  if (result) return result;

  // Attempt 2: Append regional context
  result = await trySearch(`${cleanQuery}, Tamil Nadu, India`);
  if (result) return result;

  // Attempt 3: Append India context
  result = await trySearch(`${cleanQuery}, India`);
  if (result) return result;

  // Attempt 4: Match against popular locations dictionary
  const matchedPreset = POPULAR_LOCATIONS.find(p => 
    p.name.toLowerCase().includes(cleanQuery.toLowerCase()) || 
    p.address.toLowerCase().includes(cleanQuery.toLowerCase())
  );
  if (matchedPreset) {
    return { ...matchedPreset, source: 'manual' };
  }

  return null;
}

/**
 * Returns stores that match the user's location.
 * When real customer GPS is used or no static store is within 10 km, dynamically generates partner stores
 * centered directly around the customer's exact GPS latitude/longitude.
 */
export function getNearbyStoresForUser(userLoc: UserLocation, baseStores: Store[], maxDistanceKm: number = 50): Store[] {
  if (!userLoc || typeof userLoc.lat !== 'number' || typeof userLoc.lng !== 'number') {
    return baseStores;
  }

  // Calculate actual live distance to all static stores
  const storesWithDistance = baseStores.map((store) => {
    const distanceKm = haversineKm(userLoc.lat, userLoc.lng, store.lat, store.lng);
    return { ...store, distanceKm };
  });

  // Filter static stores within maxDistanceKm
  const staticNearby = storesWithDistance.filter((s) => s.distanceKm <= maxDistanceKm);

  if (staticNearby.length > 0) {
    return staticNearby.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // Fallback: generate local partner stores centered right at user's lat/lng
  const areaName = userLoc.name ? userLoc.name.split(',')[0].trim() : 'Local Area';
  const cityName = userLoc.name && userLoc.name.includes(',') ? userLoc.name.split(',')[1].trim() : areaName;

  const latKey = userLoc.lat.toFixed(3);
  const lngKey = userLoc.lng.toFixed(3);

  return [
    {
      id: `dyn_store_${latKey}_${lngKey}_1`,
      vendorId: 'ven_local_1',
      name: `${areaName} Digital & Electronics Hub`,
      address: `12 Main Street, ${areaName}, ${cityName}`,
      pincode: '600000',
      lat: userLoc.lat + 0.005,
      lng: userLoc.lng + 0.004,
      distanceKm: haversineKm(userLoc.lat, userLoc.lng, userLoc.lat + 0.005, userLoc.lng + 0.004),
      phone: '+91 98400 99881',
      openingHours: '09:00 AM - 09:30 PM',
      pickupEnabled: true,
      rating: 4.9,
    },
    {
      id: `dyn_store_${latKey}_${lngKey}_2`,
      vendorId: 'ven_local_2',
      name: `Apex Express - ${areaName}`,
      address: `45 Station Road, ${areaName}, ${cityName}`,
      pincode: '600000',
      lat: userLoc.lat - 0.008,
      lng: userLoc.lng + 0.009,
      distanceKm: haversineKm(userLoc.lat, userLoc.lng, userLoc.lat - 0.008, userLoc.lng + 0.009),
      phone: '+91 98400 99882',
      openingHours: '09:30 AM - 09:00 PM',
      pickupEnabled: true,
      rating: 4.8,
    },
    {
      id: `dyn_store_${latKey}_${lngKey}_3`,
      vendorId: 'ven_local_3',
      name: `QuickMart Superstore - ${areaName}`,
      address: `88 Market Bazaar, ${areaName}, ${cityName}`,
      pincode: '600000',
      lat: userLoc.lat + 0.012,
      lng: userLoc.lng - 0.010,
      distanceKm: haversineKm(userLoc.lat, userLoc.lng, userLoc.lat + 0.012, userLoc.lng - 0.010),
      phone: '+91 98400 99883',
      openingHours: '24/7 Open',
      pickupEnabled: true,
      rating: 4.7,
    },
  ];
}

export interface StoreOption {
  store: Store;
  product: Product;
  price: number;
  stock: number;
  distanceKm: number;
  driveTimeMins: number;
  prepTimeMins: number;
  totalTimeMins: number;
  isOpen: boolean;
  isBestOption: boolean;
}

export type PickupSortOption = 'nearest' | 'fastest' | 'cheapest' | 'highest_rated';

/**
 * Finds and ranks all available stores for a given product relative to user's real location
 */
export function rankStoresForProduct(
  product: Product,
  allStores: Store[],
  allProducts: Product[],
  userLoc: UserLocation,
  radiusKm: number = 10,
  sortBy: PickupSortOption = 'nearest'
): StoreOption[] {
  const candidateStores = getNearbyStoresForUser(userLoc, allStores, Math.max(radiusKm, 50));

  const matchingProducts = allProducts.filter(
    (p) =>
      p.id === product.id ||
      p.name.toLowerCase() === product.name.toLowerCase() ||
      (p.category === product.category && p.brand === product.brand)
  );

  const options: StoreOption[] = [];

  candidateStores.forEach((store) => {
    if (!store.pickupEnabled) return;

    const directProd = matchingProducts.find((p) => p.storeId === store.id || p.vendorId === store.vendorId);
    
    const stock = directProd ? directProd.stock : (product.stock > 0 ? Math.max(2, Math.floor((product.stock + store.name.length) % 8) + 2) : 4);
    const price = directProd ? directProd.price : product.price;

    if (stock <= 0) return;

    const dist = haversineKm(userLoc.lat, userLoc.lng, store.lat, store.lng);

    if (dist > radiusKm) return;

    const driveMins = estimateDriveTimeMins(dist);
    const prepMins = 15;
    const totalMins = prepMins + driveMins;

    options.push({
      store: {
        ...store,
        distanceKm: dist,
      },
      product: directProd || { ...product, storeId: store.id, storeName: store.name, storeLat: store.lat, storeLng: store.lng },
      price,
      stock,
      distanceKm: dist,
      driveTimeMins: driveMins,
      prepTimeMins: prepMins,
      totalTimeMins: totalMins,
      isOpen: true,
      isBestOption: false,
    });
  });

  // If no stores were found within the tight radius, fallback to all candidate stores without radius filter
  if (options.length === 0) {
    candidateStores.forEach((store) => {
      if (!store.pickupEnabled) return;

      const directProd = matchingProducts.find((p) => p.storeId === store.id || p.vendorId === store.vendorId);
      const stock = directProd ? directProd.stock : (product.stock > 0 ? Math.max(2, Math.floor((product.stock + store.name.length) % 8) + 2) : 4);
      const price = directProd ? directProd.price : product.price;
      const dist = haversineKm(userLoc.lat, userLoc.lng, store.lat, store.lng);
      const driveMins = estimateDriveTimeMins(dist);
      const prepMins = 15;

      options.push({
        store: {
          ...store,
          distanceKm: dist,
        },
        product: directProd || { ...product, storeId: store.id, storeName: store.name, storeLat: store.lat, storeLng: store.lng },
        price,
        stock,
        distanceKm: dist,
        driveTimeMins: driveMins,
        prepTimeMins: prepMins,
        totalTimeMins: prepMins + driveMins,
        isOpen: true,
        isBestOption: false,
      });
    });
  }

  options.sort((a, b) => {
    if (sortBy === 'fastest') {
      return a.totalTimeMins - b.totalTimeMins;
    }
    if (sortBy === 'cheapest') {
      return a.price - b.price;
    }
    if (sortBy === 'highest_rated') {
      return b.store.rating - a.store.rating;
    }
    return a.distanceKm - b.distanceKm;
  });

  if (options.length > 0) {
    options[0].isBestOption = true;
  }

  return options;
}

/**
 * Robust, non-failing location detector:
 * 1. High-accuracy GPS (6s timeout)
 * 2. Low-accuracy GPS (6s timeout)
 * 3. IP-based location lookup
 * 4. Default fallback location
 * Never throws errors or triggers alert boxes!
 */
export async function getBestAvailableLocation(): Promise<UserLocation> {
  // Tier 1: High-accuracy GPS
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('No geolocation support'));
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 10000,
      });
    });
    const { latitude, longitude, accuracy } = pos.coords;
    const geocoded = await reverseGeocode(latitude, longitude);
    return {
      name: geocoded.name || 'Current Location',
      address: geocoded.address || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy),
      timestamp: pos.timestamp || Date.now(),
      source: 'gps',
    };
  } catch (err1) {
    console.warn('Tier 1 High-Accuracy GPS unavailable, trying Tier 2...', err1);
  }

  // Tier 2: Fast Low-accuracy GPS
  try {
    const pos2 = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('No geolocation support'));
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 60000,
      });
    });
    const { latitude, longitude, accuracy } = pos2.coords;
    const geocoded = await reverseGeocode(latitude, longitude);
    return {
      name: geocoded.name || 'Current Location',
      address: geocoded.address || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      lat: latitude,
      lng: longitude,
      accuracy: Math.round(accuracy),
      timestamp: pos2.timestamp || Date.now(),
      source: 'gps',
    };
  } catch (err2) {
    console.warn('Tier 2 Low-Accuracy GPS unavailable, trying Tier 3 IP Lookup...', err2);
  }

  // Tier 3: IP-based location
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        const city = data.city || data.region || 'Current Area';
        const geocoded = await reverseGeocode(lat, lng);
        return {
          name: geocoded.name || city,
          address: geocoded.address || `${city}, ${data.region_code || ''} ${data.country_name || ''}`,
          lat,
          lng,
          accuracy: 3000,
          timestamp: Date.now(),
          source: 'gps',
        };
      }
    }
  } catch (err3) {
    console.warn('Tier 3 IP Geolocation failed...', err3);
  }

  // Tier 4: Fallback
  return DEFAULT_USER_LOCATION;
}


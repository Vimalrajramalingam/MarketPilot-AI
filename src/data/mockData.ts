import { Product, Category, Store, Vendor, Coupon, Review, Order, User } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_customer_1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98765 43210',
    address: '42, 10th Main Road, Indiranagar, Bengaluru, Karnataka',
    pincode: '560038',
  },
  {
    id: 'usr_vendor_1',
    name: 'Vikram Mehta (ABC Electronics)',
    email: 'vendor@abcelectronics.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    phone: '+91 98123 45678',
    address: 'Shop #14, Brigade Road, Bengaluru',
    pincode: '560001',
  },
  {
    id: 'usr_admin_1',
    name: 'MarketPilot Admin',
    email: 'admin@marketpilot.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+91 80000 11111',
  },
];

export const CATEGORIES: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Mobiles & Accessories',
    slug: 'mobiles-accessories',
    iconName: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    itemCount: 42,
  },
  {
    id: 'cat_computers',
    name: 'Laptops & Gaming',
    slug: 'laptops-gaming',
    iconName: 'Laptop',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=400&q=80',
    itemCount: 28,
  },
  {
    id: 'cat_audio',
    name: 'Audio & Wearables',
    slug: 'audio-wearables',
    iconName: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
    itemCount: 35,
  },
  {
    id: 'cat_home',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
    itemCount: 50,
  },
  {
    id: 'cat_fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80',
    itemCount: 64,
  },
  {
    id: 'cat_essentials',
    name: 'Urgent Essentials',
    slug: 'urgent-essentials',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    itemCount: 19,
  },
];

export const INITIAL_STORES: Store[] = [
  // Karur Stores
  {
    id: 'store_karur_1',
    vendorId: 'ven_karur_1',
    name: 'Karur Digital World - Kovai Road',
    address: '14 Kovai Main Road, Near Bus Stand, Karur, Tamil Nadu',
    pincode: '639002',
    lat: 10.9621,
    lng: 78.0786,
    distanceKm: 0.5,
    phone: '+91 94431 12345',
    openingHours: '09:00 AM - 09:30 PM',
    pickupEnabled: true,
    rating: 4.9,
  },
  {
    id: 'store_karur_2',
    vendorId: 'ven_karur_2',
    name: 'Apex Electronics - Jawahar Bazaar, Karur',
    address: '88 Jawahar Bazaar, Opposite Town Hall, Karur, Tamil Nadu',
    pincode: '639001',
    lat: 10.9582,
    lng: 78.0815,
    distanceKm: 0.9,
    phone: '+91 94432 67890',
    openingHours: '09:30 AM - 09:00 PM',
    pickupEnabled: true,
    rating: 4.8,
  },
  {
    id: 'store_karur_3',
    vendorId: 'ven_karur_3',
    name: 'QuickMart Express - Karur Town',
    address: '42 Karur Bypass Road, Near Thanthonimalai, Karur, Tamil Nadu',
    pincode: '639005',
    lat: 10.9650,
    lng: 78.0720,
    distanceKm: 1.2,
    phone: '+91 94433 11111',
    openingHours: '24/7 Open',
    pickupEnabled: true,
    rating: 4.7,
  },

  // Coimbatore Stores
  {
    id: 'store_cbe_1',
    vendorId: 'ven_cbe_1',
    name: 'Coimbatore Tech Plaza - Cross Cut Road',
    address: '102 Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu',
    pincode: '641012',
    lat: 11.0188,
    lng: 76.9578,
    distanceKm: 0.8,
    phone: '+91 98422 11111',
    openingHours: '09:30 AM - 09:30 PM',
    pickupEnabled: true,
    rating: 4.8,
  },

  // Chennai Stores
  {
    id: 'store_chn_1',
    vendorId: 'ven_chn_1',
    name: 'Chennai Gadget Hub - Anna Nagar',
    address: '2nd Avenue, Block Z, Anna Nagar, Chennai, Tamil Nadu',
    pincode: '600040',
    lat: 13.0847,
    lng: 80.2127,
    distanceKm: 1.1,
    phone: '+91 98400 11111',
    openingHours: '09:00 AM - 09:30 PM',
    pickupEnabled: true,
    rating: 4.9,
  },

  // Bengaluru Stores
  {
    id: 'store_abc_1',
    vendorId: 'ven_abc',
    name: 'ABC Electronics - Indiranagar',
    address: '100 Feet Road, Near Toit, Indiranagar, Bengaluru, Karnataka',
    pincode: '560038',
    lat: 12.9784,
    lng: 77.6408,
    distanceKm: 1.2,
    phone: '+91 98765 11111',
    openingHours: '09:00 AM - 09:30 PM',
    pickupEnabled: true,
    rating: 4.8,
  },
  {
    id: 'store_xyz_1',
    vendorId: 'ven_xyz',
    name: 'XYZ Mobiles - Koramangala',
    address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka',
    pincode: '560034',
    lat: 12.9352,
    lng: 77.6245,
    distanceKm: 2.1,
    phone: '+91 98765 22222',
    openingHours: '10:00 AM - 10:00 PM',
    pickupEnabled: true,
    rating: 4.6,
  },
  {
    id: 'store_techworld_1',
    vendorId: 'ven_techworld',
    name: 'Tech World Mega Hub - MG Road',
    address: 'Utility Building, MG Road, Bengaluru, Karnataka',
    pincode: '560001',
    lat: 12.9756,
    lng: 77.6068,
    distanceKm: 4.5,
    phone: '+91 98765 33333',
    openingHours: '09:30 AM - 09:00 PM',
    pickupEnabled: true,
    rating: 4.9,
  },
  {
    id: 'store_quickmart_1',
    vendorId: 'ven_quickmart',
    name: 'QuickMart Express Essentials - Domlur',
    address: 'Intermediate Ring Rd, Domlur, Bengaluru, Karnataka',
    pincode: '560071',
    lat: 12.9609,
    lng: 77.6387,
    distanceKm: 0.8,
    phone: '+91 98765 44444',
    openingHours: '24/7 Open',
    pickupEnabled: true,
    rating: 4.7,
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven_abc',
    userId: 'usr_vendor_1',
    storeName: 'ABC Electronics',
    description: 'Premier consumer electronics retailer specializing in fast mobile chargers, audio tech, and smartphone accessories.',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    rating: 4.8,
    totalSales: 1240,
    revenue: 845000,
    isApproved: true,
    joinedDate: '2024-01-15',
    stores: [INITIAL_STORES[0]],
  },
  {
    id: 'ven_xyz',
    userId: 'usr_vendor_2',
    storeName: 'XYZ Mobiles & Gadgets',
    description: 'Authorized retailer for flagship smartphones, powerbanks, and high-speed USB-C cables.',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    rating: 4.6,
    totalSales: 890,
    revenue: 612000,
    isApproved: true,
    joinedDate: '2024-02-10',
    stores: [INITIAL_STORES[1]],
  },
  {
    id: 'ven_techworld',
    userId: 'usr_vendor_3',
    storeName: 'Tech World India',
    description: 'Large scale computer systems, gaming gear, monitors, and ergonomic accessories.',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
    rating: 4.9,
    totalSales: 2150,
    revenue: 2450000,
    isApproved: true,
    joinedDate: '2023-11-01',
    stores: [INITIAL_STORES[2]],
  },
];

// Expanded base products list
const BASE_PRODUCTS: Product[] = [
  {
    id: 'prod_101',
    vendorId: 'ven_abc',
    vendorName: 'ABC Electronics',
    storeId: 'store_abc_1',
    storeName: 'ABC Electronics - Indiranagar',
    storeLat: 12.9784,
    storeLng: 77.6408,
    name: 'Anker 65W Fast GaN Dual-Port USB-C Charger',
    description: 'Ultra-fast 65W Power Delivery charger suitable for iPhones, MacBooks, and Android smartphones. Compact fold design.',
    price: 499,
    originalPrice: 1299,
    discountPercentage: 61,
    category: 'Mobiles & Accessories',
    brand: 'Anker',
    sku: 'ANK-65W-BLK',
    stock: 14,
    lowStockThreshold: 4,
    rating: 4.8,
    reviewCount: 320,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609592424074-128b9d21c5f3?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '15 mins',
    featured: true,
    trending: true,
    bestSeller: true,
    specs: {
      'Wattage': '65W GaN III',
      'Ports': '2x USB-C, 1x USB-A',
      'Warranty': '18 Months',
    },
  },
  {
    id: 'prod_102',
    vendorId: 'ven_xyz',
    vendorName: 'XYZ Mobiles & Gadgets',
    storeId: 'store_xyz_1',
    storeName: 'XYZ Mobiles - Koramangala',
    storeLat: 12.9352,
    storeLng: 77.6245,
    name: 'MagSafe Wireless 10000mAh Power Bank (Fast 20W)',
    description: 'Magnetic wireless power bank with Kickstand. Fast 20W wired output + 15W wireless MagSafe charging.',
    price: 1899,
    originalPrice: 3499,
    discountPercentage: 45,
    category: 'Mobiles & Accessories',
    brand: 'Anker',
    sku: 'MAG-PB-10K',
    stock: 8,
    lowStockThreshold: 3,
    rating: 4.7,
    reviewCount: 185,
    images: [
      'https://images.unsplash.com/photo-1609592424074-128b9d21c5f3?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '20 mins',
    featured: true,
    trending: true,
  },
  {
    id: 'prod_103',
    vendorId: 'ven_techworld',
    vendorName: 'Tech World India',
    storeId: 'store_techworld_1',
    storeName: 'Tech World Mega Hub - MG Road',
    storeLat: 12.9756,
    storeLng: 77.6068,
    name: 'Asus ROG Strix G16 Gaming Laptop (Intel i7 13th Gen, RTX 4060, 16GB, 1TB SSD)',
    description: 'High performance gaming laptop featuring 16-inch QHD 240Hz display, ROG Intelligent Cooling, and Aura Sync RGB.',
    price: 118990,
    originalPrice: 142990,
    discountPercentage: 16,
    category: 'Laptops & Gaming',
    brand: 'Asus',
    sku: 'ROG-G16-2024',
    stock: 5,
    lowStockThreshold: 2,
    rating: 4.9,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: false,
    estimatedPickupTime: '30 mins',
    featured: true,
    bestSeller: true,
    specs: {
      'Processor': 'Intel Core i7-13650HX',
      'GPU': 'NVIDIA GeForce RTX 4060 8GB',
      'RAM': '16GB DDR5',
      'Display': '16" QHD+ 240Hz',
    },
  },
  {
    id: 'prod_104',
    vendorId: 'ven_abc',
    vendorName: 'ABC Electronics',
    storeId: 'store_abc_1',
    storeName: 'ABC Electronics - Indiranagar',
    storeLat: 12.9784,
    storeLng: 77.6408,
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with 8 microphones, Auto NC Optimizer, 30hr battery life.',
    price: 26990,
    originalPrice: 34990,
    discountPercentage: 22,
    category: 'Audio & Wearables',
    brand: 'Sony',
    sku: 'SNY-WH1000XM5',
    stock: 11,
    lowStockThreshold: 3,
    rating: 4.9,
    reviewCount: 512,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '15 mins',
    featured: true,
    trending: true,
  },
  {
    id: 'prod_105',
    vendorId: 'ven_quickmart',
    vendorName: 'QuickMart Essentials',
    storeId: 'store_quickmart_1',
    storeName: 'QuickMart Express Essentials - Domlur',
    storeLat: 12.9609,
    storeLng: 77.6387,
    name: 'Emergency Medical & Travel Safety Kit',
    description: 'Complete emergency kit with 50 medical items, LED torch, emergency powerbank, thermal blanket.',
    price: 1499,
    originalPrice: 2499,
    discountPercentage: 40,
    category: 'Urgent Essentials',
    brand: 'SafeFirst',
    sku: 'EMG-KIT-PRO',
    stock: 20,
    lowStockThreshold: 5,
    rating: 4.8,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '10 mins',
    flashDeal: true,
  },
  {
    id: 'prod_106',
    vendorId: 'ven_abc',
    vendorName: 'ABC Electronics',
    storeId: 'store_abc_1',
    storeName: 'ABC Electronics - Indiranagar',
    storeLat: 12.9784,
    storeLng: 77.6408,
    name: 'Braided 240W USB-C to USB-C Fast Cable (2m)',
    description: 'Ultra durable nylon braided cable supporting 240W charging and 10Gbps transfer.',
    price: 349,
    originalPrice: 899,
    discountPercentage: 61,
    category: 'Mobiles & Accessories',
    brand: 'Belkin',
    sku: 'BLK-CABLE-2M',
    stock: 25,
    lowStockThreshold: 5,
    rating: 4.7,
    reviewCount: 140,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '15 mins',
  },
  {
    id: 'prod_107',
    vendorId: 'ven_techworld',
    vendorName: 'Tech World India',
    storeId: 'store_techworld_1',
    storeName: 'Tech World Mega Hub - MG Road',
    storeLat: 12.9756,
    storeLng: 77.6068,
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet click performance mouse with 8K DPI sensor and MagSpeed scrolling.',
    price: 8995,
    originalPrice: 10995,
    discountPercentage: 18,
    category: 'Laptops & Gaming',
    brand: 'Logitech',
    sku: 'LOG-MX3S-GRY',
    stock: 12,
    lowStockThreshold: 3,
    rating: 4.9,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: false,
    estimatedPickupTime: '25 mins',
  },
  {
    id: 'prod_108',
    vendorId: 'ven_xyz',
    vendorName: 'XYZ Mobiles & Gadgets',
    storeId: 'store_xyz_1',
    storeName: 'XYZ Mobiles - Koramangala',
    storeLat: 12.9352,
    storeLng: 77.6245,
    name: 'Apple AirPods Pro (2nd Gen) USB-C',
    description: 'Active Noise Cancellation, Adaptive Audio, Spatial Audio with head tracking.',
    price: 22900,
    originalPrice: 24900,
    discountPercentage: 8,
    category: 'Audio & Wearables',
    brand: 'Apple',
    sku: 'APL-APP2-USBC',
    stock: 7,
    lowStockThreshold: 2,
    rating: 4.9,
    reviewCount: 890,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    ],
    pickupAvailable: true,
    urgentPickup: true,
    estimatedPickupTime: '20 mins',
    bestSeller: true,
  },
];

// Helper to expand catalog to 100+ items realistically
function generateExpandedCatalog(): Product[] {
  const result: Product[] = [...BASE_PRODUCTS];
  const brands = ['Samsung', 'Apple', 'OnePlus', 'Sony', 'Anker', 'Asus', 'Logitech', 'Philips', 'Puma', 'BoAt'];
  const categoriesList = [
    { cat: 'Mobiles & Accessories', prefix: ['Galaxy S24 Ultra Case', 'Fast Charging Adapter 45W', 'Tempered Glass Guard', 'Wireless MagSafe Dock', 'Phone Tripod Mount'] },
    { cat: 'Laptops & Gaming', prefix: ['Mechanical RGB Keyboard', 'Curved Gaming Monitor 165Hz', 'Ergonomic Laptop Stand', 'Wireless Gaming Headset', 'Type-C Hub 7-in-1'] },
    { cat: 'Audio & Wearables', prefix: ['True Wireless Earbuds ANC', 'Fitness Smartwatch AMOLED', 'Portable Bluetooth Speaker 20W', 'Over-Ear Studio Headphones', 'Smart Fitness Band'] },
    { cat: 'Home & Kitchen', prefix: ['Smart Air Purifier HEPA', 'Robot Vacuum Cleaner', 'Electric Espresso Coffee Maker', 'Digital Air Fryer 4.5L', 'Smart LED Desk Lamp'] },
    { cat: 'Fashion & Apparel', prefix: ['Waterproof Laptop Backpack', 'Breathable Running Shoes', 'UV Protection Sunglasses', 'Cotton Slim Casual Shirt', 'Smart Leather Wallet'] },
    { cat: 'Urgent Essentials', prefix: ['Fast Power Bank 20000mAh', 'Multi-plug Universal Travel Adapter', 'Compact Car Fast Charger', 'Rainproof Bike Phone Holder', 'LED Rechargeable Emergency Light'] }
  ];

  const imagesMap: Record<string, string[]> = {
    'Mobiles & Accessories': ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'],
    'Laptops & Gaming': ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'],
    'Audio & Wearables': ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'],
    'Home & Kitchen': ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'],
    'Fashion & Apparel': ['https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
    'Urgent Essentials': ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80']
  };

  const prefixImagesMap: Record<string, string[]> = {
    // Mobiles & Accessories
    'Galaxy S24 Ultra Case': [
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    ],
    'Fast Charging Adapter 45W': [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609592424074-128b9d21c5f3?auto=format&fit=crop&w=800&q=80',
    ],
    'Tempered Glass Guard': [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    ],
    'Wireless MagSafe Dock': [
      'https://images.unsplash.com/photo-1609592424074-128b9d21c5f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=800&q=80',
    ],
    'Phone Tripod Mount': [
      'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    ],

    // Laptops & Gaming
    'Mechanical RGB Keyboard': [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    ],
    'Curved Gaming Monitor 165Hz': [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=800&q=80',
    ],
    'Ergonomic Laptop Stand': [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    ],
    'Wireless Gaming Headset': [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=800&q=80',
    ],
    'Type-C Hub 7-in-1': [
      'https://images.unsplash.com/photo-1616440342232-15904d98991d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    ],

    // Audio & Wearables
    'True Wireless Earbuds ANC': [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80',
    ],
    'Fitness Smartwatch AMOLED': [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    ],
    'Portable Bluetooth Speaker 20W': [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=800&q=80',
    ],
    'Over-Ear Studio Headphones': [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80',
    ],
    'Smart Fitness Band': [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
    ],

    // Home & Kitchen
    'Smart Air Purifier HEPA': [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    ],
    'Robot Vacuum Cleaner': [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    ],
    'Electric Espresso Coffee Maker': [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    ],
    'Digital Air Fryer 4.5L': [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    ],
    'Smart LED Desk Lamp': [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534349735944-2b3a6f7a268f?auto=format&fit=crop&w=800&q=80',
    ],

    // Fashion & Apparel
    'Waterproof Laptop Backpack': [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    ],
    'Breathable Running Shoes': [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    'UV Protection Sunglasses': [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    ],
    'Cotton Slim Casual Shirt': [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    ],
    'Smart Leather Wallet': [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?auto=format&fit=crop&w=800&q=80',
    ],

    // Urgent Essentials
    'Fast Power Bank 20000mAh': [
      'https://images.unsplash.com/photo-1609592424074-128b9d21c5f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    ],
    'Multi-plug Universal Travel Adapter': [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    ],
    'Compact Car Fast Charger': [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    ],
    'Rainproof Bike Phone Holder': [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    ],
    'LED Rechargeable Emergency Light': [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    ],
  };

  const storeRefs = INITIAL_STORES;
  let counter = 109;

  for (const itemGroup of categoriesList) {
    for (let i = 0; i < 16; i++) {
      const brand = brands[(counter + i) % brands.length];
      const prefix = itemGroup.prefix[i % itemGroup.prefix.length];
      const name = `${brand} ${prefix} Pro ${i + 1}`;
      const store = storeRefs[counter % storeRefs.length];
      const rawPrice = 299 + ((counter * 147) % 35000);
      const originalPrice = Math.round(rawPrice * 1.35);
      const isUrgent = counter % 3 === 0 || itemGroup.cat === 'Urgent Essentials';
      const isPickup = true;

      const pImages = prefixImagesMap[prefix] || imagesMap[itemGroup.cat] || imagesMap['Mobiles & Accessories'];

      result.push({
        id: `prod_${counter}`,
        vendorId: store.vendorId,
        vendorName: store.name.split(' - ')[0],
        storeId: store.id,
        storeName: store.name,
        storeLat: store.lat,
        storeLng: store.lng,
        name,
        description: `Premium grade ${name} with official brand warranty. High durability and instant store availability near you.`,
        price: rawPrice,
        originalPrice,
        discountPercentage: Math.round(((originalPrice - rawPrice) / originalPrice) * 100),
        category: itemGroup.cat,
        brand,
        sku: `${brand.slice(0, 3).toUpperCase()}-${counter}`,
        stock: 5 + (counter % 30),
        lowStockThreshold: 3,
        rating: parseFloat((4.2 + ((counter % 8) * 0.1)).toFixed(1)),
        reviewCount: 20 + ((counter * 3) % 400),
        images: [pImages[i % pImages.length]],
        pickupAvailable: isPickup,
        urgentPickup: isUrgent,
        estimatedPickupTime: isUrgent ? '15 mins' : '25 mins',
        featured: counter % 5 === 0,
        trending: counter % 4 === 0,
        bestSeller: counter % 7 === 0,
        flashDeal: counter % 6 === 0,
        newArrival: counter % 8 === 0,
        specs: {
          Brand: brand,
          Warranty: '1 Year Manufacturer',
          Availability: 'In Stock at Partner Store',
        },
      });
      counter++;
    }
  }

  return result;
}

export const INITIAL_PRODUCTS: Product[] = generateExpandedCatalog();

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountType: 'percent',
    value: 10,
    minOrder: 499,
    description: 'Get 10% off on your first MarketPilot AI order',
    expiryDate: '2026-12-31',
  },
  {
    code: 'PICKUP100',
    discountType: 'fixed',
    value: 100,
    minOrder: 399,
    description: 'Flat ₹100 Instant Discount when choosing Own Pickup',
    expiryDate: '2026-12-31',
  },
  {
    code: 'FESTIVE20',
    discountType: 'percent',
    value: 20,
    minOrder: 2000,
    description: 'Festive Season 20% Discount up to ₹500',
    expiryDate: '2026-12-31',
  },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_101',
    userId: 'usr_customer_1',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Needed a charger before catching my flight! Used Own Pickup, reserved it, drove 5 mins to Indiranagar store, scanned QR and was out in 2 minutes. Best shopping feature ever!',
    createdAt: '2026-08-01',
    helpfulVotes: 24,
  },
  {
    id: 'rev_2',
    productId: 'prod_101',
    userId: 'usr_customer_2',
    userName: 'Priya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Authentic product, charges my laptop and phone simultaneously without heating up.',
    createdAt: '2026-07-28',
    helpfulVotes: 12,
  },
  {
    id: 'rev_3',
    productId: 'prod_103',
    userId: 'usr_customer_3',
    userName: 'Anand Verma',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Beast of a gaming laptop. The RTX 4060 handles Cyberpunk with DLSS 3 smoothly above 90 FPS.',
    createdAt: '2026-07-20',
    helpfulVotes: 38,
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-8921',
    customerId: 'usr_customer_1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'item_1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        deliveryType: 'pickup',
        selectedStoreId: 'store_abc_1',
        selectedStoreName: 'ABC Electronics - Indiranagar',
      },
    ],
    subtotal: 499,
    discountAmount: 100,
    totalAmount: 399,
    deliveryType: 'pickup',
    pickupStore: {
      id: 'store_abc_1',
      name: 'ABC Electronics - Indiranagar',
      address: '100 Feet Road, Near Toit, Indiranagar, Bengaluru',
      lat: 12.9784,
      lng: 77.6408,
      estimatedPickupTime: '15 mins',
    },
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'READY_FOR_PICKUP',
    pickupQRCode: 'MP-QR-8921-ABC-STORE',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    vendorId: 'ven_abc',
  },
  {
    id: 'ORD-2026-7412',
    customerId: 'usr_customer_1',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'item_2',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        deliveryType: 'delivery',
      },
    ],
    subtotal: 26990,
    discountAmount: 0,
    totalAmount: 26990,
    deliveryType: 'delivery',
    shippingAddress: '42, 10th Main Road, Indiranagar, Bengaluru, Karnataka - 560038',
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'SHIPPED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    vendorId: 'ven_abc',
  },
];

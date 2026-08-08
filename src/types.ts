export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  pincode?: string;
}

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  address: string;
  pincode: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  phone: string;
  openingHours: string;
  pickupEnabled: boolean;
  rating: number;
}

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  logo: string;
  rating: number;
  totalSales: number;
  revenue: number;
  isApproved: boolean;
  joinedDate: string;
  stores: Store[];
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "128GB - Space Gray"
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  storeId: string;
  storeName?: string;
  storeLat?: number;
  storeLng?: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  category: string;
  brand: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  rating: number;
  reviewCount: number;
  images: string[];
  pickupAvailable: boolean;
  urgentPickup: boolean; // "Pick up in 15 mins near you"
  estimatedPickupTime: string; // "15 mins", "20 mins"
  specs?: Record<string, string>;
  variants?: ProductVariant[];
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  flashDeal?: boolean;
  newArrival?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  deliveryType: 'delivery' | 'pickup';
  selectedStoreId?: string;
  selectedStoreName?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
  expiryDate: string;
}

export type OrderStatus = 
  | 'PLACED' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'READY_FOR_PICKUP' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'PICKED_UP';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  shippingAddress?: string;
  pickupStore?: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    estimatedPickupTime: string;
  };
  paymentMethod: 'upi' | 'card' | 'cod' | 'razorpay';
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  pickupQRCode?: string; // Encoded QR String or Verification Code
  createdAt: string;
  updatedAt: string;
  vendorId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulVotes: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'pickup' | 'promo' | 'system' | 'inventory';
  read: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  pickupRate: number;
  salesByMonth: { month: string; sales: number; pickupSales: number }[];
  categoryDistribution: { name: string; value: number }[];
  topVendors: { name: string; sales: number; revenue: number }[];
  suspiciousActivityCount: number;
}

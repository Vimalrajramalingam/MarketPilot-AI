import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { User, UserRole, Product, Store as StoreType, CartItem, Order, AppNotification } from './types';
import { INITIAL_PRODUCTS, INITIAL_STORES, INITIAL_VENDORS } from './data/mockData';
import { UserLocation, DEFAULT_USER_LOCATION, reverseGeocode, getBestAvailableLocation } from './utils/locationUtils';
import { LocationModal } from './components/LocationModal';

// Layout & Reusable Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AIChatbotWidget } from './components/AIChatbotWidget';
import { ProductDetailsModal } from './components/ProductDetailsModal';

// Pages
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { QRPassPage } from './pages/QRPassPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MapViewPage } from './pages/MapViewPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { ProductPickupPage } from './pages/ProductPickupPage';
import { PickupHubPage } from './pages/PickupHubPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';

// Protected Route Helper
function ProtectedRoute({
  currentUser,
  allowedRoles,
  children,
}: {
  currentUser: User | null;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}) {
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'vendor') return <Navigate to="/vendor-dashboard" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/home" replace />;
  }
  return children;
}

function RootRedirect({ currentUser }: { currentUser: User | null }) {
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'vendor') return <Navigate to="/vendor-dashboard" replace />;
  if (currentUser.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/home" replace />;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Current User State with LocalStorage persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('marketpilot_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('marketpilot_user', JSON.stringify(user));
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('marketpilot_user');
    } catch (e) {
      // ignore
    }
    navigate('/login');
  };

  const [currentUserLocation, setCurrentUserLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem('marketpilot_user_location_obj');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_USER_LOCATION;
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleSelectLocation = (loc: UserLocation) => {
    setCurrentUserLocation(loc);
    try {
      localStorage.setItem('marketpilot_user_location_obj', JSON.stringify(loc));
      localStorage.setItem('marketpilot_user_location', loc.name);
    } catch (e) {}
  };

  // Respect user's saved location in localStorage; only run auto-detect if no saved location exists
  useEffect(() => {
    const saved = localStorage.getItem('marketpilot_user_location_obj');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.lat === 'number' && typeof parsed.lng === 'number') {
          // Keep user's saved location (e.g. Karur)
          return;
        }
      } catch (e) {}
    }

    // Otherwise fetch best available location once
    getBestAvailableLocation().then((loc) => {
      handleSelectLocation(loc);
    });
  }, []);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stores, setStores] = useState<StoreType[]>(INITIAL_STORES);
  const [vendors, setVendors] = useState<any[]>(INITIAL_VENDORS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod_101', 'prod_104']);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2026-8921',
      customerId: 'usr_customer_1',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul.sharma@example.com',
      customerPhone: '+91 98765 43210',
      vendorId: 'ven_abc',
      items: [
        {
          id: 'item_1',
          product: INITIAL_PRODUCTS[0],
          quantity: 1,
          deliveryType: 'pickup',
        },
      ],
      subtotal: INITIAL_PRODUCTS[0].price,
      discountAmount: 0,
      totalAmount: INITIAL_PRODUCTS[0].price,
      deliveryType: 'pickup',
      orderStatus: 'READY_FOR_PICKUP',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      pickupQRCode: 'MARKETPILOT-PICKUP-ORD-2026-8921',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: 'Indiranagar 100ft Road, Bengaluru, 560038',
    },
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      userId: 'usr_customer_1',
      title: 'Order Ready for Pickup! 🏪',
      message: 'Your order ORD-2026-8921 is ready at ABC Electronics - Indiranagar. Scan QR pass at counter.',
      type: 'pickup_ready',
      read: false,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Synchronize Express API Backend
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setProducts(data);
      })
      .catch(() => setProducts(INITIAL_PRODUCTS));

    fetch('/api/stores')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setStores(data);
      })
      .catch(() => setStores(INITIAL_STORES));
  }, []);

  const handleSelectRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: role === 'vendor' ? 'ABC Electronics' : role === 'admin' ? 'Super Admin' : 'Rahul Sharma',
    }));
  };

  const handleAddToCart = (product: Product, deliveryType: 'delivery' | 'pickup') => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        updated[existingIdx].deliveryType = deliveryType;
        return updated;
      }
      return [...prev, { product, quantity: 1, deliveryType }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleReserveProduct = (product: Product, store: StoreType) => {
    const newOrderId = `ORD-RES-${Date.now().toString().slice(-4)}`;
    const qrPass = `MP-PICKUP-${newOrderId}`;

    const newOrder: Order = {
      id: newOrderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone,
      vendorId: store.vendorId || 'ven_abc',
      items: [
        {
          id: `item_res_${Date.now()}`,
          product,
          quantity: 1,
          deliveryType: 'pickup',
        },
      ],
      subtotal: product.price,
      discountAmount: 0,
      totalAmount: product.price,
      deliveryType: 'pickup',
      orderStatus: 'CONFIRMED',
      paymentMethod: 'upi',
      paymentStatus: 'paid',
      pickupQRCode: qrPass,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: store.address,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reserve stock locally
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === product.id) {
          return { ...p, stock: Math.max(0, p.stock - 1) };
        }
        return p;
      })
    );

    navigate(`/pickup/reservation/${newOrderId}`);
  };

  const handleCompletePayment = async (paymentMethod: 'card' | 'upi' | 'cod' | 'razorpay') => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrderId = `ORD-${Date.now().toString().slice(-4)}`;
    const qrPass = `MARKETPILOT-PICKUP-${newOrderId}`;

    const newOrder: Order = {
      id: newOrderId,
      customerId: currentUser.id,
      customerName: checkoutData?.fullName || currentUser.name,
      customerEmail: currentUser.email,
      customerPhone: checkoutData?.phone || currentUser.phone,
      vendorId: cartItems[0]?.product.vendorId || 'ven_abc',
      items: cartItems.map((item, idx) => ({
        id: `item_${idx}`,
        product: item.product,
        quantity: item.quantity,
        deliveryType: item.deliveryType,
      })),
      subtotal: totalAmount,
      discountAmount: 0,
      totalAmount,
      deliveryType: cartItems.some((i) => i.deliveryType === 'pickup') ? 'pickup' : 'delivery',
      orderStatus: 'CONFIRMED',
      paymentMethod,
      paymentStatus: 'paid',
      pickupQRCode: qrPass,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: checkoutData?.addressLine
        ? `${checkoutData.addressLine}, ${checkoutData.city}, ${checkoutData.pincode}`
        : 'Indiranagar 100ft Road, Bengaluru, 560038',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);

    // Add Notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser.id,
        title: 'Order Confirmed! 🎉',
        message: `Order #${newOrderId} confirmed. QR pickup pass active!`,
        type: 'order',
        read: false,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);

    return newOrder;
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);
  const isDashboardPage =
    location.pathname.startsWith('/vendor-dashboard') ||
    location.pathname.startsWith('/admin-dashboard') ||
    location.pathname.startsWith('/vendor') ||
    location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {!isAuthPage && !isDashboardPage && currentUser && (
        <Navbar
          currentUser={currentUser}
          onSelectRole={(role) => {
            handleSelectRole(role);
            if (role === 'vendor') navigate('/vendor-dashboard');
            else if (role === 'admin') navigate('/admin-dashboard');
            else navigate('/home');
          }}
          onLogout={handleLogout}
          cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
          wishlistCount={wishlist.length}
          notifications={notifications}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenWishlist={() => navigate('/wishlist')}
          onOpenAIModal={() => navigate('/ai-assistant')}
          onOpenNotifications={() => navigate('/notifications')}
          onSearchSubmit={(q, pickup) =>
            navigate(`/search?q=${encodeURIComponent(q)}${pickup ? '&pickup=nearby' : ''}`)
          }
          onNavigate={(page) => {
            if (page === 'home') navigate('/home');
            else if (page === 'own-pickup') navigate('/pickup');
            else if (page === 'categories') navigate('/categories');
            else if (page === 'urgent-products') navigate('/search?pickup=nearby');
            else if (page === 'orders') navigate('/orders');
            else if (page === 'vendor-dashboard') navigate('/vendor-dashboard');
            else if (page === 'admin-dashboard') navigate('/admin-dashboard');
            else navigate(`/${page}`);
          }}
          currentPage={location.pathname.replace('/', '') || 'home'}
          userLocation={currentUserLocation.name}
          onChangeLocation={() => setIsLocationModalOpen(true)}
        />
      )}

      {/* Location Modal Triggered from Navbar */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentUserLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RootRedirect currentUser={currentUser} />} />

          <Route path="/login" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/forgot-password" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <HomePage
                  products={products}
                  stores={stores}
                  userLocation={currentUserLocation.name}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={(prod) => navigate(`/product/${prod.id}`)}
                  onReserveProduct={handleReserveProduct}
                  onOpenAIModal={() => navigate('/ai-assistant')}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <SearchPage
                  products={products}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <ProductDetailPage
                  products={products}
                  stores={stores}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onReserveProduct={handleReserveProduct}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <CartPage
                  cart={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={() => setCartItems([])}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <CheckoutPage
                  cart={cartItems}
                  stores={stores}
                  onProceedToPayment={(data) => setCheckoutData(data)}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <PaymentPage cart={cartItems} onCompletePayment={handleCompletePayment} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <OrderSuccessPage orders={orders} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <OrderSuccessPage orders={orders} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <OrdersPage orders={orders} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <OrderDetailPage orders={orders} currentUserLocation={currentUserLocation} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup/qr/:orderId"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <QRPassPage orders={orders} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <WishlistPage
                  products={products}
                  wishlist={wishlist}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <ProfilePage
                  currentUser={currentUser!}
                  orders={orders}
                  onSelectRole={handleSelectRole}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <NotificationsPage
                  notifications={notifications}
                  onMarkAllRead={() =>
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                  }
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map-view"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <MapViewPage
                  stores={stores}
                  products={products}
                  onReserveProduct={handleReserveProduct}
                  currentUserLocation={currentUserLocation}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <PickupHubPage
                  products={products}
                  stores={stores}
                  onReserveProduct={handleReserveProduct}
                  currentUserLocation={currentUserLocation}
                  onSelectLocation={handleSelectLocation}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup/product/:productId"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <ProductPickupPage
                  products={products}
                  stores={stores}
                  onReserveProduct={handleReserveProduct}
                  currentUserLocation={currentUserLocation}
                  onSelectLocation={handleSelectLocation}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup/reservation/:orderId"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <QRPassPage orders={orders} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pickup/store/:storeId"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <StoreDetailPage
                  stores={stores}
                  products={products}
                  onReserveProduct={handleReserveProduct}
                  onAddToCart={handleAddToCart}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute currentUser={currentUser}>
                <AIAssistantPage
                  products={products}
                  onAddToCart={handleAddToCart}
                  userRole={currentUser?.role}
                />
              </ProtectedRoute>
            }
          />

          {/* Role Protected Portals */}
          <Route
            path="/vendor-dashboard/*"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={['vendor', 'admin']}>
                <VendorDashboard
                  currentUser={currentUser!}
                  products={products}
                  orders={orders}
                  onAddProduct={(pData) =>
                    setProducts((prev) => [{ id: `prod_${Date.now()}`, ...pData } as any, ...prev])
                  }
                  onUpdateProduct={(id, pData) =>
                    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...pData } : p)))
                  }
                  onDeleteProduct={(id) => setProducts((prev) => prev.filter((p) => p.id !== id))}
                  onVerifyQR={(qr) => {
                    setOrders((prev) =>
                      prev.map((o) => (o.pickupQRCode === qr ? { ...o, orderStatus: 'PICKED_UP' } : o))
                    );
                  }}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute currentUser={currentUser} allowedRoles={['admin']}>
                <AdminDashboard
                  currentUser={currentUser!}
                  vendors={vendors}
                  orders={orders}
                  products={products}
                  onApproveVendor={(vId) =>
                    setVendors((prev) =>
                      prev.map((v) => (v.id === vId ? { ...v, isApproved: true } : v))
                    )
                  }
                />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<RootRedirect currentUser={currentUser} />} />
        </Routes>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />

      {/* Floating AI Chatbot Widget */}
      {!isAuthPage && (
        <AIChatbotWidget
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onSelectProduct={(prod) => navigate(`/pickup/product/${prod.id}`)}
          onAddToCart={(p, type) => {
            handleAddToCart(p, type);
            navigate('/cart');
          }}
          userLocation={currentUserLocation.name}
          userRole={currentUser?.role}
        />
      )}

      {!isAuthPage && <Footer />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

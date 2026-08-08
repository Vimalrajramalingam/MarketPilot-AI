import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_STORES,
  INITIAL_VENDORS,
  CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
} from './src/data/mockData.js';
import { Order, Product, Review, AppNotification } from './src/types.js';

// Setup ES Module globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database State
let users = [...INITIAL_USERS];
let products = [...INITIAL_PRODUCTS];
let stores = [...INITIAL_STORES];
let vendors = [...INITIAL_VENDORS];
let categories = [...CATEGORIES];
let coupons = [...INITIAL_COUPONS];
let reviews = [...INITIAL_REVIEWS];
let orders: Order[] = [...INITIAL_ORDERS];
let notifications: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_customer_1',
    title: 'Order Ready for Pickup! 🏪',
    message: 'Your order ORD-2026-8921 is ready at ABC Electronics - Indiranagar. Scan QR at store counter.',
    type: 'pickup',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'usr_customer_1',
    title: 'Item Shipped 🚚',
    message: 'Your Sony WH-1000XM5 headphones have been shipped and will be delivered tomorrow.',
    type: 'order',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Helper: Haversine distance in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

// Server-side Gemini AI Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // ==========================================
  // AUTH API
  // ==========================================
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const user = users.find((u) => u.email === email) || {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    res.json({
      token: `jwt_token_sample_${user.id}_${Date.now()}`,
      user,
    });
  });

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const { name, email, role, phone } = req.body;
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: role || 'customer',
      phone: phone || '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    users.push(newUser);

    // If signup as vendor, create a pending vendor profile
    if (role === 'vendor') {
      const newVendor = {
        id: `ven_${Date.now()}`,
        userId: newUser.id,
        storeName: `${name}'s Store`,
        description: 'New marketplace vendor',
        logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
        rating: 5.0,
        totalSales: 0,
        revenue: 0,
        isApproved: true, // auto-approve for testing
        joinedDate: new Date().toISOString().split('T')[0],
        stores: [],
      };
      vendors.push(newVendor);
    }

    res.json({ token: `jwt_token_sample_${newUser.id}`, user: newUser });
  });

  // ==========================================
  // PRODUCTS & SEARCH API
  // ==========================================
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, brand, search, pickup, maxPrice, minRating, sort, userLat, userLng } = req.query;

    let result = [...products];

    // Distance calculation if location coordinates provided
    if (userLat && userLng) {
      const uLat = parseFloat(userLat as string);
      const uLng = parseFloat(userLng as string);
      result = result.map((p) => {
        if (p.storeLat && p.storeLng) {
          const storeDist = calculateDistance(uLat, uLng, p.storeLat, p.storeLng);
          return {
            ...p,
            estimatedPickupTime: storeDist <= 2 ? '15 mins' : storeDist <= 5 ? '25 mins' : '45 mins',
          };
        }
        return p;
      });
    }

    if (category) {
      result = result.filter((p) => p.category.toLowerCase().includes((category as string).toLowerCase()));
    }
    if (brand) {
      result = result.filter((p) => p.brand.toLowerCase() === (brand as string).toLowerCase());
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    if (pickup === 'true' || pickup === 'nearby') {
      result = result.filter((p) => p.pickupAvailable);
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice as string));
    }
    if (minRating) {
      result = result.filter((p) => p.rating >= parseFloat(minRating as string));
    }

    // Sorting
    if (sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    res.json(result);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Find vendor & store info
    const store = stores.find((s) => s.id === product.storeId) || stores[0];
    const productReviews = reviews.filter((r) => r.productId === product.id);

    res.json({
      ...product,
      store,
      reviews: productReviews,
    });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const newProd: Product = {
      ...req.body,
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      discountPercentage: req.body.originalPrice
        ? Math.round(((req.body.originalPrice - req.body.price) / req.body.originalPrice) * 100)
        : 0,
    };
    products.unshift(newProd);
    res.status(201).json(newProd);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });
    products[idx] = { ...products[idx], ...req.body };
    res.json(products[idx]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    products = products.filter((p) => p.id !== req.params.id);
    res.json({ success: true });
  });

  // ==========================================
  // STORES & OWN PICKUP API
  // ==========================================
  app.get('/api/stores', (req: Request, res: Response) => {
    const { lat, lng, productId } = req.query;
    let result = [...stores];

    if (lat && lng) {
      const uLat = parseFloat(lat as string);
      const uLng = parseFloat(lng as string);
      result = result.map((s) => ({
        ...s,
        distanceKm: calculateDistance(uLat, uLng, s.lat, s.lng),
      }));
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    if (productId) {
      const prod = products.find((p) => p.id === productId);
      if (prod) {
        result = result.filter((s) => s.id === prod.storeId || s.vendorId === prod.vendorId);
      }
    }

    res.json(result);
  });

  // ==========================================
  // ORDERS & QR PICKUP API
  // ==========================================
  app.get('/api/orders', (req: Request, res: Response) => {
    const { customerId, vendorId, role } = req.query;
    let userOrders = [...orders];

    if (role === 'customer' && customerId) {
      userOrders = userOrders.filter((o) => o.customerId === customerId);
    } else if (role === 'vendor' && vendorId) {
      userOrders = userOrders.filter((o) => o.vendorId === vendorId || o.items.some((i) => i.product.vendorId === vendorId));
    }

    res.json(userOrders);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, deliveryType, pickupStore, shippingAddress, paymentMethod, customer } = req.body;
    
    const subtotal = items.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
    const discountAmount = deliveryType === 'pickup' ? 100 : 0; // Flat ₹100 pickup bonus
    const totalAmount = Math.max(0, subtotal - discountAmount);

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCode = `MP-QR-${orderId.split('-')[2]}-${pickupStore?.id || 'STORE'}`;

    const newOrder: Order = {
      id: orderId,
      customerId: customer?.id || 'usr_customer_1',
      customerName: customer?.name || 'Rahul Sharma',
      customerEmail: customer?.email || 'rahul@example.com',
      customerPhone: customer?.phone || '+91 98765 43210',
      items,
      subtotal,
      discountAmount,
      totalAmount,
      deliveryType,
      shippingAddress,
      pickupStore,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: deliveryType === 'pickup' ? 'READY_FOR_PICKUP' : 'PLACED',
      pickupQRCode: qrCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      vendorId: items[0]?.product?.vendorId || 'ven_abc',
    };

    orders.unshift(newOrder);

    // Create Notification
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: newOrder.customerId,
      title: deliveryType === 'pickup' ? 'Pickup Order Confirmed! 🏪' : 'Order Placed! 📦',
      message: deliveryType === 'pickup'
        ? `Order ${orderId} is ready at ${pickupStore?.name}. Present your QR code at store counter.`
        : `Order ${orderId} received. Estimated delivery in 2-3 days.`,
      type: deliveryType === 'pickup' ? 'pickup' : 'order',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json(newOrder);
  });

  // QR Code Verification Endpoint (Vendor scans QR code)
  app.post('/api/pickup/verify-qr', (req: Request, res: Response) => {
    const { qrCode, orderId } = req.body;
    const order = orders.find((o) => o.pickupQRCode === qrCode || o.id === orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Invalid or expired QR code.' });
    }

    if (order.orderStatus === 'PICKED_UP') {
      return res.status(400).json({ success: false, error: 'This order has already been picked up!' });
    }

    // Verify & update order status
    order.orderStatus = 'PICKED_UP';
    order.updatedAt = new Date().toISOString();

    // Create confirmation notification
    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: order.customerId,
      title: 'Order Picked Up Successfully! 🎉',
      message: `Thank you for picking up order ${order.id} from ${order.pickupStore?.name}. Hope you love your purchase!`,
      type: 'pickup',
      read: false,
      createdAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'QR Code verified successfully! Product handed over to customer.',
      order,
    });
  });

  // ==========================================
  // NOTIFICATIONS & REVIEWS API
  // ==========================================
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  app.put('/api/notifications/read-all', (req: Request, res: Response) => {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    res.json({ success: true });
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString().split('T')[0],
      helpfulVotes: 0,
    };
    reviews.unshift(newRev);

    // Update product rating
    const prod = products.find((p) => p.id === req.body.productId);
    if (prod) {
      prod.reviewCount += 1;
    }

    res.status(201).json(newRev);
  });

  // ==========================================
  // ANALYTICS API
  // ==========================================
  app.get('/api/analytics', (req: Request, res: Response) => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const pickupOrdersCount = orders.filter((o) => o.deliveryType === 'pickup').length;
    const pickupRate = totalOrders ? Math.round((pickupOrdersCount / totalOrders) * 100) : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers: users.length,
      totalVendors: vendors.length,
      totalProducts: products.length,
      pickupRate,
      salesByMonth: [
        { month: 'Mar', sales: 420000, pickupSales: 180000 },
        { month: 'Apr', sales: 550000, pickupSales: 240000 },
        { month: 'May', sales: 680000, pickupSales: 310000 },
        { month: 'Jun', sales: 820000, pickupSales: 390000 },
        { month: 'Jul', sales: 950000, pickupSales: 480000 },
        { month: 'Aug', sales: totalRevenue, pickupSales: Math.round(totalRevenue * (pickupRate / 100)) },
      ],
      categoryDistribution: [
        { name: 'Mobiles', value: 40 },
        { name: 'Audio', value: 25 },
        { name: 'Gaming Laptops', value: 20 },
        { name: 'Essentials', value: 15 },
      ],
      topVendors: [
        { name: 'ABC Electronics', sales: 1240, revenue: 845000 },
        { name: 'XYZ Mobiles', sales: 890, revenue: 612000 },
        { name: 'Tech World', sales: 2150, revenue: 2450000 },
      ],
      suspiciousActivityCount: 1, // Simulated fraud flag check
    });
  });

  // ==========================================
  // GEMINI AI INTEGRATIONS
  // ==========================================
  // 1. AI Assistant Endpoint (Customer & Vendor questions)
  app.post('/api/ai/shopping-assistant', async (req: Request, res: Response) => {
    const userPrompt = req.body.prompt || req.body.query || req.body.text || req.body.message || '';
    const { budget, category, userLocation, role } = req.body;
    const ai = getGeminiClient();

    // Check if query is vendor-focused or general platform question
    const qLower = userPrompt.toLowerCase();
    const isVendorQuery =
      role === 'vendor' ||
      qLower.includes('vendor') ||
      qLower.includes('qr') ||
      qLower.includes('stock') ||
      qLower.includes('inventory') ||
      qLower.includes('sell') ||
      qLower.includes('payout') ||
      qLower.includes('add product') ||
      qLower.includes('listing') ||
      qLower.includes('store') ||
      qLower.includes('sales') ||
      qLower.includes('analytics');

    if (!ai) {
      // Smart Fallback when GEMINI_API_KEY is not configured
      if (isVendorQuery) {
        if (qLower.includes('qr') || qLower.includes('verify')) {
          return res.json({
            reply: `To verify and complete a customer's pickup order:\n1. Go to Vendor Dashboard and open the "Verify QR Pickup" tab.\n2. Scan the customer's QR code or enter the order ID manually.\n3. Click "Verify & Complete Pickup". The status will immediately update to PICKED_UP and notify the customer.`,
            recommendedProducts: [],
            advice: `Always check customer phone number or name for security before handing over high-value electronics!`,
          });
        }
        if (qLower.includes('add') || qLower.includes('product') || qLower.includes('list')) {
          return res.json({
            reply: `To list new products on MarketPilot AI:\n1. Navigate to Vendor Dashboard -> "Products Management".\n2. Click "Add New Product" or use "Vendor AI Intelligence Hub".\n3. Use Gemini AI Generator to generate SEO descriptions, title keywords, and suggested pricing.\n4. Enable "15-Min Own Pickup" for your physical store locations to boost store footfall!`,
            recommendedProducts: [],
            advice: `Products with Own Pickup enabled receive up to 3.5x higher local conversion rates!`,
          });
        }
        if (qLower.includes('sale') || qLower.includes('boost') || qLower.includes('growth')) {
          return res.json({
            reply: `Here are 3 proven strategies to boost your sales on MarketPilot AI:\n1. Enable a 5% to 10% Own Pickup discount to draw nearby walk-in buyers.\n2. Maintain stock levels above 10 units for fast-moving chargers and accessories.\n3. Leverage our Gemini AI Business Coach to identify low stock risks and price optimization opportunities.`,
            recommendedProducts: [],
            advice: `Stores located near high-density hubs like Indiranagar and Koramangala see highest pickup volume between 5 PM - 8 PM.`,
          });
        }
        return res.json({
          reply: `As a MarketPilot AI partner vendor, you can manage inventory, scan pickup QR codes, view real-time sales analytics, and optimize listings using AI in your Vendor Dashboard.`,
          recommendedProducts: [],
          advice: `For additional assistance, switch between tabs in your Vendor Dashboard or ask specific questions about orders and listings!`,
        });
      }

      // Customer fallback
      const matching = products.filter((p) => {
        if (budget && p.price > budget) return false;
        if (category && !p.category.toLowerCase().includes(category.toLowerCase())) return false;
        if (userPrompt) {
          return userPrompt
            .toLowerCase()
            .split(' ')
            .some((w) => w.length > 3 && (p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w)));
        }
        return true;
      }).slice(0, 3);

      return res.json({
        reply: `Here are the top matches from our marketplace based on your request "${userPrompt}":`,
        recommendedProducts: matching.length > 0 ? matching : products.slice(0, 2),
        advice: `Pro tip: All of these products are available for 15-minute Own Pickup at nearby partner stores in ${userLocation || 'your area'}!`,
      });
    }

    try {
      const dbCatalogPrompt = JSON.stringify(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          price: `₹${p.price}`,
          category: p.category,
          brand: p.brand,
          rating: p.rating,
          pickupAvailable: p.pickupAvailable,
          estimatedPickupTime: p.estimatedPickupTime,
        }))
      );

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are MarketPilot AI Assistant — an intelligent, friendly AI advisor for the MarketPilot AI platform (an omni-channel marketplace supporting 15-minute Own Pickup store reservation with QR pass verification, as well as doorstep delivery across India).

You assist both CUSTOMERS (product recommendations, price comparisons, order tracking, pickup store information) and VENDORS (managing store listings, scanning customer QR passes, inventory stock optimization, sales growth strategies, payouts).

User Role: ${role || (isVendorQuery ? 'vendor' : 'customer')}
User City / Location: ${userLocation || 'Bengaluru, India'}
User Question: "${userPrompt}"
${budget ? `User Budget: ₹${budget}` : ''}
${category ? `Requested Category: ${category}` : ''}

Marketplace Product Catalog Snapshot:
${dbCatalogPrompt}

Provide a direct, thorough, clear, and expert response to the user's question.
If the question asks for product recommendations or shopping advice, select up to 3 exact product IDs from the catalog.
If the question is a vendor operations query, technical question, or platform feature question, provide detailed step-by-step guidance.

Respond strictly in JSON format with keys:
"reply": string (A complete, friendly, nicely formatted answer addressing the question thoroughly)
"recommendedProductIds": string[] (Array of matching product IDs from catalog if relevant, or [] if no products needed)
"advice": string (A helpful tip or recommendation for the customer or vendor)`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(aiResponse.text || '{}');
      const recommended = products.filter((p) => parsed.recommendedProductIds?.includes(p.id));

      res.json({
        reply: parsed.reply || `Here is the information regarding "${userPrompt}":`,
        recommendedProducts: recommended,
        advice: parsed.advice || (isVendorQuery ? 'Use Vendor Dashboard to track store metrics in real-time.' : 'Use 15-minute Own Pickup to collect your orders immediately with zero delivery fees!'),
      });
    } catch (err: any) {
      console.error('Gemini Assistant error:', err);
      res.json({
        reply: `Here is information on "${userPrompt}". MarketPilot AI provides 15-minute store pickup and doorstep delivery for customers, and full inventory & QR verification tools for vendors.`,
        recommendedProducts: isVendorQuery ? [] : products.slice(0, 2),
        advice: `You can access quick tools directly from the navigation bar or Vendor Dashboard!`,
      });
    }
  });

  // 2. Vendor AI Tools: Description Generator, Pricing & Stockout Prediction
  app.post('/api/ai/vendor/generate-description', async (req: Request, res: Response) => {
    const { title, category, features, targetPrice } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        title: `${title} - Premium Edition`,
        description: `High performance ${title} with ${features || 'top tier build quality and fast reliability'}. Designed for everyday convenience and high durability.`,
        seoKeywords: [title, category, 'fast pickup', 'marketplace deal', 'original warranty'],
        suggestedPrice: targetPrice || 999,
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Generate an e-commerce listing for product "${title}" in category "${category}". Key Features: "${features}". Proposed Price: ₹${targetPrice}.
Return JSON with keys: "title", "description", "seoKeywords" (array), "suggestedPrice" (number), "marginAdvice" (string).`,
        config: { responseMimeType: 'application/json' },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (e) {
      res.json({
        title: title,
        description: `Experience exceptional quality with ${title}. Perfect for home and professional use.`,
        seoKeywords: [title, category],
        suggestedPrice: targetPrice || 999,
      });
    }
  });

  app.post('/api/ai/vendor/business-coach', async (req: Request, res: Response) => {
    const { vendorId } = req.body;
    const vendorProds = products.filter((p) => p.vendorId === vendorId || p.vendorId === 'ven_abc');
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        insights: [
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
        ],
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analyze vendor inventory: ${JSON.stringify(vendorProds)}.
Generate 2 actionable business insights/predictions in JSON array format:
[ { "type": "inventory_alert" | "pricing_tip" | "demand_trend", "title": string, "message": string } ]`,
        config: { responseMimeType: 'application/json' },
      });

      res.json({ insights: JSON.parse(response.text || '[]') });
    } catch (e) {
      res.json({
        insights: [
          {
            type: 'inventory_alert',
            title: 'Inventory Speed Alert',
            message: 'Stock levels for fast-selling chargers are dropping. Consider re-stocking before the weekend rush.',
          },
        ],
      });
    }
  });

  // 3. AI Review Summarizer
  app.post('/api/ai/summarize-reviews', async (req: Request, res: Response) => {
    const { productId } = req.body;
    const prodReviews = reviews.filter((r) => r.productId === productId);
    const ai = getGeminiClient();

    if (!ai || prodReviews.length === 0) {
      return res.json({
        summary: 'Most customers praised the rapid store pickup speed, authentic build quality, and value for money.',
        pros: ['Fast 15-minute store pickup', 'Original brand warranty', 'High build quality'],
        cons: ['Limited color options in stock'],
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Summarize these product reviews: ${JSON.stringify(prodReviews)}.
Return JSON with keys: "summary" (short paragraph), "pros" (array of strings), "cons" (array of strings).`,
        config: { responseMimeType: 'application/json' },
      });

      res.json(JSON.parse(response.text || '{}'));
    } catch (e) {
      res.json({
        summary: 'Customers rated this product highly for build quality and immediate store pickup convenience.',
        pros: ['Great performance', 'Smooth store pickup'],
        cons: [],
      });
    }
  });

  // Vite Middleware for Development Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MarketPilot AI Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

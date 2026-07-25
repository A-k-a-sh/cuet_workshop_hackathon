import React, { createContext, useContext, useReducer, useEffect } from 'react';

const StoreContext = createContext();

const INITIAL_STATE = {
  currentUser: null,  // { id, name, role, suspended: false }

  users: [
    { id: 'u1', name: 'Alice',   role: 'shopper', suspended: false },
    { id: 'u2', name: 'Bob',     role: 'shopper', suspended: false },
    { id: 'v1', name: 'TechZone',role: 'vendor',  suspended: false },
    { id: 'v2', name: 'FreshMart',role:'vendor',  suspended: false },
    { id: 'a1', name: 'Admin',   role: 'admin',   suspended: false },
  ],

  products: [
    { id: 'p1', vendorId: 'v1', name: 'Wireless Headphones', price: 49.99, stock: 12, category: 'Electronics', image: '🎧', description: 'Premium sound quality' },
    { id: 'p2', vendorId: 'v1', name: 'USB-C Hub',           price: 29.99, stock: 8,  category: 'Electronics', image: '🔌', description: '7-in-1 hub' },
    { id: 'p3', vendorId: 'v2', name: 'Organic Coffee',      price: 14.99, stock: 50, category: 'Food',        image: '☕', description: 'Single origin beans' },
    { id: 'p4', vendorId: 'v2', name: 'Yoga Mat',            price: 34.99, stock: 20, category: 'Sports',      image: '🧘', description: 'Non-slip surface' },
    { id: 'p5', vendorId: 'v1', name: 'Mechanical Keyboard', price: 89.99, stock: 5,  category: 'Electronics', image: '⌨️', description: 'RGB backlit' },
  ],

  carts: {
    'u1': [],  // [{ productId, quantity }]
    'u2': [],
  },

  orders: [
    { id: 'o1', shopperId: 'u1', vendorId: 'v1', productId: 'p1', quantity: 1, total: 49.99, status: 'delivered', createdAt: '2026-07-20T10:00:00Z' },
    { id: 'o2', shopperId: 'u2', vendorId: 'v2', productId: 'p3', quantity: 2, total: 29.98, status: 'processing', createdAt: '2026-07-24T15:30:00Z' },
  ],

  activity: [
    { id: 'act1', type: 'order', message: 'Alice ordered Wireless Headphones', timestamp: '2026-07-24T15:30:00Z' },
  ]
};

const generateId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

function logActivity(activityList, type, message) {
  const newActivity = {
    id: generateId('act'),
    type,
    message,
    timestamp: new Date().toISOString()
  };
  // Prepend to show newest first, keep last 20 entries
  return [newActivity, ...activityList].slice(0, 20);
}

function storeReducer(state, action) {
  let updatedState = { ...state };
  const user = state.currentUser;

  switch (action.type) {
    case 'LOGIN': {
      const selectedUser = state.users.find(u => u.id === action.payload.userId);
      if (selectedUser) {
        updatedState.currentUser = selectedUser;
        updatedState.activity = logActivity(
          state.activity,
          'login',
          `${selectedUser.name} logged in as ${selectedUser.role}`
        );
      }
      break;
    }

    case 'LOGOUT': {
      if (user) {
        updatedState.currentUser = null;
        updatedState.activity = logActivity(
          state.activity,
          'logout',
          `${user.name} logged out`
        );
      }
      break;
    }

    case 'ADD_TO_CART': {
      if (!user || user.role !== 'shopper') break;
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product) break;

      const userCart = state.carts[user.id] ? [...state.carts[user.id]] : [];
      const itemIndex = userCart.findIndex(item => item.productId === productId);

      if (itemIndex > -1) {
        userCart[itemIndex] = {
          ...userCart[itemIndex],
          quantity: Math.min(product.stock, userCart[itemIndex].quantity + quantity)
        };
      } else {
        userCart.push({ productId, quantity: Math.min(product.stock, quantity) });
      }

      updatedState.carts = {
        ...state.carts,
        [user.id]: userCart
      };
      
      updatedState.activity = logActivity(
        state.activity,
        'cart',
        `${user.name} added ${product.name} to cart`
      );
      break;
    }

    case 'REMOVE_FROM_CART': {
      if (!user || user.role !== 'shopper') break;
      const { productId } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product) break;

      const userCart = state.carts[user.id] ? [...state.carts[user.id]] : [];
      const updatedCart = userCart.filter(item => item.productId !== productId);

      updatedState.carts = {
        ...state.carts,
        [user.id]: updatedCart
      };

      updatedState.activity = logActivity(
        state.activity,
        'cart',
        `${user.name} removed ${product.name} from cart`
      );
      break;
    }

    case 'UPDATE_CART_QUANTITY': {
      if (!user || user.role !== 'shopper') break;
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product || quantity <= 0) break;

      const userCart = state.carts[user.id] ? [...state.carts[user.id]] : [];
      const itemIndex = userCart.findIndex(item => item.productId === productId);

      if (itemIndex > -1) {
        userCart[itemIndex] = {
          ...userCart[itemIndex],
          quantity: Math.min(product.stock, quantity)
        };
        updatedState.carts = {
          ...state.carts,
          [user.id]: userCart
        };
      }
      break;
    }

    case 'PLACE_ORDER': {
      if (!user || user.role !== 'shopper') break;
      const userCart = state.carts[user.id] || [];
      if (userCart.length === 0) break;

      const newOrders = [];
      const updatedProducts = [...state.products];
      let activityLog = state.activity;

      for (const item of userCart) {
        const prodIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (prodIndex === -1) continue;
        const product = updatedProducts[prodIndex];

        // Ensure stock is available
        const checkoutQty = Math.min(product.stock, item.quantity);
        if (checkoutQty <= 0) continue;

        // Deduct stock
        updatedProducts[prodIndex] = {
          ...product,
          stock: product.stock - checkoutQty
        };

        const totalCost = product.price * checkoutQty;
        const orderId = generateId('ord');

        newOrders.push({
          id: orderId,
          shopperId: user.id,
          vendorId: product.vendorId,
          productId: product.id,
          quantity: checkoutQty,
          total: totalCost,
          status: 'processing',
          createdAt: new Date().toISOString()
        });

        activityLog = logActivity(
          activityLog,
          'order',
          `${user.name} placed order for ${checkoutQty}x ${product.name} ($${totalCost.toFixed(2)})`
        );
      }

      updatedState.orders = [...state.orders, ...newOrders];
      updatedState.products = updatedProducts;
      updatedState.carts = {
        ...state.carts,
        [user.id]: [] // Clear shopper cart
      };
      updatedState.activity = activityLog;
      break;
    }

    case 'ADD_PRODUCT': {
      if (!user || user.role !== 'vendor') break;
      const { name, price, stock, category, description, image } = action.payload;
      const newProduct = {
        id: generateId('prd'),
        vendorId: user.id,
        name,
        price: parseFloat(price) || 0.0,
        stock: parseInt(stock) || 0,
        category: category || 'General',
        image: image || '📦',
        description: description || ''
      };

      updatedState.products = [...state.products, newProduct];
      updatedState.activity = logActivity(
        state.activity,
        'product_add',
        `Vendor ${user.name} added new product "${name}"`
      );
      break;
    }

    case 'EDIT_PRODUCT': {
      if (!user || user.role !== 'vendor') break;
      const { productId, updates } = action.payload;
      
      updatedState.products = state.products.map(p => {
        if (p.id === productId && p.vendorId === user.id) {
          return {
            ...p,
            ...updates,
            price: updates.price !== undefined ? parseFloat(updates.price) : p.price,
            stock: updates.stock !== undefined ? parseInt(updates.stock) : p.stock
          };
        }
        return p;
      });

      const product = state.products.find(p => p.id === productId);
      updatedState.activity = logActivity(
        state.activity,
        'product_edit',
        `Vendor ${user.name} updated product "${product?.name || productId}"`
      );
      break;
    }

    case 'REMOVE_PRODUCT': {
      if (!user || user.role !== 'vendor') break;
      const { productId } = action.payload;
      const product = state.products.find(p => p.id === productId);

      updatedState.products = state.products.filter(p => p.id !== productId || p.vendorId !== user.id);
      updatedState.activity = logActivity(
        state.activity,
        'product_remove',
        `Vendor ${user.name} deleted product "${product?.name || productId}"`
      );
      break;
    }

    case 'SUSPEND_USER': {
      if (!user || user.role !== 'admin') break;
      const { userId } = action.payload;
      const targetUser = state.users.find(u => u.id === userId);

      if (targetUser) {
        updatedState.users = state.users.map(u => u.id === userId ? { ...u, suspended: true } : u);
        
        // Log out user if suspended is current user
        if (state.currentUser && state.currentUser.id === userId) {
          updatedState.currentUser = null;
        }

        updatedState.activity = logActivity(
          state.activity,
          'suspend',
          `Admin suspended user "${targetUser.name}"`
        );
      }
      break;
    }

    case 'REINSTATE_USER': {
      if (!user || user.role !== 'admin') break;
      const { userId } = action.payload;
      const targetUser = state.users.find(u => u.id === userId);

      if (targetUser) {
        updatedState.users = state.users.map(u => u.id === userId ? { ...u, suspended: false } : u);
        updatedState.activity = logActivity(
          state.activity,
          'reinstate',
          `Admin reinstated user "${targetUser.name}"`
        );
      }
      break;
    }

    case 'REMOVE_LISTING': {
      if (!user || user.role !== 'admin') break;
      const { productId } = action.payload;
      const product = state.products.find(p => p.id === productId);

      updatedState.products = state.products.filter(p => p.id !== productId);
      updatedState.activity = logActivity(
        state.activity,
        'admin_remove_listing',
        `Admin deleted product listing "${product?.name || productId}"`
      );
      break;
    }

    default:
      return state;
  }

  return updatedState;
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE, (initial) => {
    try {
      const saved = localStorage.getItem('marketplace');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset currentUser to null on refresh/re-load so they login again
        return { ...parsed, currentUser: null };
      }
    } catch (e) {
      console.error("Error loading localStorage state:", e);
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('marketplace', JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

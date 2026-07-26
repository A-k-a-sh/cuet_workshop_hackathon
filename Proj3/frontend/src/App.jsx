import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './store/store';
import { ToastProvider, useToast } from './store/toastStore';

// Components
import Login from './components/Login';
import ProductList from './components/shopper/ProductList';
import ProductDetail from './components/shopper/ProductDetail';
import Cart from './components/shopper/Cart';
import ProductManager from './components/vendor/ProductManager';
import OrderList from './components/vendor/OrderList';
import UserTable from './components/admin/UserTable';
import OrderTable from './components/admin/OrderTable';
import ActivityFeed from './components/admin/ActivityFeed';

const SHOPPER_BG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" fill="none"><defs><radialGradient id="g1" cx="80%" cy="20%" r="55%"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.22"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/></radialGradient><radialGradient id="g2" cx="20%" cy="80%" r="55%"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/><stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#g1)"/><rect width="1440" height="900" fill="url(#g2)"/><path d="M -100,250 Q 360,100 820,300 T 1540,250" stroke="#3b82f6" stroke-width="2.5" stroke-opacity="0.25" fill="none"/><path d="M -100,650 Q 360,800 820,600 T 1540,650" stroke="#3b82f6" stroke-width="2.5" stroke-opacity="0.2" fill="none"/></svg>`;
const VENDOR_BG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" fill="none"><defs><radialGradient id="g1" cx="80%" cy="20%" r="55%"><stop offset="0%" stop-color="#a855f7" stop-opacity="0.22"/><stop offset="100%" stop-color="#a855f7" stop-opacity="0"/></radialGradient><radialGradient id="g2" cx="20%" cy="80%" r="55%"><stop offset="0%" stop-color="#a855f7" stop-opacity="0.18"/><stop offset="100%" stop-color="#a855f7" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#g1)"/><rect width="1440" height="900" fill="url(#g2)"/><path d="M -100,250 Q 360,100 820,300 T 1540,250" stroke="#a855f7" stroke-width="2.5" stroke-opacity="0.25" fill="none"/><path d="M -100,650 Q 360,800 820,600 T 1540,650" stroke="#a855f7" stroke-width="2.5" stroke-opacity="0.2" fill="none"/></svg>`;
const ADMIN_BG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" fill="none"><defs><radialGradient id="g1" cx="80%" cy="20%" r="55%"><stop offset="0%" stop-color="#64748b" stop-opacity="0.25"/><stop offset="100%" stop-color="#64748b" stop-opacity="0"/></radialGradient><radialGradient id="g2" cx="20%" cy="80%" r="55%"><stop offset="0%" stop-color="#64748b" stop-opacity="0.2"/><stop offset="100%" stop-color="#64748b" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#g1)"/><rect width="1440" height="900" fill="url(#g2)"/><path d="M -100,250 Q 360,100 820,300 T 1540,250" stroke="#64748b" stroke-width="2.5" stroke-opacity="0.25" fill="none"/><path d="M -100,650 Q 360,800 820,600 T 1540,650" stroke="#64748b" stroke-width="2.5" stroke-opacity="0.2" fill="none"/></svg>`;
const LOGIN_BG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" fill="none"><defs><radialGradient id="g1" cx="80%" cy="20%" r="55%"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.22"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0"/></radialGradient><radialGradient id="g2" cx="20%" cy="80%" r="55%"><stop offset="0%" stop-color="#6366f1" stop-opacity="0.18"/><stop offset="100%" stop-color="#6366f1" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#g1)"/><rect width="1440" height="900" fill="url(#g2)"/><path d="M -100,250 Q 360,100 820,300 T 1540,250" stroke="#6366f1" stroke-width="2.5" stroke-opacity="0.25" fill="none"/><path d="M -100,650 Q 360,800 820,600 T 1540,650" stroke="#6366f1" stroke-width="2.5" stroke-opacity="0.2" fill="none"/></svg>`;

// Inner App component that consumes contexts
function MarketplaceApp() {
  const { state, dispatch } = useStore();
  const { toasts, removeToast } = useToast();

  const [view, setView] = useState('login'); // 'login' | 'shopper' | 'vendor' | 'admin'
  const [activeTab, setActiveTab] = useState(''); // role-specific tab names
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Cart bounce effect state
  const [cartBounce, setCartBounce] = useState(false);
  const [fadeEffect, setFadeEffect] = useState(true);

  const currentUser = state.currentUser;

  // Calculate cart total count
  const cartItemsCount = React.useMemo(() => {
    if (!currentUser || currentUser.role !== 'shopper') return 0;
    const userCart = state.carts[currentUser.id] || [];
    return userCart.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.carts, currentUser]);

  // Trigger cart bounce animation on count change
  useEffect(() => {
    if (cartItemsCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItemsCount]);

  // Fade animation on view switch
  useEffect(() => {
    setFadeEffect(false);
    const timer = setTimeout(() => setFadeEffect(true), 50);
    return () => clearTimeout(timer);
  }, [view]);

  // Setup default tabs when logging in
  const handleLoginSuccess = (user) => {
    setView(user.role);
    if (user.role === 'shopper') {
      setActiveTab('catalog');
    } else if (user.role === 'vendor') {
      setActiveTab('inventory');
    } else if (user.role === 'admin') {
      setActiveTab('users');
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setView('login');
    setActiveTab('');
    setSelectedProductId(null);
  };

  // Role details configuration
  const roleConfig = React.useMemo(() => {
    if (!currentUser) return { colorClass: 'indigo', label: 'Guest', bannerBg: 'bg-indigo-600' };
    
    switch (currentUser.role) {
      case 'shopper':
        return {
          colorClass: 'blue',
          label: 'Customer Mode',
          bannerBg: 'bg-blue-600',
          accentText: 'text-blue-500',
          hoverText: 'hover:text-blue-400',
          borderActive: 'border-blue-500',
          btnActive: 'bg-blue-600 hover:bg-blue-700 text-white',
          btnLight: 'bg-blue-50 text-blue-650 hover:bg-blue-100 border-blue-200/50'
        };
      case 'vendor':
        return {
          colorClass: 'purple',
          label: 'Merchant Portal',
          bannerBg: 'bg-purple-600',
          accentText: 'text-purple-500',
          hoverText: 'hover:text-purple-400',
          borderActive: 'border-purple-500',
          btnActive: 'bg-purple-600 hover:bg-purple-700 text-white',
          btnLight: 'bg-purple-50 text-purple-650 hover:bg-purple-100 border-purple-200/50'
        };
      case 'admin':
        return {
          colorClass: 'slate',
          label: 'Admin Control Center',
          bannerBg: 'bg-slate-700',
          accentText: 'text-slate-500',
          hoverText: 'hover:text-slate-400',
          borderActive: 'border-slate-500',
          btnActive: 'bg-slate-700 hover:bg-slate-800 text-white',
          btnLight: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/50'
        };
      default:
        return { colorClass: 'indigo', label: 'User', bannerBg: 'bg-indigo-600' };
    }
  }, [currentUser]);

  const activeBgSvg = React.useMemo(() => {
    const rawSvg = currentUser?.role === 'shopper'
      ? SHOPPER_BG_SVG
      : currentUser?.role === 'vendor'
      ? VENDOR_BG_SVG
      : currentUser?.role === 'admin'
      ? ADMIN_BG_SVG
      : LOGIN_BG_SVG;
    return `data:image/svg+xml;base64,${window.btoa(rawSvg)}`;
  }, [currentUser]);

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans relative overflow-hidden transition-all duration-300"
      style={{
        backgroundImage: `url("${activeBgSvg}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_40%,#000_50%,transparent_100%)] opacity-20 dark:opacity-30 pointer-events-none"></div>

      
      {/* Floating Toast System Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 cursor-pointer animate-[slideIn_200ms_ease-out] ${
              t.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400'
                : t.type === 'warning'
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-red-500/20 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {t.type === 'success' ? (
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            ) : t.type === 'warning' ? (
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="text-xs font-bold tracking-wide">{t.message}</span>
          </div>
        ))}
      </div>

      {/* App Views rendering */}
      {view === 'login' ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className={`flex flex-col md:flex-row flex-1 transition-opacity duration-300 ${fadeEffect ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Responsive Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
            {/* Header / Brand */}
            <div className={`p-6 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-lg ${roleConfig.bannerBg} text-white font-black`}>
                M
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-sm tracking-tight text-white leading-none">MarketProto</h3>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">Roleplay Sandbox</span>
              </div>
            </div>

            {/* User Access Flag */}
            <div className="px-6 py-4 text-left border-b border-slate-800/60 bg-slate-950/20">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Active Account</span>
              <p className="font-extrabold text-sm text-slate-200 mt-1">{currentUser?.name}</p>
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1.5 inline-block ${roleConfig.bannerBg} text-white`}>
                {roleConfig.label}
              </span>
            </div>

            {/* Navigation tabs */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
              
              {/* Shopper navigation */}
              {currentUser?.role === 'shopper' && (
                <>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('catalog'); setSelectedProductId(null); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'catalog' || activeTab === 'detail'
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>🛍️</span>
                    <span>Product Catalog</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('cart'); setSelectedProductId(null); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'cart'
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>🛒</span>
                      <span>Shopping Cart</span>
                    </div>
                    {cartItemsCount > 0 && (
                      <span className={`px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-4xs font-black transition-all ${
                        cartBounce ? 'scale-130 animate-pulse' : 'scale-100'
                      }`}>
                        {cartItemsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* Vendor navigation */}
              {currentUser?.role === 'vendor' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'inventory'
                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>🏬</span>
                    <span>Inventory Manager</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'orders'
                        ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>📊</span>
                    <span>Sales Orders</span>
                  </button>
                </>
              )}

              {/* Admin navigation */}
              {currentUser?.role === 'admin' && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'users'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>User Directory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'orders'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>💼</span>
                    <span>Sales & Listings Audit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      activeTab === 'activity'
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span>⚡</span>
                    <span>Live Audit Logs</span>
                  </button>
                </>
              )}
            </nav>

            {/* Logout control */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-700"
              >
                <span>Logout</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </aside>

          {/* Main Workspace Frame */}
          <main className="flex-1 bg-slate-50 dark:bg-slate-950 py-8 px-6 md:px-8 max-w-6xl mx-auto w-full flex flex-col gap-6 overflow-y-auto">
            {/* Context Tab Routing */}
            {currentUser.role === 'shopper' && (
              <>
                {activeTab === 'catalog' && (
                  <ProductList
                    onSelectProduct={(id) => { setSelectedProductId(id); setActiveTab('detail'); }}
                  />
                )}
                {activeTab === 'detail' && (
                  <ProductDetail
                    productId={selectedProductId}
                    onBack={() => { setActiveTab('catalog'); setSelectedProductId(null); }}
                    onAddToCartTriggered={() => {}}
                  />
                )}
                {activeTab === 'cart' && (
                  <Cart onOrderPlacedSuccess={() => setActiveTab('catalog')} />
                )}
              </>
            )}

            {currentUser.role === 'vendor' && (
              <>
                {activeTab === 'inventory' && <ProductManager />}
                {activeTab === 'orders' && <OrderList />}
              </>
            )}

            {currentUser.role === 'admin' && (
              <>
                {activeTab === 'users' && <UserTable />}
                {activeTab === 'orders' && <OrderTable />}
                {activeTab === 'activity' && <ActivityFeed />}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <MarketplaceApp />
      </ToastProvider>
    </StoreProvider>
  );
}

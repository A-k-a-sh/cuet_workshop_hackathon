import React, { useMemo } from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

export default function OrderTable() {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();

  // Enrich order data
  const enrichedOrders = useMemo(() => {
    return state.orders.map(order => {
      const product = state.products.find(p => p.id === order.productId);
      const shopper = state.users.find(u => u.id === order.shopperId);
      const vendor = state.users.find(u => u.id === order.vendorId);
      return {
        ...order,
        product,
        shopper,
        vendor
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [state.orders, state.products, state.users]);

  // Calculations
  const platformRevenue = useMemo(() => {
    return state.orders.reduce((sum, o) => sum + o.total, 0);
  }, [state.orders]);

  const totalSalesCount = state.orders.length;

  const handleRemoveListing = (productId, name) => {
    if (window.confirm(`Are you sure you want to remove listing "${name}" from the platform?`)) {
      dispatch({ type: 'REMOVE_LISTING', payload: { productId } });
      addToast(`Listing "${name}" removed by Admin.`, 'warning');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Revenue metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-left shadow-sm">
          <p className="text-4xs font-extrabold uppercase tracking-wider text-slate-400">Cumulative Platform Revenue</p>
          <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            ${platformRevenue.toFixed(2)}
          </h4>
          <span className="text-[10px] text-green-500 font-semibold bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded mt-2 inline-block">
            100% Marketplace Sales volume
          </span>
        </div>

        {/* Orders Count Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-left shadow-sm">
          <p className="text-4xs font-extrabold uppercase tracking-wider text-slate-400">Total Checkout Transactions</p>
          <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
            {totalSalesCount}
          </h4>
          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded mt-2 inline-block">
            Active orders processed
          </span>
        </div>
      </div>

      {/* Global Orders Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
        <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            Global Checkout Audit
          </h3>
          <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
            Audit logging of every financial transaction processed across shoppers and vendors
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="text-4xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 pl-2">ID</th>
                <th className="pb-3">Buyer</th>
                <th className="pb-3">Seller</th>
                <th className="pb-3">Product</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3">Total</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right pr-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {enrichedOrders.map((order) => {
                const statusColors = order.status === 'delivered'
                  ? 'bg-green-50 dark:bg-green-950/20 text-green-500 font-bold border-green-200/50'
                  : order.status === 'processing'
                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-bold border-amber-200/50'
                  : 'bg-red-50 dark:bg-red-950/20 text-red-500 font-bold border-red-200/50';

                const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr key={order.id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/15">
                    <td className="py-3.5 pl-2 font-mono font-bold text-slate-400 uppercase">{order.id}</td>
                    <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">{order.shopper?.name || 'Deleted User'}</td>
                    <td className="py-3.5 font-semibold text-slate-500 dark:text-slate-400">{order.vendor?.name || 'Deleted Shop'}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base shrink-0">{order.product?.image || '📦'}</span>
                        <span className="font-semibold truncate max-w-[100px]">{order.product?.name || 'Deleted Product'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-bold">{order.quantity}</td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</td>
                    <td className="py-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-4xs border uppercase tracking-wider ${statusColors}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right pr-2 text-slate-400 font-medium">{orderDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {enrichedOrders.length === 0 && (
          <div className="py-8 text-center text-slate-400 w-full">
            <p className="text-xs font-semibold">No platform orders recorded.</p>
          </div>
        )}
      </div>

      {/* Global Product Listings Moderation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
        <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            Catalog Listings Moderation
          </h3>
          <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
            Moderate product details, listings indexation, and take down policy-violating items
          </p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="text-4xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="pb-3 pl-2">Product</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3 text-center">Stock</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {state.products.map((product) => {
                const vendor = state.users.find(u => u.id === product.vendorId);
                return (
                  <tr key={product.id} className="text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/15">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-center shrink-0 border border-slate-100/50 dark:border-slate-800">
                          {product.image}
                        </span>
                        <span className="font-bold truncate max-w-[120px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-500">{vendor?.name || 'Unknown'}</td>
                    <td className="py-3.5 capitalize">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded text-4xs uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold">${product.price.toFixed(2)}</td>
                    <td className="py-3.5 text-center font-bold">{product.stock}</td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveListing(product.id, product.name)}
                        className="text-4xs font-bold uppercase tracking-wider text-red-500 hover:text-red-650 cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

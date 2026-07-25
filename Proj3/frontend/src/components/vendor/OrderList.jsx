import React, { useMemo } from 'react';
import { useStore } from '../../store/store';

export default function OrderList() {
  const { state } = useStore();
  const user = state.currentUser;

  // Filter vendor's own orders
  const vendorOrders = useMemo(() => {
    return state.orders.filter(order => order.vendorId === user?.id);
  }, [state.orders, user]);

  // Enrich order data with product and shopper info
  const enrichedOrders = useMemo(() => {
    return vendorOrders.map(order => {
      const product = state.products.find(p => p.id === order.productId);
      const shopper = state.users.find(u => u.id === order.shopperId);
      return {
        ...order,
        product,
        shopper
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [vendorOrders, state.products, state.users]);

  // Total sales calculation
  const totalSales = useMemo(() => {
    return enrichedOrders.reduce((sum, o) => sum + o.total, 0);
  }, [enrichedOrders]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4 gap-4">
        <div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            Sales Orders History
          </h3>
          <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
            View customer purchases, order statuses, and transaction details
          </p>
        </div>

        {/* Sales Stats Box */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2 shrink-0">
          <p className="text-4xs font-extrabold uppercase tracking-wider text-slate-400">Total Store Sales</p>
          <p className="text-lg font-black text-purple-650 dark:text-purple-400">${totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="text-4xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 pl-2">Order ID</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Product</th>
              <th className="pb-3 text-center">Qty</th>
              <th className="pb-3">Total</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-right pr-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {enrichedOrders.map((order) => {
              const statusColors = order.status === 'delivered'
                ? 'bg-green-50 dark:bg-green-950/20 text-green-500 font-bold border-green-200/50'
                : order.status === 'processing'
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-bold border-amber-200/50'
                : 'bg-red-50 dark:bg-red-950/20 text-red-500 font-bold border-red-200/50';

              const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <tr key={order.id} className="text-xs text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/15">
                  <td className="py-3.5 pl-2 font-mono font-bold text-slate-400 uppercase">
                    {order.id}
                  </td>
                  <td className="py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {order.shopper?.name || 'Unknown'}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg shrink-0">{order.product?.image || '📦'}</span>
                      <span className="font-semibold truncate max-w-[120px]">{order.product?.name || 'Deleted Product'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-center font-bold">
                    {order.quantity}
                  </td>
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-4xs uppercase border tracking-wider ${statusColors}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-2 text-slate-400 font-medium">
                    {orderDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {enrichedOrders.length === 0 && (
        <div className="py-12 text-center text-slate-400 dark:text-slate-550 w-full">
          <svg className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-xs font-semibold">No sales orders found yet.</p>
        </div>
      )}
    </div>
  );
}

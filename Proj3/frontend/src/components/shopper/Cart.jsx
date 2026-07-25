import React from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

export default function Cart({ onOrderPlacedSuccess }) {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();

  const user = state.currentUser;
  const userCart = user ? state.carts[user.id] || [] : [];

  // Map cart items to product data
  const cartItems = userCart.map(item => {
    const product = state.products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product !== undefined);

  // Compute Grand Total
  const grandTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleQtyChange = (productId, currentQty, delta, stockLimit) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
      addToast('Item removed from cart.', 'warning');
    } else {
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: { productId, quantity: Math.min(stockLimit, newQty) }
      });
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
    addToast('Item removed from cart.', 'warning');
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    dispatch({ type: 'PLACE_ORDER' });
    addToast('Order placed successfully!', 'success');
    if (onOrderPlacedSuccess) onOrderPlacedSuccess();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left w-full">
      <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
          Your Shopping Cart
        </h3>
        <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
          Review items, adjust quantities, and complete checkout
        </p>
      </div>

      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              return (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 bg-slate-50 dark:bg-slate-855/40 p-4 rounded-xl border border-slate-100/50 dark:border-slate-850 hover:shadow-xs transition-shadow"
                >
                  {/* Small Emoji wrapper */}
                  <div className="h-16 w-16 rounded-lg bg-white dark:bg-slate-700/60 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shrink-0">
                    {item.product.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5 capitalize">
                      Category: {item.product.category}
                    </p>
                    <p className="text-xs font-black text-slate-900 dark:text-white mt-1.5">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 p-1 rounded-lg gap-2">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity, -1, item.product.stock)}
                        className="h-6 w-6 rounded flex items-center justify-center text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 min-w-[12px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(item.productId, item.quantity, 1, item.product.stock)}
                        disabled={item.quantity >= item.product.stock}
                        className={`h-6 w-6 rounded flex items-center justify-center text-xs font-bold cursor-pointer ${
                          item.quantity >= item.product.stock
                            ? 'text-slate-200 dark:text-slate-700 cursor-not-allowed'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-750'
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:text-red-650 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Subtotal */}
                  <div className="w-20 text-right shrink-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="w-full lg:w-1/3 bg-slate-50 dark:bg-slate-855/65 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Order Summary
            </h4>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">${grandTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-slate-500">Shipping</span>
              <span className="font-semibold text-green-500">FREE</span>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-slate-900 dark:text-white mt-1">
              <span>Total Price</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-99 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md shadow-blue-600/10 transition-all cursor-pointer text-center mt-2"
            >
              Checkout & Place Order
            </button>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-slate-450 dark:text-slate-550 w-full">
          <svg className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-xs font-bold">Your cart is currently empty.</p>
          <p className="text-3xs text-slate-400 mt-1">Explore our product catalog to add items to your cart!</p>
        </div>
      )}
    </div>
  );
}

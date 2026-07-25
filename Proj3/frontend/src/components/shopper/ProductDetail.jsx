import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

export default function ProductDetail({ productId, onBack, onAddToCartTriggered }) {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = state.products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
        <p className="text-slate-500 font-semibold text-xs">Product not found.</p>
        <button onClick={onBack} className="text-blue-500 hover:underline font-bold text-xs mt-3 cursor-pointer">
          Back to store
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleQtyChange = (val) => {
    setQuantity(prev => {
      const newQty = prev + val;
      if (newQty < 1) return 1;
      if (newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId: product.id, quantity } });
    addToast(`Added ${quantity} item(s) to cart!`, 'success');
    if (onAddToCartTriggered) onAddToCartTriggered();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to store
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Product Image */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl h-64 flex items-center justify-center text-7xl shadow-inner border border-slate-100/50 dark:border-slate-850">
          {product.image}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-1 rounded-full">
              {product.category}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isOutOfStock
                ? 'bg-red-50 dark:bg-red-950/30 text-red-500'
                : product.stock <= 3
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500 animate-pulse'
                : 'bg-slate-50 dark:bg-slate-800/55 text-slate-500'
            }`}>
              {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock} units`}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {product.name}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            {product.description || 'No description provided for this product.'}
          </p>

          <div className="text-2xl font-black text-slate-900 dark:text-white border-t border-b border-slate-50 dark:border-slate-800/60 py-3 mt-2 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Price per unit:</span>
            <span>${product.price.toFixed(2)}</span>
          </div>

          {!isOutOfStock && (
            <div className="flex items-center justify-between gap-4 mt-2">
              <span className="text-xs font-bold text-slate-400">Quantity:</span>
              <div className="flex items-center bg-slate-50 dark:bg-slate-800/70 border border-slate-150 dark:border-slate-750 p-1.5 rounded-xl gap-3">
                <button
                  type="button"
                  onClick={() => handleQtyChange(-1)}
                  disabled={quantity <= 1}
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                    quantity <= 1
                      ? 'text-slate-350 dark:text-slate-650 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-750 dark:text-slate-200 border border-slate-200/50 dark:border-slate-600 shadow-2xs'
                  }`}
                >
                  -
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-white px-2 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQtyChange(1)}
                  disabled={quantity >= product.stock}
                  className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                    quantity >= product.stock
                      ? 'text-slate-350 dark:text-slate-650 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-750 dark:text-slate-200 border border-slate-200/50 dark:border-slate-600 shadow-2xs'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`w-full py-3 px-6 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed border border-slate-200/50'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-99'
              }`}
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add {quantity > 1 ? `${quantity} items ` : ''}to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

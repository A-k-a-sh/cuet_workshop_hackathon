import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

export default function ProductList({ onSelectProduct, onAddToCartTriggered }) {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Food', 'Sports'];

  const filteredProducts = useMemo(() => {
    return state.products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [state.products, searchTerm, activeCategory]);

  const handleAddToCart = (e, productId) => {
    e.stopPropagation(); // Avoid triggering details select
    dispatch({ type: 'ADD_TO_CART', payload: { productId, quantity: 1 } });
    addToast('Added to cart!', 'success');
    if (onAddToCartTriggered) onAddToCartTriggered();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-4 py-2.5 pl-10 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold shadow-xs"
          />
          <div className="absolute left-3 top-3.5 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const isLowStock = product.stock > 0 && product.stock <= 3;
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              <div>
                {/* Emoji image container */}
                <div className="h-40 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-center text-5xl mb-4 group-hover:scale-102 transition-transform">
                  {product.image}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                  
                  {isOutOfStock ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded animate-pulse">
                      Low Stock: {product.stock} left
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 px-2 py-0.5 rounded">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>

                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm mt-3 text-left leading-tight group-hover:text-blue-500 transition-colors">
                  {product.name}
                </h4>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-left line-clamp-2 h-8">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-3 mt-4">
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                  ${product.price.toFixed(2)}
                </span>
                
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed border border-slate-200/50 dark:border-slate-750'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
                  }`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add To Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12 text-center text-slate-450">
          <svg className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs font-semibold">No products found matching your search parameters.</p>
        </div>
      )}
    </div>
  );
}

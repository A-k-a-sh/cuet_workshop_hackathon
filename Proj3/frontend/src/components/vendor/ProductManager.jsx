import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/store';
import { useToast } from '../../store/toastStore';

const EMOJI_OPTIONS = ['🎧', '🔌', '☕', '🧘', '⌨️', '📦', '💻', '🎒', '⌚', '🍎', '👕', '📚'];

export default function ProductManager() {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newlyAddedId, setNewlyAddedId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [image, setImage] = useState('📦');
  const [description, setDescription] = useState('');

  const user = state.currentUser;
  
  // Filter vendor's own products
  const vendorProducts = state.products.filter(p => p.vendorId === user?.id);

  // Clear new item highlight after 2.5 seconds
  useEffect(() => {
    if (newlyAddedId) {
      const timer = setTimeout(() => setNewlyAddedId(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [newlyAddedId]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setCategory('Electronics');
    setImage('📦');
    setDescription('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setCategory(product.category);
    setImage(product.image);
    setDescription(product.description || '');
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !stock) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    const payload = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      image,
      description
    };

    if (editingId) {
      // Update
      dispatch({ type: 'EDIT_PRODUCT', payload: { productId: editingId, updates: payload } });
      addToast('Product updated successfully!', 'success');
      resetForm();
    } else {
      // Add
      // Track original list size to grab the newly created ID
      const prevIds = state.products.map(p => p.id);
      
      dispatch({ type: 'ADD_PRODUCT', payload });
      addToast('Product added to your store!', 'success');
      
      // Find the new id that was just generated
      setTimeout(() => {
        const currentProducts = JSON.parse(localStorage.getItem('marketplace'))?.products || [];
        const newProduct = currentProducts.find(p => p.vendorId === user.id && !prevIds.includes(p.id));
        if (newProduct) {
          setNewlyAddedId(newProduct.id);
        }
      }, 50);

      resetForm();
    }
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      dispatch({ type: 'REMOVE_PRODUCT', payload: { productId } });
      addToast('Listing deleted successfully.', 'warning');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
            Product Listing Manager
          </h3>
          <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
            Add new items, manage details, and update stock inventory
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-3xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md shadow-purple-600/15 cursor-pointer active:scale-95 transition-all"
        >
          {showForm ? 'Close Form' : 'Add New Product'}
        </button>
      </div>

      {/* Slide down / Slide in Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn transition-all">
          <div className="md:col-span-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              {editingId ? 'Edit Product Details' : 'Add A New Store Listing'}
            </h4>
            <button type="button" onClick={resetForm} className="text-4xs font-bold text-slate-400 hover:text-slate-600 uppercase">Cancel</button>
          </div>

          {/* Product Name */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label htmlFor="prod-name" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Product Name *</label>
            <input
              id="prod-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold"
              placeholder="e.g. Mechanical Keyboard"
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prod-cat" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</label>
            <select
              id="prod-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold cursor-pointer"
            >
              <option value="Electronics">Electronics</option>
              <option value="Food">Food</option>
              <option value="Sports">Sports</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prod-price" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Price ($) *</label>
            <input
              id="prod-price"
              type="number"
              step="0.01"
              required
              min="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold"
              placeholder="0.00"
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prod-stock" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Stock Quantity *</label>
            <input
              id="prod-stock"
              type="number"
              required
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold"
              placeholder="0"
            />
          </div>

          {/* Image (Emoji) picker */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prod-emoji" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Icon / Emoji</label>
            <select
              id="prod-emoji"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-semibold cursor-pointer"
            >
              {EMOJI_OPTIONS.map(emo => (
                <option key={emo} value={emo}>{emo}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5 md:col-span-3">
            <label htmlFor="prod-desc" className="text-4xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Product Description</label>
            <textarea
              id="prod-desc"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
              placeholder="Describe features or characteristics..."
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer shadow-md shadow-purple-600/10 transition-all"
            >
              {editingId ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          <thead>
            <tr className="text-4xs uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-3 pl-2">Product</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3 text-center">Stock</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {vendorProducts.map((product) => {
              const isNewlyAdded = newlyAddedId === product.id;
              return (
                <tr
                  key={product.id}
                  className={`text-xs text-slate-700 dark:text-slate-300 transition-all duration-1000 ${
                    isNewlyAdded
                      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/15'
                  }`}
                >
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-slate-50 dark:bg-slate-800 h-10 w-10 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center shrink-0">
                        {product.image}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{product.name}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="text-4xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      product.stock === 0
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-500'
                        : product.stock <= 3
                        ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-500 font-bold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="inline-flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleEditClick(product)}
                        className="text-4xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-4xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {vendorProducts.length === 0 && (
        <div className="py-12 text-center text-slate-400 dark:text-slate-500 w-full">
          <svg className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-xs font-semibold">You have no products listed in your store.</p>
          <p className="text-3xs text-slate-400 mt-1">Click "Add New Product" to publish your first item listing!</p>
        </div>
      )}
    </div>
  );
}

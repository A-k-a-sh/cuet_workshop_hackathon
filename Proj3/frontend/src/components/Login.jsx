import React, { useState } from 'react';
import { useStore } from '../store/store';
import { useToast } from '../store/toastStore';

export default function Login({ onLoginSuccess }) {
  const { state, dispatch } = useStore();
  const { addToast } = useToast();
  const [selectedRole, setSelectedRole] = useState('shopper'); // 'shopper' | 'vendor' | 'admin'
  const [selectedUserId, setSelectedUserId] = useState('u1'); // defaults to Alice

  // Group users by role
  const shoppers = state.users.filter(u => u.role === 'shopper');
  const vendors = state.users.filter(u => u.role === 'vendor');
  const admins = state.users.filter(u => u.role === 'admin');

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'shopper') {
      setSelectedUserId(shoppers[0]?.id || '');
    } else if (role === 'vendor') {
      setSelectedUserId(vendors[0]?.id || '');
    } else if (role === 'admin') {
      setSelectedUserId(admins[0]?.id || '');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = state.users.find(u => u.id === selectedUserId);
    
    if (!user) {
      addToast('Please select a valid user.', 'error');
      return;
    }

    if (user.suspended) {
      addToast('This account is suspended by Admin.', 'error');
      return;
    }

    dispatch({ type: 'LOGIN', payload: { userId: user.id } });
    addToast(`Welcome back, ${user.name}!`, 'success');
    onLoginSuccess(user);
  };

  const rolesConfig = [
    {
      role: 'shopper',
      title: 'Shopper',
      emoji: '🛒',
      desc: 'Browse catalogs, add items to cart, checkout orders, and track deliveries.',
      gradient: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10 hover:shadow-blue-500/20 border-blue-500/10'
    },
    {
      role: 'vendor',
      title: 'Vendor',
      emoji: '🏬',
      desc: 'Manage store listings, inventory stocks, add new products, and review order tables.',
      gradient: 'from-purple-500 to-fuchsia-600',
      shadow: 'shadow-purple-500/10 hover:shadow-purple-500/20 border-purple-500/10'
    },
    {
      role: 'admin',
      title: 'Admin',
      emoji: '🛡️',
      desc: 'Moderate platform accounts, toggle suspensions, delete listings, and track live feeds.',
      gradient: 'from-slate-500 to-slate-700',
      shadow: 'shadow-slate-500/10 hover:shadow-slate-500/20 border-slate-500/10'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center justify-center min-h-[75vh]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Prototype Portal Login
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Select a role dashboard card to enter the multi-role marketplace prototype.
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-8 items-center">
        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {rolesConfig.map((config) => {
            const isSelected = selectedRole === config.role;
            return (
              <div
                key={config.role}
                onClick={() => handleRoleChange(config.role)}
                className={`group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-300 transform select-none ${
                  isSelected
                    ? `border-indigo-500 scale-102 ring-4 ring-indigo-500/10 ${config.shadow}`
                    : `border-slate-100 dark:border-slate-800 hover:scale-101 hover:-translate-y-1 ${config.shadow}`
                }`}
              >
                {/* Accent colored badge */}
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-3xl text-white shadow-md mb-4 group-hover:rotate-3 transition-transform`}>
                  {config.emoji}
                </div>

                <h3 className="font-extrabold text-slate-800 dark:text-white text-base">
                  {config.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {config.desc}
                </p>

                {/* Selected Indicator Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-indigo-500 text-white rounded-full p-1 shadow-md">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* User Dropdown Selection card */}
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none p-6 rounded-2xl flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="user-select" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Demo Account ({selectedRole})
            </label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 px-3 py-2.5 text-xs rounded-xl text-slate-700 dark:text-slate-350 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-bold cursor-pointer transition-all"
            >
              {selectedRole === 'shopper' && shoppers.map(u => (
                <option key={u.id} value={u.id}>{u.name} (Shopper{u.suspended ? ' - Suspended' : ''})</option>
              ))}
              {selectedRole === 'vendor' && vendors.map(u => (
                <option key={u.id} value={u.id}>{u.name} (Vendor{u.suspended ? ' - Suspended' : ''})</option>
              ))}
              {selectedRole === 'admin' && admins.map(u => (
                <option key={u.id} value={u.id}>{u.name} (Administrator)</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-99 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer text-center"
          >
            Enter {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

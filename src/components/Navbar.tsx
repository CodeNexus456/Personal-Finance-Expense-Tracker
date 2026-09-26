import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'dashboard' | 'transactions' | 'budgets';
  onNavigate: (tab: 'home' | 'dashboard' | 'transactions' | 'budgets') => void;
  onOpenAddModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tab: 'home' | 'dashboard' | 'transactions' | 'budgets') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNav(user ? 'dashboard' : 'home')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">FinTrack</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Personal Finance
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNav('dashboard')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('transactions')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'transactions'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Transactions</span>
              </button>

              <button
                onClick={() => handleNav('budgets')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'budgets'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <PiggyBank className="w-4 h-4" />
                <span>Budgets</span>
              </button>
            </div>
          ) : null}

          {/* Desktop User / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                {onOpenAddModal && (
                  <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center justify-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                  >
                    + Add Transaction
                  </button>
                )}

                <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    title="Log out"
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNav('home')}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="px-3.5 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              {onOpenAddModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAddModal();
                  }}
                  className="w-full text-center py-2.5 px-4 mb-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  + Add New Transaction
                </button>
              )}

              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNav('transactions')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'transactions' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Receipt className="w-5 h-5" />
                <span>Transactions</span>
              </button>

              <button
                onClick={() => handleNav('budgets')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'budgets' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PiggyBank className="w-5 h-5" />
                <span>Monthly Budgets</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleNav('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Home
              </button>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-center py-2 px-4 rounded-lg text-sm font-medium text-indigo-600 border border-indigo-200 hover:bg-indigo-50"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

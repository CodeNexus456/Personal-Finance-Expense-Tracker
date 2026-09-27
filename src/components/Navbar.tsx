import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Wallet,
  LayoutDashboard,
  Receipt,
  PiggyBank,
  LogOut,
  Menu,
  X,
  Languages,
  Database,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'dashboard' | 'transactions' | 'budgets';
  onNavigate: (tab: 'home' | 'dashboard' | 'transactions' | 'budgets') => void;
  onOpenAddModal?: () => void;
  onOpenBackupModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  const { user, logout } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
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
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => handleNav(user ? 'dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">FinTrack</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                {language === 'hi' ? 'खर्च ट्रैकर' : 'Daily Expense Tracker'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
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
                <span>{t.dashboard}</span>
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
                <span>{t.transactions}</span>
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
                <span>{t.budgets}</span>
              </button>
            </div>
          ) : null}

          {/* Desktop Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* In-App PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {user ? (
              <>
                {onOpenBackupModal && (
                  <button
                    onClick={onOpenBackupModal}
                    title={language === 'hi' ? 'डेटा बैकअप लें या रीस्टोर करें' : 'Backup or restore data'}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Database className="w-4 h-4" />
                  </button>
                )}

                {onOpenAddModal && (
                  <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center justify-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
                  >
                    {t.addTransaction}
                  </button>
                )}

                <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                    <p className="text-xs text-slate-400 leading-tight truncate max-w-[120px]">
                      {user.email}
                    </p>
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
                  {t.login}
                </button>
                <button
                  onClick={() => handleNav('dashboard')}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>

          {/* Mobile top bar right buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Language toggle for mobile */}
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 rounded-md text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700"
            >
              {language === 'en' ? 'हिंदी' : 'EN'}
            </button>

            <PWAInstallButton variant="navbar" />

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

      {/* Mobile Menu Dropdown */}
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
                  {t.addTransaction}
                </button>
              )}

              <button
                onClick={() => handleNav('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'dashboard'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>{t.dashboard}</span>
              </button>

              <button
                onClick={() => handleNav('transactions')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'transactions'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Receipt className="w-5 h-5" />
                <span>{t.transactions}</span>
              </button>

              <button
                onClick={() => handleNav('budgets')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === 'budgets'
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PiggyBank className="w-5 h-5" />
                <span>{t.budgets}</span>
              </button>

              {onOpenBackupModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBackupModal();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Database className="w-5 h-5" />
                  <span>{t.backupData} / {t.restoreData}</span>
                </button>
              )}

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t.logout}</span>
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
                {t.login}
              </button>
              <button
                onClick={() => handleNav('dashboard')}
                className="w-full text-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
              >
                {t.register}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

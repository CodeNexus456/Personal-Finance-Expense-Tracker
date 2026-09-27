import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Receipt,
  Plus,
  PiggyBank,
  Database,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'dashboard' | 'transactions' | 'budgets';
  onNavigate: (tab: 'home' | 'dashboard' | 'transactions' | 'budgets') => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t.dashboard}</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => onNavigate('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'transactions' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t.transactions}</span>
        </button>

        {/* Center Floating Fast Add Button */}
        <div className="flex items-center justify-center flex-1 -mt-5">
          <button
            onClick={onOpenAddModal}
            title={t.addTransaction}
            className="w-13 h-13 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>

        {/* Budgets */}
        <button
          onClick={() => onNavigate('budgets')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'budgets' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PiggyBank className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t.budgets}</span>
        </button>

        {/* Backup & Data */}
        <button
          onClick={onOpenBackupModal}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Database className="w-5 h-5" />
          <span className="text-[10px] mt-1">{t.backupData}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
  Coffee,
  Car,
  ShoppingBag,
  Zap,
  Utensils,
  Plus,
  Check,
} from 'lucide-react';

interface QuickAddStripProps {
  onSuccess: () => void;
}

export const QuickAddStrip: React.FC<QuickAddStripProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const presets = [
    { title: 'Chai / Coffee', amount: 20, category: 'Food', icon: <Coffee className="w-3.5 h-3.5 text-amber-600" />, method: 'UPI' },
    { title: 'Snacks / Breakfast', amount: 60, category: 'Food', icon: <Utensils className="w-3.5 h-3.5 text-orange-600" />, method: 'UPI' },
    { title: 'Cab / Metro', amount: 50, category: 'Transport', icon: <Car className="w-3.5 h-3.5 text-blue-600" />, method: 'UPI' },
    { title: 'Groceries', amount: 150, category: 'Food', icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />, method: 'UPI' },
    { title: 'Phone Recharge', amount: 299, category: 'Bills', icon: <Zap className="w-3.5 h-3.5 text-purple-600" />, method: 'UPI' },
  ];

  const handleQuickAdd = async (title: string, amount: number, category: string, method: string) => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      await api.post('/transactions', {
        title,
        amount,
        type: 'expense',
        category,
        date: today,
        paymentMethod: method,
        description: '1-Tap Quick Expense',
      });

      setSuccessNotice(`✓ ${title} (₹${amount}) added!`);
      onSuccess();

      setTimeout(() => {
        setSuccessNotice(null);
      }, 3000);
    } catch {
      alert('Error recording quick expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customAmount) return;

    const num = parseFloat(customAmount);
    if (isNaN(num) || num <= 0) return;

    await handleQuickAdd(customTitle.trim(), num, 'Other', 'UPI');
    setCustomTitle('');
    setCustomAmount('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h2 className="text-sm font-bold text-slate-800">{t.quickKharcha}</h2>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">&bull; {t.quickAddDesc}</span>
        </div>
        {successNotice && (
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>{successNotice}</span>
          </span>
        )}
      </div>

      {/* Preset 1-Tap Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {presets.map((p, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleQuickAdd(p.title, p.amount, p.category, p.method)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200/80 text-xs font-medium text-slate-700 transition-all shrink-0 hover:scale-[1.02] active:scale-95 shadow-2xs"
          >
            <div className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center">
              {p.icon}
            </div>
            <span>{p.title}</span>
            <span className="font-bold text-slate-900 bg-slate-200/60 px-1.5 py-0.5 rounded text-[11px]">
              ₹{p.amount}
            </span>
          </button>
        ))}
      </div>

      {/* Inline Fast Add Bar for custom everyday expense */}
      <form onSubmit={handleCustomSubmit} className="mt-2.5 pt-3 border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={customTitle}
          onChange={(e) => setCustomTitle(e.target.value)}
          placeholder="Quick note (e.g. Milk, Lunch, Cab, Coffee...)"
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
        />
        <div className="relative w-28 shrink-0">
          <span className="absolute left-2.5 top-1.5 text-xs font-bold text-slate-400">₹</span>
          <input
            type="number"
            step="any"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="0"
            className="w-full pl-6 pr-2 py-1.5 text-xs font-bold text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !customTitle.trim() || !customAmount}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0 flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};

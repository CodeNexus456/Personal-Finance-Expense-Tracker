import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/formatters';
import { QuickAddStrip } from '../components/QuickAddStrip';
import { PWAInstallButton } from '../components/PWAInstallButton';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Calendar,
  PiggyBank,
  AlertTriangle,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface DashboardStats {
  summary: {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
    totalBudgetedThisMonth: number;
    totalSpentThisMonth: number;
  };
  recentTransactions: Array<{
    _id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    paymentMethod: string;
    description?: string;
  }>;
  categoryExpenses: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    monthLabel: string;
    monthKey: string;
    income: number;
    expense: number;
  }>;
  budgets: Array<{
    _id: string;
    category: string;
    amount: number;
    spent: number;
    remaining: number;
    percentage: number;
    isExceeded: boolean;
  }>;
}

interface DashboardProps {
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onNavigateToTransactions: () => void;
  onNavigateToBudgets: () => void;
  refreshTrigger: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddModal,
  onOpenBudgetModal,
  onNavigateToTransactions,
  onNavigateToBudgets,
  refreshTrigger,
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      // If demo user and network error, provide instant pre-seeded stats
      if (user?.email === 'demo@fintrack.app') {
        const now = new Date();
        const currentYear = now.getFullYear();
        setStats({
          summary: {
            totalBalance: 49501,
            totalIncome: 80000,
            totalExpenses: 30499,
            transactionCount: 9,
            totalBudgetedThisMonth: 40500,
            totalSpentThisMonth: 30499,
          },
          recentTransactions: [
            { _id: 'tx_d1', title: 'Monthly Salary', amount: 65000, type: 'income', category: 'Salary', date: now.toISOString().split('T')[0], paymentMethod: 'Bank Transfer', description: 'Tech software salary' },
            { _id: 'tx_d2', title: 'Apartment Rent', amount: 18000, type: 'expense', category: 'Bills', date: now.toISOString().split('T')[0], paymentMethod: 'UPI', description: 'Flat rent' },
            { _id: 'tx_d3', title: 'Freelance Web Contract', amount: 15000, type: 'income', category: 'Freelancing', date: now.toISOString().split('T')[0], paymentMethod: 'Bank Transfer' },
            { _id: 'tx_d4', title: 'Grocery Supermarket', amount: 4250, type: 'expense', category: 'Food', date: now.toISOString().split('T')[0], paymentMethod: 'Card' },
            { _id: 'tx_d5', title: 'Wi-Fi & Electricity', amount: 2400, type: 'expense', category: 'Bills', date: now.toISOString().split('T')[0], paymentMethod: 'UPI' },
            { _id: 'tx_d6', title: 'Metro Recharge', amount: 1850, type: 'expense', category: 'Transport', date: now.toISOString().split('T')[0], paymentMethod: 'UPI' },
          ],
          categoryExpenses: [
            { category: 'Bills', amount: 20400, percentage: 67 },
            { category: 'Food', amount: 4250, percentage: 14 },
            { category: 'Transport', amount: 1850, percentage: 6 },
            { category: 'Education', amount: 899, percentage: 3 },
          ],
          monthlyTrends: [
            { monthLabel: "Apr '26", monthKey: `${currentYear}-04`, income: 65000, expense: 28000 },
            { monthLabel: "May '26", monthKey: `${currentYear}-05`, income: 72000, expense: 29500 },
            { monthLabel: "Jun '26", monthKey: `${currentYear}-06`, income: 80000, expense: 31000 },
            { monthLabel: "Jul '26", monthKey: `${currentYear}-07`, income: 75000, expense: 28900 },
            { monthLabel: "Aug '26", monthKey: `${currentYear}-08`, income: 82000, expense: 32000 },
            { monthLabel: "Sep '26", monthKey: `${currentYear}-09`, income: 80000, expense: 30499 },
          ],
          budgets: [
            { _id: 'bg_d1', category: 'Food', amount: 8000, spent: 4250, remaining: 3750, percentage: 53, isExceeded: false },
            { _id: 'bg_d2', category: 'Bills', amount: 22000, spent: 20400, remaining: 1600, percentage: 93, isExceeded: false },
            { _id: 'bg_d3', category: 'Transport', amount: 3000, spent: 1850, remaining: 1150, percentage: 62, isExceeded: false },
          ],
        });
      } else {
        setError('Unable to load dashboard data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const getPaymentIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'card':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'upi':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'cash':
        return <Banknote className="w-3.5 h-3.5" />;
      default:
        return <Receipt className="w-3.5 h-3.5" />;
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">
            {language === 'hi' ? 'डैशबोर्ड लोड हो रहा है...' : 'Loading your financial dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-lg mx-auto">
          <p className="text-rose-700 font-medium mb-3">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Loading'}
          </button>
        </div>
      </div>
    );
  }

  const { summary, recentTransactions, categoryExpenses, monthlyTrends, budgets } = stats || {
    summary: { totalBalance: 0, totalIncome: 0, totalExpenses: 0, transactionCount: 0, totalBudgetedThisMonth: 0, totalSpentThisMonth: 0 },
    recentTransactions: [],
    categoryExpenses: [],
    monthlyTrends: [],
    budgets: [],
  };

  const maxTrendValue = Math.max(
    ...monthlyTrends.map((t) => Math.max(t.income, t.expense)),
    1000
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-24 md:pb-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t.welcomeBack}, {user?.name?.split(' ')[0] || 'Friend'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'hi'
              ? 'यहाँ आपका वित्तीय सारांश और बजट की स्थिति उपलब्ध है।'
              : 'Here is your real-time financial overview and monthly budget status.'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center space-x-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <PiggyBank className="w-4 h-4 text-slate-500" />
            <span>{t.setBudget}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addTransaction}</span>
          </button>
        </div>
      </div>

      {/* PWA Mobile Prompt Banner (Optional / Auto-suppressed if installed) */}
      <PWAInstallButton variant="banner" />

      {/* ⚡ 1-Tap Quick Kharcha Logger */}
      <QuickAddStrip onSuccess={fetchStats} />

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Balance Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalBalance}
            </span>
            <div
              className={`p-2 rounded-xl ${
                summary.totalBalance >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {formatCurrency(summary.totalBalance)}
            </h2>
          </div>
          <div className="mt-3 flex items-center text-xs font-medium text-slate-500">
            <span>{language === 'hi' ? 'कुल बचत (आय - खर्च)' : 'Overall net balance across all records'}</span>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalIncome}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-emerald-600 tracking-tight">
              {formatCurrency(summary.totalIncome)}
            </h2>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>{language === 'hi' ? 'वेतन, फ्रीलांसिंग एवं अन्य आय' : 'Earnings, salary & freelancing'}</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.totalExpenses}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-3xl font-black text-rose-600 tracking-tight">
              {formatCurrency(summary.totalExpenses)}
            </h2>
          </div>
          <div className="mt-3 flex items-center text-xs text-rose-600 font-medium">
            <ArrowDownRight className="w-4 h-4 mr-0.5" />
            <span>{language === 'hi' ? 'कुल हुआ खर्च' : 'All outgoing spending'}</span>
          </div>
        </div>
      </div>

      {/* Monthly Budget Tracker Bar / Summary */}
      {budgets && budgets.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t.monthlyBudgetStatus}</h2>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'आपके मासिक खर्च की सीमा और वास्तविक खर्च'
                  : 'Tracking spending against your monthly category caps'}
              </p>
            </div>
            <button
              onClick={onNavigateToBudgets}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => {
              const colorInfo = getCategoryColor(b.category);
              return (
                <div
                  key={b._id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${colorInfo.bg} ${colorInfo.text} ${colorInfo.border}`}
                    >
                      {b.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {b.percentage}% {t.spent}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-sm font-extrabold text-slate-800">
                      {formatCurrency(b.spent)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {t.ofLimit} {formatCurrency(b.amount)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        b.isExceeded
                          ? 'bg-rose-600'
                          : b.percentage >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    {b.isExceeded ? (
                      <span className="text-rose-600 font-bold flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {t.exceededBy} {formatCurrency(b.spent - b.amount)}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {t.remaining}: <strong className="text-slate-700">{formatCurrency(b.remaining)}</strong>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Middle Section: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income vs Expense Chart (Past 6 Months) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{t.incomeVsExpense}</h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'पिछले 6 महीनों का ऐतिहासिक तुलनात्मक रिकॉर्ड' : 'Monthly breakdown over the last 6 months'}
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-emerald-500"></div>
                  <span className="text-slate-600 font-medium">{t.income}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="w-3 h-3 rounded-xs bg-rose-500"></div>
                  <span className="text-slate-600 font-medium">{t.expense}</span>
                </div>
              </div>
            </div>

            {/* Bar Visualizer */}
            <div className="mt-6 space-y-4">
              {monthlyTrends.map((trend) => {
                const incomePercent = maxTrendValue > 0 ? (trend.income / maxTrendValue) * 100 : 0;
                const expensePercent = maxTrendValue > 0 ? (trend.expense / maxTrendValue) * 100 : 0;

                return (
                  <div key={trend.monthKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 w-16">{trend.monthLabel}</span>
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="text-emerald-700 font-bold">
                          +{formatCurrency(trend.income)}
                        </span>
                        <span className="text-rose-700 font-bold">
                          -{formatCurrency(trend.expense)}
                        </span>
                      </div>
                    </div>
                    {/* Double Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(2, incomePercent)}%` }}
                        ></div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className="bg-rose-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(2, expensePercent)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{language === 'hi' ? 'आपके लेन-देन से स्वतः गणना' : 'Data synced from your transactions'}</span>
            <span className="font-bold text-slate-700">Auto-calculated</span>
          </div>
        </div>

        {/* Expense by Category */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">{t.expenseByCategory}</h2>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'कुल खर्च का श्रेणीवार वितरण' : 'Distribution of your total spending'}
                </p>
              </div>
            </div>

            {categoryExpenses.length === 0 ? (
              <div className="py-12 text-center">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">{t.noTransactionsYet}</p>
              </div>
            ) : (
              <div className="space-y-3.5 mt-2">
                {categoryExpenses.slice(0, 6).map((item) => {
                  const color = getCategoryColor(item.category);
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{item.category}</span>
                        <div className="space-x-2">
                          <span className="text-slate-500">{item.percentage}%</span>
                          <span className="font-bold text-slate-800">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(3, item.percentage)}%`,
                            backgroundColor: color.hex,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{language === 'hi' ? 'कुल श्रेणियां:' : 'Total Categories:'} {categoryExpenses.length}</span>
            <button
              onClick={onNavigateToTransactions}
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t.recentTransactions}</h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'आपके हालिया खर्च और आमदनी' : 'Your latest income and expense entries'}
            </p>
          </div>
          <button
            onClick={onNavigateToTransactions}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">{t.noTransactionsYet}</h3>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              {t.addFirstTransaction}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Transaction</th>
                  <th className="px-5 py-3">{t.category}</th>
                  <th className="px-5 py-3">{t.date}</th>
                  <th className="px-5 py-3">{t.paymentMethod}</th>
                  <th className="px-5 py-3 text-right">{t.amount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => {
                  const catColor = getCategoryColor(tx.category);
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {isExpense ? '-' : '+'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight">{tx.title}</p>
                            {tx.description && (
                              <p className="text-xs text-slate-400 leading-tight mt-0.5 truncate max-w-xs">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="inline-flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {getPaymentIcon(tx.paymentMethod)}
                          <span>{tx.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`font-black ${
                            isExpense ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

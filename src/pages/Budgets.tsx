import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, getCategoryColor } from '../utils/formatters';
import {
  PiggyBank,
  Plus,
  AlertTriangle,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  AlertCircle,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { BudgetData } from '../components/BudgetModal';

interface BudgetsProps {
  onOpenBudgetModal: (budget?: BudgetData) => void;
  refreshTrigger: number;
  onRefreshNeeded: () => void;
}

export const Budgets: React.FC<BudgetsProps> = ({
  onOpenBudgetModal,
  refreshTrigger,
  onRefreshNeeded,
}) => {
  const { t } = useLanguage();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());

  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/budgets', {
        params: {
          month: selectedMonth,
          year: selectedYear,
        },
      });
      setBudgets(res.data);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      setError('Unable to load budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await api.delete(`/budgets/${id}`);
      setDeleteId(null);
      fetchBudgets();
      onRefreshNeeded();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete budget');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  const overallPercentage = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Monthly Budgets</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Set spending limits by category and avoid exceeding your financial targets
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Month / Year selector */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
            >
              {months.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none border-l pl-2 border-slate-200"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onOpenBudgetModal()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Monthly Budget
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalBudgeted)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Across {budgets.length} budgeted categor{budgets.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Spent So Far
          </p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalSpent)}
          </p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${
                totalSpent > totalBudgeted
                  ? 'bg-rose-600'
                  : overallPercentage >= 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, overallPercentage)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Remaining Allowance
          </p>
          <p
            className={`text-2xl font-extrabold mt-1 ${
              totalSpent > totalBudgeted ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {totalSpent > totalBudgeted
              ? `-${formatCurrency(totalSpent - totalBudgeted)}`
              : formatCurrency(totalRemaining)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {totalSpent > totalBudgeted
              ? 'Warning: Total monthly budget exceeded'
              : `${100 - overallPercentage}% of budget remaining`}
          </p>
        </div>
      </div>

      {/* Budgets Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading budgets...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-rose-600 text-sm">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <PiggyBank className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            No budgets set for {months[selectedMonth - 1]} {selectedYear}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Setting a budget helps you monitor monthly spending per category. For example: Food → ₹5,000, Transport → ₹3,000.
          </p>
          <button
            onClick={() => onOpenBudgetModal()}
            className="mt-5 inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Budget</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const color = getCategoryColor(b.category);
            const isExceeded = b.isExceeded;

            return (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${color.bg} ${color.text} ${color.border}`}
                    >
                      {b.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() =>
                          onOpenBudgetModal({
                            _id: b._id,
                            category: b.category,
                            amount: b.amount,
                            month: b.month,
                            year: b.year,
                          })
                        }
                        title="Edit Budget"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(b._id)}
                        title="Delete Budget"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Spent</p>
                      <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                        {formatCurrency(b.spent)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium">Monthly Limit</p>
                      <p className="text-xl font-bold text-slate-600 mt-0.5">
                        {formatCurrency(b.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isExceeded
                            ? 'bg-rose-600'
                            : b.percentage >= 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, b.percentage)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isExceeded ? (
                    <span className="text-rose-600 font-semibold flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 shrink-0" />
                      Exceeded by {formatCurrency(b.spent - b.amount)}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Remaining:{' '}
                      <strong className="text-emerald-700 font-bold">
                        {formatCurrency(b.remaining)}
                      </strong>
                    </span>
                  )}
                  <span className="font-semibold text-slate-600">{b.percentage}% used</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Budget?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this category budget limit?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDelete(deleteId)}
                className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

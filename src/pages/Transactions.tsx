import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, formatDate, getCategoryColor, CATEGORIES } from '../utils/formatters';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  ArrowUpDown,
  Download,
  AlertCircle,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  X,
} from 'lucide-react';
import { TransactionData } from '../components/TransactionModal';

interface TransactionsProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (tx: TransactionData) => void;
  refreshTrigger: number;
  onRefreshNeeded: () => void;
}

export const Transactions: React.FC<TransactionsProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  refreshTrigger,
  onRefreshNeeded,
}) => {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date_desc');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        sortBy,
      };
      if (search.trim()) params.search = search.trim();
      if (typeFilter !== 'all') params.type = typeFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/transactions', { params });
      setTransactions(res.data);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError('Unable to load transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, categoryFilter, sortBy, startDate, endDate, refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await api.delete(`/transactions/${id}`);
      setDeleteId(null);
      fetchTransactions();
      onRefreshNeeded();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['Title', 'Type', 'Amount (INR)', 'Category', 'Date', 'Payment Method', 'Description'];
    const rows = transactions.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount,
      `"${t.category}"`,
      t.date,
      `"${t.paymentMethod || ''}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinTrack_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculation for filtered transactions
  const totalFilteredIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFiltered = totalFilteredIncome - totalFilteredExpense;

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage, filter, and audit all your financial records
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            disabled={transactions.length === 0}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold disabled:opacity-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category, note..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Type Tab Selector */}
          <div className="md:col-span-3 flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                typeFilter === 'income'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 rounded-md transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Highest Amount</option>
              <option value="amount_asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Date Filter row */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span>Filter Date Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2.5 py-1 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2.5 py-1 rounded border border-slate-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {(startDate || endDate || search || typeFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium ml-2 flex items-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Filter summary strip */}
          <div className="flex items-center space-x-4 text-xs font-medium">
            <span>
              Income: <strong className="text-emerald-700 font-bold">+{formatCurrency(totalFilteredIncome)}</strong>
            </span>
            <span>
              Expense: <strong className="text-rose-700 font-bold">-{formatCurrency(totalFilteredExpense)}</strong>
            </span>
            <span>
              Net: <strong className={netFiltered >= 0 ? 'text-indigo-700 font-bold' : 'text-rose-700 font-bold'}>{formatCurrency(netFiltered)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-600 text-sm">
            <AlertCircle className="w-6 h-6 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-20 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No transactions found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || typeFilter !== 'all' || categoryFilter !== 'all' || startDate
                ? 'Try adjusting your search filters to find what you are looking for.'
                : 'No transactions yet. Add your first transaction to get started.'}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Title & Note</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Payment Method</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => {
                  const catColor = getCategoryColor(tx.category);
                  const isExpense = tx.type === 'expense';
                  return (
                    <tr key={tx._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                              isExpense ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}
                          >
                            {isExpense ? '-' : '+'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{tx.title}</p>
                            {tx.description && (
                              <p className="text-xs text-slate-400 leading-tight mt-0.5 truncate max-w-xs">
                                {tx.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                        >
                          {tx.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          {getPaymentIcon(tx.paymentMethod)}
                          <span>{tx.paymentMethod || 'Cash'}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            isExpense ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {isExpense ? '-' : '+'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center space-x-2">
                          <button
                            onClick={() => onOpenEditModal(tx)}
                            title="Edit Transaction"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(tx._id)}
                            title="Delete Transaction"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {transactions.length} record{transactions.length !== 1 ? 's' : ''}</span>
          <span className="text-slate-400">Transactions stored securely with userId isolation</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Delete Transaction?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this transaction record? This action cannot be undone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDelete(deleteId)}
                className="py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

export const CATEGORIES = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Education',
  'Health',
  'Entertainment',
  'Salary',
  'Freelancing',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  'Cash',
  'Card',
  'UPI',
  'Bank Transfer',
  'Other',
] as const;

export const getCategoryColor = (category: string): { bg: string; text: string; border: string; hex: string } => {
  switch (category.toLowerCase()) {
    case 'food':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' };
    case 'shopping':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hex: '#a855f7' };
    case 'transport':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', hex: '#3b82f6' };
    case 'bills':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hex: '#f43f5e' };
    case 'education':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hex: '#6366f1' };
    case 'health':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#10b981' };
    case 'entertainment':
      return { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', hex: '#ec4899' };
    case 'salary':
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', hex: '#22c55e' };
    case 'freelancing':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', hex: '#14b8a6' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', hex: '#64748b' };
  }
};

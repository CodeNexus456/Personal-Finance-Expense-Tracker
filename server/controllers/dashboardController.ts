import type { Response } from 'express';
import { Transaction } from '../models/Transaction.ts';
import { Budget } from '../models/Budget.ts';
import { type AuthRequest } from '../middleware/authMiddleware.ts';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const userId = req.user.id;
    const allTransactions = await Transaction.find({ userId, sortBy: 'date_desc' });

    let totalIncome = 0;
    let totalExpenses = 0;

    const categoryExpenseMap: Record<string, number> = {};
    const categoryIncomeMap: Record<string, number> = {};
    const paymentMethodMap: Record<string, number> = {};

    // Calculate overall totals and maps
    for (const tx of allTransactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
        categoryIncomeMap[tx.category] = (categoryIncomeMap[tx.category] || 0) + tx.amount;
      } else {
        totalExpenses += tx.amount;
        categoryExpenseMap[tx.category] = (categoryExpenseMap[tx.category] || 0) + tx.amount;
      }
      if (tx.paymentMethod) {
        paymentMethodMap[tx.paymentMethod] = (paymentMethodMap[tx.paymentMethod] || 0) + 1;
      }
    }

    const totalBalance = totalIncome - totalExpenses;

    // Recent transactions (last 6)
    const recentTransactions = allTransactions.slice(0, 6);

    // Current month budget progress
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const currentMonthBudgets = await Budget.find({
      userId,
      month: currentMonth,
      year: currentYear,
    });

    const monthStr = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`;
    const startOfCurrentMonth = `${currentYear}-${monthStr}-01`;
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();
    const endOfCurrentMonth = `${currentYear}-${monthStr}-${lastDayOfMonth}`;

    const currentMonthExpenses = allTransactions.filter(
      (tx) => tx.type === 'expense' && tx.date >= startOfCurrentMonth && tx.date <= endOfCurrentMonth
    );

    const currentMonthSpentByCat: Record<string, number> = {};
    let totalSpentThisMonth = 0;
    for (const tx of currentMonthExpenses) {
      const cat = tx.category.toLowerCase();
      currentMonthSpentByCat[cat] = (currentMonthSpentByCat[cat] || 0) + tx.amount;
      totalSpentThisMonth += tx.amount;
    }

    let totalBudgetedThisMonth = 0;
    const budgetCards = currentMonthBudgets.map((b) => {
      totalBudgetedThisMonth += b.amount;
      const spent = currentMonthSpentByCat[b.category.toLowerCase()] || 0;
      const remaining = Math.max(0, b.amount - spent);
      const percentage = b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
      return {
        ...b,
        spent,
        remaining,
        percentage,
        isExceeded: spent > b.amount,
      };
    });

    // Monthly historical trends (last 6 months)
    const monthlyTrends: { monthLabel: string; income: number; expense: number; monthKey: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const mStr = m < 10 ? `0${m}` : `${m}`;
      const monthKey = `${y}-${mStr}`;
      const monthLabel = d.toLocaleString('default', { month: 'short' });

      const txsInMonth = allTransactions.filter((tx) => tx.date.startsWith(monthKey));
      const mIncome = txsInMonth.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const mExpense = txsInMonth.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      monthlyTrends.push({
        monthLabel: `${monthLabel} '${String(y).slice(2)}`,
        monthKey,
        income: mIncome,
        expense: mExpense,
      });
    }

    // Category breakdown list formatted for charts
    const categoryExpenses = Object.keys(categoryExpenseMap).map((cat) => ({
      category: cat,
      amount: categoryExpenseMap[cat],
      percentage: totalExpenses > 0 ? Math.round((categoryExpenseMap[cat] / totalExpenses) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
        transactionCount: allTransactions.length,
        totalBudgetedThisMonth,
        totalSpentThisMonth,
      },
      recentTransactions,
      categoryExpenses,
      monthlyTrends,
      budgets: budgetCards,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Unable to load dashboard data' });
  }
};

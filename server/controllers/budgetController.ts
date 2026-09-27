import type { Response } from 'express';
import { Budget } from '../models/Budget.ts';
import { Transaction } from '../models/Transaction.ts';
import { type AuthRequest } from '../middleware/authMiddleware.ts';

export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({
      userId: req.user.id,
      month,
      year,
    });

    // Also get all transactions for this month to calculate spent amount per category
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const startDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${lastDay}`;

    const transactions = await Transaction.find({
      userId: req.user.id,
      startDate,
      endDate,
      type: 'expense',
    });

    // Calculate spent per category
    const spentByCategory: Record<string, number> = {};
    for (const tx of transactions) {
      const cat = tx.category.toLowerCase();
      spentByCategory[cat] = (spentByCategory[cat] || 0) + tx.amount;
    }

    // Attach spent amount, remaining amount, and percentage
    const enrichedBudgets = budgets.map((b) => {
      const spent = spentByCategory[b.category.toLowerCase()] || 0;
      const remaining = Math.max(0, b.amount - spent);
      const percentage = b.amount > 0 ? Math.min(100, Math.round((spent / b.amount) * 100)) : 0;
      const isExceeded = spent > b.amount;
      return {
        ...b,
        spent,
        remaining,
        percentage,
        isExceeded,
      };
    });

    res.json(enrichedBudgets);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ message: 'Unable to load budgets' });
  }
};

export const setBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined) {
      res.status(400).json({ message: 'Please provide category and amount' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      res.status(400).json({ message: 'Please enter a valid budget amount' });
      return;
    }

    const now = new Date();
    const targetMonth = month ? Number(month) : now.getMonth() + 1;
    const targetYear = year ? Number(year) : now.getFullYear();

    const budget = await Budget.createOrUpdate({
      userId: req.user.id,
      category: category.trim(),
      amount: parsedAmount,
      month: targetMonth,
      year: targetYear,
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ message: 'Failed to save budget' });
  }
};

export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const { amount } = req.body;

    const existing = await Budget.findById(id);
    if (!existing) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }

    if (existing.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You cannot modify this budget' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      res.status(400).json({ message: 'Please enter a valid budget amount' });
      return;
    }

    const updated = await Budget.findByIdAndUpdate(id, req.user.id, parsedAmount);
    res.json(updated);
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({ message: 'Failed to update budget' });
  }
};

export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const existing = await Budget.findById(id);

    if (!existing) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }

    if (existing.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You cannot delete this budget' });
      return;
    }

    await Budget.findByIdAndDelete(id, req.user.id);
    res.json({ message: 'Budget deleted successfully', id });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Failed to delete budget' });
  }
};

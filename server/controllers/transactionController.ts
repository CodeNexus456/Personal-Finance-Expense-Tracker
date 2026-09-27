import type { Response } from 'express';
import { Transaction } from '../models/Transaction.ts';
import { type AuthRequest } from '../middleware/authMiddleware.ts';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { type, category, search, startDate, endDate, sortBy } = req.query;

    const transactions = await Transaction.find({
      userId: req.user.id,
      type: type as string,
      category: category as string,
      search: search as string,
      startDate: startDate as string,
      endDate: endDate as string,
      sortBy: sortBy as string,
    });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Unable to load transactions' });
  }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { title, amount, type, category, date, paymentMethod, description } = req.body;

    if (!title || !amount || !type || !category || !date) {
      res.status(400).json({ message: 'Please provide all required fields (title, amount, type, category, date)' });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      res.status(400).json({ message: 'Please enter a valid amount greater than 0' });
      return;
    }

    if (!['income', 'expense'].includes(type)) {
      res.status(400).json({ message: 'Type must be either income or expense' });
      return;
    }

    const newTransaction = await Transaction.create({
      userId: req.user.id,
      title: title.trim(),
      amount: parsedAmount,
      type,
      category: category.trim(),
      date,
      paymentMethod: paymentMethod?.trim() || 'Cash',
      description: description ? description.trim() : '',
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const { title, amount, type, category, date, paymentMethod, description } = req.body;

    const existing = await Transaction.findById(id);
    if (!existing) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Ownership check
    if (existing.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You cannot modify this transaction' });
      return;
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ message: 'Please enter a valid amount greater than 0' });
        return;
      }
    }

    const updated = await Transaction.findByIdAndUpdate(id, req.user.id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(amount !== undefined && { amount: parseFloat(amount) }),
      ...(type !== undefined && { type }),
      ...(category !== undefined && { category: category.trim() }),
      ...(date !== undefined && { date }),
      ...(paymentMethod !== undefined && { paymentMethod: paymentMethod.trim() }),
      ...(description !== undefined && { description: description.trim() }),
    });

    res.json(updated);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { id } = req.params;
    const existing = await Transaction.findById(id);

    if (!existing) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    // Ownership check
    if (existing.userId !== req.user.id) {
      res.status(403).json({ message: 'Forbidden: You cannot delete this transaction' });
      return;
    }

    await Transaction.findByIdAndDelete(id, req.user.id);
    res.json({ message: 'Transaction deleted successfully', id });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};

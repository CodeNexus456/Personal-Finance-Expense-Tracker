import { db, ITransaction } from '../config/db.js';

export type { ITransaction };

export const Transaction = {
  async find(query: {
    userId: string;
    type?: string;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
  }): Promise<ITransaction[]> {
    return db.findTransactions(query);
  },

  async findById(id: string): Promise<ITransaction | null> {
    return db.findTransactionById(id);
  },

  async create(data: Omit<ITransaction, '_id' | 'createdAt'>): Promise<ITransaction> {
    return db.createTransaction(data);
  },

  async findByIdAndUpdate(
    id: string,
    userId: string,
    updateData: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    return db.updateTransaction(id, userId, updateData);
  },

  async findByIdAndDelete(id: string, userId: string): Promise<boolean> {
    return db.deleteTransaction(id, userId);
  },
};

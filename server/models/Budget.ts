import { db, IBudget } from '../config/db.js';

export type { IBudget };

export const Budget = {
  async find(query: { userId: string; month?: number; year?: number }): Promise<IBudget[]> {
    return db.findBudgets(query.userId, query.month, query.year);
  },

  async findById(id: string): Promise<IBudget | null> {
    return db.findBudgetById(id);
  },

  async createOrUpdate(data: {
    userId: string;
    category: string;
    amount: number;
    month: number;
    year: number;
  }): Promise<IBudget> {
    return db.createOrUpdateBudget(data);
  },

  async findByIdAndUpdate(id: string, userId: string, amount: number): Promise<IBudget | null> {
    return db.updateBudget(id, userId, amount);
  },

  async findByIdAndDelete(id: string, userId: string): Promise<boolean> {
    return db.deleteBudget(id, userId);
  },
};

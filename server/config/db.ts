import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'fintrack.json');

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface ITransaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IBudget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  month: number; // 1 - 12
  year: number;  // e.g. 2026
  createdAt: string;
  updatedAt?: string;
}

interface DatabaseSchema {
  users: IUser[];
  transactions: ITransaction[];
  budgets: IBudget[];
}

function getInitialData(): DatabaseSchema {
  // Initial seed with demo user (password: demo123)
  const salt = bcrypt.genSaltSync(10);
  const demoPasswordHash = bcrypt.hashSync('demo123', salt);
  const demoUserId = 'usr_demo_882049281';

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  
  // Format date helper
  const dateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return {
    users: [
      {
        _id: demoUserId,
        name: 'Rahul Sharma',
        email: 'demo@fintrack.app',
        password: demoPasswordHash,
        createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    transactions: [
      {
        _id: 'tx_demo_01',
        userId: demoUserId,
        title: 'Monthly Salary',
        amount: 65000,
        type: 'income',
        category: 'Salary',
        date: dateStr(25),
        paymentMethod: 'Bank Transfer',
        description: 'Tech corp software engineer salary',
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_02',
        userId: demoUserId,
        title: 'Apartment Rent',
        amount: 18000,
        type: 'expense',
        category: 'Bills',
        date: dateStr(24),
        paymentMethod: 'UPI',
        description: 'Monthly flat rent payment',
        createdAt: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_03',
        userId: demoUserId,
        title: 'Grocery Supermarket',
        amount: 4250,
        type: 'expense',
        category: 'Food',
        date: dateStr(18),
        paymentMethod: 'Card',
        description: 'Monthly groceries, dairy and produce',
        createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_04',
        userId: demoUserId,
        title: 'Freelance Web Design',
        amount: 15000,
        type: 'income',
        category: 'Freelancing',
        date: dateStr(15),
        paymentMethod: 'Bank Transfer',
        description: 'Frontend landing page contract for local cafe',
        createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_05',
        userId: demoUserId,
        title: 'Electric & Wi-Fi Bill',
        amount: 2400,
        type: 'expense',
        category: 'Bills',
        date: dateStr(12),
        paymentMethod: 'UPI',
        description: 'Fiber internet and electricity',
        createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_06',
        userId: demoUserId,
        title: 'Metro & Cab Travel',
        amount: 1850,
        type: 'expense',
        category: 'Transport',
        date: dateStr(8),
        paymentMethod: 'UPI',
        description: 'Commute cards recharge and Uber',
        createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_07',
        userId: demoUserId,
        title: 'Dinner with College Friends',
        amount: 2200,
        type: 'expense',
        category: 'Food',
        date: dateStr(5),
        paymentMethod: 'Card',
        description: 'Weekend get-together dinner',
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_08',
        userId: demoUserId,
        title: 'Udemy Web Dev Course',
        amount: 899,
        type: 'expense',
        category: 'Education',
        date: dateStr(3),
        paymentMethod: 'Card',
        description: 'Advanced TypeScript & Node.js masterclass',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'tx_demo_09',
        userId: demoUserId,
        title: 'Cinema & Snacks',
        amount: 950,
        type: 'expense',
        category: 'Entertainment',
        date: dateStr(1),
        paymentMethod: 'UPI',
        description: 'Movie weekend ticket and popcorn',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      },
    ],
    budgets: [
      {
        _id: 'bg_demo_01',
        userId: demoUserId,
        category: 'Food',
        amount: 8000,
        month: currentMonth,
        year: currentYear,
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'bg_demo_02',
        userId: demoUserId,
        category: 'Bills',
        amount: 22000,
        month: currentMonth,
        year: currentYear,
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'bg_demo_03',
        userId: demoUserId,
        category: 'Transport',
        amount: 3000,
        month: currentMonth,
        year: currentYear,
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'bg_demo_04',
        userId: demoUserId,
        category: 'Entertainment',
        amount: 2500,
        month: currentMonth,
        year: currentYear,
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
      {
        _id: 'bg_demo_05',
        userId: demoUserId,
        category: 'Shopping',
        amount: 5000,
        month: currentMonth,
        year: currentYear,
        createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
      },
    ],
  };
}

class JsonDatabase {
  private inMemoryData: DatabaseSchema | null = null;

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      this.inMemoryData = initial;
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.inMemoryData = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db file, restoring fallback:', err);
        const initial = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
        this.inMemoryData = initial;
      }
    }
  }

  private getData(): DatabaseSchema {
    if (!this.inMemoryData) {
      this.init();
    }
    return this.inMemoryData!;
  }

  private saveData() {
    if (this.inMemoryData) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.inMemoryData, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error saving db file:', err);
      }
    }
  }

  // --- Users API ---
  async findUserByEmail(email: string): Promise<IUser | null> {
    const data = this.getData();
    const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    const data = this.getData();
    const user = data.users.find((u) => u._id === id);
    return user ? { ...user } : null;
  }

  async createUser(userData: { name: string; email: string; password: string }): Promise<IUser> {
    const data = this.getData();
    const newUser: IUser = {
      _id: 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    this.saveData();
    return { ...newUser };
  }

  // --- Transactions API ---
  async findTransactions(query: {
    userId: string;
    type?: string;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
  }): Promise<ITransaction[]> {
    const data = this.getData();
    let results = data.transactions.filter((tx) => tx.userId === query.userId);

    if (query.type && query.type !== 'all') {
      results = results.filter((tx) => tx.type === query.type);
    }

    if (query.category && query.category !== 'all') {
      results = results.filter((tx) => tx.category.toLowerCase() === query.category?.toLowerCase());
    }

    if (query.search) {
      const s = query.search.toLowerCase();
      results = results.filter(
        (tx) =>
          tx.title.toLowerCase().includes(s) ||
          tx.category.toLowerCase().includes(s) ||
          (tx.description && tx.description.toLowerCase().includes(s)) ||
          tx.paymentMethod.toLowerCase().includes(s)
      );
    }

    if (query.startDate) {
      results = results.filter((tx) => tx.date >= query.startDate!);
    }

    if (query.endDate) {
      results = results.filter((tx) => tx.date <= query.endDate!);
    }

    // Sorting
    results.sort((a, b) => {
      if (query.sortBy === 'date_asc') {
        return a.date.localeCompare(b.date);
      } else if (query.sortBy === 'amount_desc') {
        return b.amount - a.amount;
      } else if (query.sortBy === 'amount_asc') {
        return a.amount - b.amount;
      } else {
        // default date_desc
        return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
      }
    });

    return results.map((tx) => ({ ...tx }));
  }

  async findTransactionById(id: string): Promise<ITransaction | null> {
    const data = this.getData();
    const tx = data.transactions.find((t) => t._id === id);
    return tx ? { ...tx } : null;
  }

  async createTransaction(txData: Omit<ITransaction, '_id' | 'createdAt'>): Promise<ITransaction> {
    const data = this.getData();
    const newTx: ITransaction = {
      _id: 'tx_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      ...txData,
      amount: Number(txData.amount),
      createdAt: new Date().toISOString(),
    };
    data.transactions.unshift(newTx);
    this.saveData();
    return { ...newTx };
  }

  async updateTransaction(id: string, userId: string, updateData: Partial<ITransaction>): Promise<ITransaction | null> {
    const data = this.getData();
    const index = data.transactions.findIndex((t) => t._id === id && t.userId === userId);
    if (index === -1) return null;

    const existing = data.transactions[index];
    const updated: ITransaction = {
      ...existing,
      ...updateData,
      amount: updateData.amount !== undefined ? Number(updateData.amount) : existing.amount,
      updatedAt: new Date().toISOString(),
    };
    data.transactions[index] = updated;
    this.saveData();
    return { ...updated };
  }

  async deleteTransaction(id: string, userId: string): Promise<boolean> {
    const data = this.getData();
    const initialLen = data.transactions.length;
    data.transactions = data.transactions.filter((t) => !(t._id === id && t.userId === userId));
    const deleted = data.transactions.length < initialLen;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }

  // --- Budgets API ---
  async findBudgets(userId: string, month?: number, year?: number): Promise<IBudget[]> {
    const data = this.getData();
    let results = data.budgets.filter((b) => b.userId === userId);
    if (month) {
      results = results.filter((b) => b.month === Number(month));
    }
    if (year) {
      results = results.filter((b) => b.year === Number(year));
    }
    return results.map((b) => ({ ...b }));
  }

  async findBudgetById(id: string): Promise<IBudget | null> {
    const data = this.getData();
    const b = data.budgets.find((bg) => bg._id === id);
    return b ? { ...b } : null;
  }

  async createOrUpdateBudget(budgetData: {
    userId: string;
    category: string;
    amount: number;
    month: number;
    year: number;
  }): Promise<IBudget> {
    const data = this.getData();
    const existingIndex = data.budgets.findIndex(
      (b) =>
        b.userId === budgetData.userId &&
        b.category.toLowerCase() === budgetData.category.toLowerCase() &&
        b.month === budgetData.month &&
        b.year === budgetData.year
    );

    if (existingIndex !== -1) {
      data.budgets[existingIndex].amount = Number(budgetData.amount);
      data.budgets[existingIndex].updatedAt = new Date().toISOString();
      this.saveData();
      return { ...data.budgets[existingIndex] };
    }

    const newBudget: IBudget = {
      _id: 'bg_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      userId: budgetData.userId,
      category: budgetData.category,
      amount: Number(budgetData.amount),
      month: Number(budgetData.month),
      year: Number(budgetData.year),
      createdAt: new Date().toISOString(),
    };
    data.budgets.push(newBudget);
    this.saveData();
    return { ...newBudget };
  }

  async updateBudget(id: string, userId: string, amount: number): Promise<IBudget | null> {
    const data = this.getData();
    const index = data.budgets.findIndex((b) => b._id === id && b.userId === userId);
    if (index === -1) return null;
    data.budgets[index].amount = Number(amount);
    data.budgets[index].updatedAt = new Date().toISOString();
    this.saveData();
    return { ...data.budgets[index] };
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const data = this.getData();
    const initialLen = data.budgets.length;
    data.budgets = data.budgets.filter((b) => !(b._id === id && b.userId === userId));
    const deleted = data.budgets.length < initialLen;
    if (deleted) {
      this.saveData();
    }
    return deleted;
  }
}

export const db = new JsonDatabase();

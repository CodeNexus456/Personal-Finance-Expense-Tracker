export interface LocalUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface LocalTransaction {
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

export interface LocalBudget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt?: string;
}

const DEMO_USER: LocalUser = {
  _id: 'usr_demo_882049281',
  name: 'Rahul Sharma',
  email: 'demo@fintrack.app',
  password: 'demo123',
  createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
};

function getSeedTransactions(userId: string): LocalTransaction[] {
  const dateStr = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      _id: 'tx_' + userId + '_01',
      userId,
      title: 'Monthly Salary',
      amount: 65000,
      type: 'income',
      category: 'Salary',
      date: dateStr(25),
      paymentMethod: 'Bank Transfer',
      description: 'Tech software salary credit',
      createdAt: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_02',
      userId,
      title: 'Apartment Rent',
      amount: 18000,
      type: 'expense',
      category: 'Bills',
      date: dateStr(24),
      paymentMethod: 'UPI',
      description: 'Flat monthly rent payment',
      createdAt: new Date(Date.now() - 24 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_03',
      userId,
      title: 'Grocery Supermarket',
      amount: 4250,
      type: 'expense',
      category: 'Food',
      date: dateStr(18),
      paymentMethod: 'Card',
      description: 'Fresh groceries & dairy',
      createdAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_04',
      userId,
      title: 'Freelance Web Design',
      amount: 15000,
      type: 'income',
      category: 'Freelancing',
      date: dateStr(15),
      paymentMethod: 'Bank Transfer',
      description: 'Frontend contract delivery',
      createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_05',
      userId,
      title: 'Electric & Wi-Fi Bill',
      amount: 2400,
      type: 'expense',
      category: 'Bills',
      date: dateStr(12),
      paymentMethod: 'UPI',
      description: 'High-speed fiber & electricity',
      createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_06',
      userId,
      title: 'Metro & Cab Travel',
      amount: 1850,
      type: 'expense',
      category: 'Transport',
      date: dateStr(8),
      paymentMethod: 'UPI',
      description: 'Commute cards & rides',
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_07',
      userId,
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
      _id: 'tx_' + userId + '_08',
      userId,
      title: 'Online Tech Course',
      amount: 899,
      type: 'expense',
      category: 'Education',
      date: dateStr(3),
      paymentMethod: 'Card',
      description: 'TypeScript masterclass subscription',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      _id: 'tx_' + userId + '_09',
      userId,
      title: 'Cinema & Snacks',
      amount: 950,
      type: 'expense',
      category: 'Entertainment',
      date: dateStr(1),
      paymentMethod: 'UPI',
      description: 'Weekend movie ticket',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ];
}

function getSeedBudgets(userId: string): LocalBudget[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return [
    {
      _id: 'bg_' + userId + '_01',
      userId,
      category: 'Food',
      amount: 8000,
      month: currentMonth,
      year: currentYear,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'bg_' + userId + '_02',
      userId,
      category: 'Bills',
      amount: 22000,
      month: currentMonth,
      year: currentYear,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'bg_' + userId + '_03',
      userId,
      category: 'Transport',
      amount: 3000,
      month: currentMonth,
      year: currentYear,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'bg_' + userId + '_04',
      userId,
      category: 'Entertainment',
      amount: 2500,
      month: currentMonth,
      year: currentYear,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'bg_' + userId + '_05',
      userId,
      category: 'Shopping',
      amount: 5000,
      month: currentMonth,
      year: currentYear,
      createdAt: new Date().toISOString(),
    },
  ];
}

class LocalBackendService {
  private getCurrentUserId(): string {
    try {
      const userStr = localStorage.getItem('fintrack_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        return u._id || 'guest_user';
      }
    } catch (e) {
      // fallback
    }
    return 'guest_user';
  }

  // --- Auth API ---
  register(userData: { name: string; email: string; password?: string }): {
    token: string;
    user: LocalUser;
  } {
    const rawUsers = localStorage.getItem('fintrack_local_users');
    const users: LocalUser[] = rawUsers ? JSON.parse(rawUsers) : [];

    const existing = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    );
    if (existing || userData.email.toLowerCase().trim() === DEMO_USER.email) {
      throw new Error('User with this email already exists');
    }

    const newUser: LocalUser = {
      _id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('fintrack_local_users', JSON.stringify(users));

    // Initialize starter data for new user so they have a working playground
    const initialTxs = getSeedTransactions(newUser._id);
    const initialBgs = getSeedBudgets(newUser._id);
    localStorage.setItem(`fintrack_tx_${newUser._id}`, JSON.stringify(initialTxs));
    localStorage.setItem(`fintrack_bg_${newUser._id}`, JSON.stringify(initialBgs));

    const token = 'jwt_local_' + newUser._id + '_' + Date.now();
    const cleanUser = { ...newUser };
    delete cleanUser.password;

    return { token, user: cleanUser };
  }

  login(credentials: { email: string; password?: string }): {
    token: string;
    user: LocalUser;
  } {
    const email = credentials.email.toLowerCase().trim();

    // Check demo user
    if (email === DEMO_USER.email) {
      if (credentials.password && credentials.password !== DEMO_USER.password) {
        throw new Error('Invalid email or password');
      }
      const token = 'jwt_demo_' + Date.now();
      const cleanDemo = { ...DEMO_USER };
      delete cleanDemo.password;
      return { token, user: cleanDemo };
    }

    // Check registered local users
    const rawUsers = localStorage.getItem('fintrack_local_users');
    const users: LocalUser[] = rawUsers ? JSON.parse(rawUsers) : [];
    const user = users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (credentials.password && user.password && user.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const token = 'jwt_local_' + user._id + '_' + Date.now();
    const cleanUser = { ...user };
    delete cleanUser.password;

    return { token, user: cleanUser };
  }

  getMe(): { user: LocalUser } {
    const userStr = localStorage.getItem('fintrack_user');
    if (!userStr) {
      throw new Error('Unauthorized');
    }
    return { user: JSON.parse(userStr) };
  }

  // --- Transactions API ---
  getTransactions(params?: {
    type?: string;
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
  }): LocalTransaction[] {
    const userId = this.getCurrentUserId();
    const key = `fintrack_tx_${userId}`;
    let txs: LocalTransaction[] = [];

    const raw = localStorage.getItem(key);
    if (!raw) {
      txs = getSeedTransactions(userId);
      localStorage.setItem(key, JSON.stringify(txs));
    } else {
      try {
        txs = JSON.parse(raw);
      } catch {
        txs = getSeedTransactions(userId);
      }
    }

    let filtered = [...txs];

    if (params?.type && params.type !== 'all') {
      filtered = filtered.filter((t) => t.type === params.type);
    }
    if (params?.category && params.category !== 'all') {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === params.category!.toLowerCase()
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.paymentMethod.toLowerCase().includes(q)
      );
    }
    if (params?.startDate) {
      filtered = filtered.filter((t) => t.date >= params.startDate!);
    }
    if (params?.endDate) {
      filtered = filtered.filter((t) => t.date <= params.endDate!);
    }

    filtered.sort((a, b) => {
      if (params?.sortBy === 'date_asc') {
        return a.date.localeCompare(b.date);
      } else if (params?.sortBy === 'amount_desc') {
        return b.amount - a.amount;
      } else if (params?.sortBy === 'amount_asc') {
        return a.amount - b.amount;
      }
      return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
    });

    return filtered;
  }

  addTransaction(txData: any): LocalTransaction {
    const userId = this.getCurrentUserId();
    const key = `fintrack_tx_${userId}`;
    const raw = localStorage.getItem(key);
    const txs: LocalTransaction[] = raw ? JSON.parse(raw) : getSeedTransactions(userId);

    const newTx: LocalTransaction = {
      _id: 'tx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      userId,
      title: txData.title,
      amount: Number(txData.amount),
      type: txData.type,
      category: txData.category,
      date: txData.date || new Date().toISOString().split('T')[0],
      paymentMethod: txData.paymentMethod || 'UPI',
      description: txData.description || '',
      createdAt: new Date().toISOString(),
    };

    txs.unshift(newTx);
    localStorage.setItem(key, JSON.stringify(txs));
    return newTx;
  }

  updateTransaction(id: string, updateData: any): LocalTransaction {
    const userId = this.getCurrentUserId();
    const key = `fintrack_tx_${userId}`;
    const raw = localStorage.getItem(key);
    const txs: LocalTransaction[] = raw ? JSON.parse(raw) : [];

    const index = txs.findIndex((t) => t._id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    const updated: LocalTransaction = {
      ...txs[index],
      ...updateData,
      amount: updateData.amount !== undefined ? Number(updateData.amount) : txs[index].amount,
      updatedAt: new Date().toISOString(),
    };

    txs[index] = updated;
    localStorage.setItem(key, JSON.stringify(txs));
    return updated;
  }

  deleteTransaction(id: string): { message: string } {
    const userId = this.getCurrentUserId();
    const key = `fintrack_tx_${userId}`;
    const raw = localStorage.getItem(key);
    let txs: LocalTransaction[] = raw ? JSON.parse(raw) : [];

    txs = txs.filter((t) => t._id !== id);
    localStorage.setItem(key, JSON.stringify(txs));
    return { message: 'Transaction removed' };
  }

  // --- Budgets API ---
  getBudgets(month?: number, year?: number): any[] {
    const userId = this.getCurrentUserId();
    const key = `fintrack_bg_${userId}`;
    let budgets: LocalBudget[] = [];

    const raw = localStorage.getItem(key);
    if (!raw) {
      budgets = getSeedBudgets(userId);
      localStorage.setItem(key, JSON.stringify(budgets));
    } else {
      try {
        budgets = JSON.parse(raw);
      } catch {
        budgets = getSeedBudgets(userId);
      }
    }

    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();

    const filtered = budgets.filter(
      (b) => Number(b.month) === Number(targetMonth) && Number(b.year) === Number(targetYear)
    );

    // Compute actual spending from transactions
    const allTxs = this.getTransactions();
    const monthPrefix = `${targetYear}-${String(targetMonth).padStart(2, '0')}`;
    const monthExpenses = allTxs.filter(
      (t) => t.type === 'expense' && t.date.startsWith(monthPrefix)
    );

    return filtered.map((b) => {
      const spent = monthExpenses
        .filter((t) => t.category.toLowerCase() === b.category.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = Math.max(0, b.amount - spent);
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;
      const isExceeded = spent > b.amount;

      return {
        ...b,
        spent,
        remaining,
        percentage,
        isExceeded,
      };
    });
  }

  setBudget(budgetData: {
    category: string;
    amount: number;
    month?: number;
    year?: number;
  }): any {
    const userId = this.getCurrentUserId();
    const key = `fintrack_bg_${userId}`;
    const raw = localStorage.getItem(key);
    const budgets: LocalBudget[] = raw ? JSON.parse(raw) : getSeedBudgets(userId);

    const now = new Date();
    const month = Number(budgetData.month || now.getMonth() + 1);
    const year = Number(budgetData.year || now.getFullYear());
    const amount = Number(budgetData.amount);

    const existingIndex = budgets.findIndex(
      (b) =>
        b.category.toLowerCase() === budgetData.category.toLowerCase() &&
        Number(b.month) === month &&
        Number(b.year) === year
    );

    let result: LocalBudget;
    if (existingIndex !== -1) {
      budgets[existingIndex].amount = amount;
      budgets[existingIndex].updatedAt = new Date().toISOString();
      result = budgets[existingIndex];
    } else {
      result = {
        _id: 'bg_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        userId,
        category: budgetData.category,
        amount,
        month,
        year,
        createdAt: new Date().toISOString(),
      };
      budgets.push(result);
    }

    localStorage.setItem(key, JSON.stringify(budgets));
    return result;
  }

  updateBudget(id: string, amount: number): any {
    const userId = this.getCurrentUserId();
    const key = `fintrack_bg_${userId}`;
    const raw = localStorage.getItem(key);
    const budgets: LocalBudget[] = raw ? JSON.parse(raw) : [];

    const index = budgets.findIndex((b) => b._id === id);
    if (index === -1) {
      throw new Error('Budget not found');
    }

    budgets[index].amount = Number(amount);
    budgets[index].updatedAt = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(budgets));
    return budgets[index];
  }

  deleteBudget(id: string): { message: string } {
    const userId = this.getCurrentUserId();
    const key = `fintrack_bg_${userId}`;
    const raw = localStorage.getItem(key);
    let budgets: LocalBudget[] = raw ? JSON.parse(raw) : [];

    budgets = budgets.filter((b) => b._id !== id);
    localStorage.setItem(key, JSON.stringify(budgets));
    return { message: 'Budget removed' };
  }

  // --- Dashboard Analytics API ---
  getDashboardStats(): any {
    const transactions = this.getTransactions();
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentMonthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
      }
    });

    const totalBalance = totalIncome - totalExpenses;

    const currentMonthTxs = transactions.filter((tx) => tx.date.startsWith(currentMonthPrefix));
    const totalSpentThisMonth = currentMonthTxs
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const budgets = this.getBudgets(currentMonth, currentYear);
    const totalBudgetedThisMonth = budgets.reduce((sum, b) => sum + b.amount, 0);

    // Category expenses distribution
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((tx) => {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      });

    const categoryExpenses = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Monthly trends (past 6 months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const prefix = `${y}-${String(m).padStart(2, '0')}`;

      const mIncome = transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(prefix))
        .reduce((sum, t) => sum + t.amount, 0);

      const mExpense = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(prefix))
        .reduce((sum, t) => sum + t.amount, 0);

      monthlyTrends.push({
        monthLabel: `${monthNames[m - 1]} '${String(y).slice(-2)}`,
        monthKey: prefix,
        income: mIncome,
        expense: mExpense,
      });
    }

    return {
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
        transactionCount: transactions.length,
        totalBudgetedThisMonth,
        totalSpentThisMonth,
      },
      recentTransactions: transactions.slice(0, 6),
      categoryExpenses,
      monthlyTrends,
      budgets,
    };
  }
}

export const localBackend = new LocalBackendService();

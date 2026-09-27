import React, { createContext, useContext } from 'react';

export interface Translations {
  appName: string;
  tagline: string;
  dashboard: string;
  transactions: string;
  budgets: string;
  addTransaction: string;
  quickKharcha: string;
  quickAddDesc: string;
  setBudget: string;
  totalBalance: string;
  totalIncome: string;
  totalExpenses: string;
  recentTransactions: string;
  expenseByCategory: string;
  incomeVsExpense: string;
  monthlyBudgetStatus: string;
  spent: string;
  remaining: string;
  ofLimit: string;
  exceededBy: string;
  viewAll: string;
  noTransactionsYet: string;
  addFirstTransaction: string;
  income: string;
  expense: string;
  amount: string;
  category: string;
  date: string;
  paymentMethod: string;
  description: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  searchPlaceholder: string;
  allCategories: string;
  exportCSV: string;
  backupData: string;
  restoreData: string;
  offlineNotice: string;
  installApp: string;
  tryDemo: string;
  login: string;
  register: string;
  logout: string;
  welcomeBack: string;
}

const englishTranslations: Translations = {
  appName: 'FinTrack',
  tagline: 'Track personal expenses, manage monthly budgets & save money everyday.',
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  budgets: 'Budgets',
  addTransaction: 'Add Transaction',
  quickKharcha: '⚡ Quick 1-Tap Expense',
  quickAddDesc: 'Tap a shortcut to log immediate expenses in 1 second',
  setBudget: 'Set Budget',
  totalBalance: 'Total Balance',
  totalIncome: 'Total Income',
  totalExpenses: 'Total Expenses',
  recentTransactions: 'Recent Transactions',
  expenseByCategory: 'Expenses by Category',
  incomeVsExpense: 'Income vs Expenses',
  monthlyBudgetStatus: 'Monthly Budget Status',
  spent: 'Spent',
  remaining: 'Remaining',
  ofLimit: 'of',
  exceededBy: 'Exceeded by',
  viewAll: 'View All',
  noTransactionsYet: 'No transactions recorded yet.',
  addFirstTransaction: '+ Add First Transaction',
  income: 'Income',
  expense: 'Expense',
  amount: 'Amount',
  category: 'Category',
  date: 'Date',
  paymentMethod: 'Payment Method',
  description: 'Description',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  searchPlaceholder: 'Search title, category, note...',
  allCategories: 'All Categories',
  exportCSV: 'Export CSV',
  backupData: 'Backup Data',
  restoreData: 'Restore Backup',
  offlineNotice: 'Offline Mode — Changes saved locally',
  installApp: 'FinTrack',
  tryDemo: '1-Click Demo (Rahul)',
  login: 'Log In',
  register: 'Create Account',
  logout: 'Log Out',
  welcomeBack: 'Welcome back',
};

interface LanguageContextType {
  language: 'en';
  setLanguage: (lang: 'en') => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: englishTranslations,
  toggleLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageContext.Provider
      value={{
        language: 'en',
        setLanguage: () => {},
        t: englishTranslations,
        toggleLanguage: () => {},
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};

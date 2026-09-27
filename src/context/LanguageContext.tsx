import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

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

const translations: Record<Language, Translations> = {
  en: {
    appName: 'FinTrack',
    tagline: 'Track personal expenses, manage budgets & save money everyday.',
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
    installApp: 'Install App',
    tryDemo: '1-Click Demo (Rahul)',
    login: 'Log In',
    register: 'Create Account',
    logout: 'Log Out',
    welcomeBack: 'Welcome back',
  },
  hi: {
    appName: 'FinTrack',
    tagline: 'रोजमर्रा का खर्च लिखें, मासिक बजट बनाएं और पैसे बचाएं।',
    dashboard: 'डैशबोर्ड',
    transactions: 'लेन-देन (खर्च/आय)',
    budgets: 'मासिक बजट',
    addTransaction: '+ नया खर्च/आय जोड़ें',
    quickKharcha: '⚡ 1-टैप क्विक खर्चा',
    quickAddDesc: 'दुकान या ऑटो में खड़े-खड़े 1 सेकंड में खर्च दर्ज करें',
    setBudget: 'बजट तय करें',
    totalBalance: 'कुल बैलेंस (बचत)',
    totalIncome: 'कुल आमदनी (Income)',
    totalExpenses: 'कुल खर्च (Expense)',
    recentTransactions: 'हालिया लेन-देन',
    expenseByCategory: 'किसमें कितना खर्च हुआ',
    incomeVsExpense: 'आमदनी बनाम खर्च',
    monthlyBudgetStatus: 'मासिक बजट स्थिति',
    spent: 'खर्च हुआ',
    remaining: 'बाकी बचा',
    ofLimit: 'में से',
    exceededBy: 'बजट से ज्यादा खर्च',
    viewAll: 'सभी देखें',
    noTransactionsYet: 'अभी तक कोई लेन-देन दर्ज नहीं है।',
    addFirstTransaction: '+ पहला खर्च जोड़ें',
    income: 'आमदनी (+)',
    expense: 'खर्चा (-)',
    amount: 'रुपये (Amount)',
    category: 'श्रेणी (Category)',
    date: 'तारीख',
    paymentMethod: 'भुगतान का तरीका (UPI, Cash, Card)',
    description: 'विवरण / नोट',
    save: 'सुरक्षित करें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'बदलें',
    searchPlaceholder: 'खोजें: चाय, राशन, किराया, UPI...',
    allCategories: 'सभी श्रेणियां',
    exportCSV: 'CSV डाउनलोड करें',
    backupData: 'डेटा बैकअप लें',
    restoreData: 'बैकअप रीस्टोर करें',
    offlineNotice: 'ऑफ़लाइन मोड — फोन में सुरक्षित हो रहा है',
    installApp: 'ऐप इंस्टॉल करें',
    tryDemo: 'डेमो खाता खोलें',
    login: 'लॉग इन करें',
    register: 'नया खाता बनाएं',
    logout: 'लॉग आउट',
    welcomeBack: 'नमस्ते',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('fintrack_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fintrack_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

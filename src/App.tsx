import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Budgets } from './pages/Budgets';
import { TransactionModal, TransactionData } from './components/TransactionModal';
import { BudgetModal, BudgetData } from './components/BudgetModal';

function MainApp() {
  const { user, loading } = useAuth();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'home' | 'dashboard' | 'transactions' | 'budgets' | 'login' | 'register'>(
    user ? 'dashboard' : 'home'
  );

  // Sync tab if user logs out or logs in
  React.useEffect(() => {
    if (!loading) {
      if (user && (currentTab === 'home' || currentTab === 'login' || currentTab === 'register')) {
        setCurrentTab('dashboard');
      } else if (!user && (currentTab === 'dashboard' || currentTab === 'transactions' || currentTab === 'budgets')) {
        setCurrentTab('home');
      }
    }
  }, [user, loading]);

  // Global modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionData | null>(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenAddTx = () => {
    setEditingTx(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: TransactionData) => {
    setEditingTx(tx);
    setIsTxModalOpen(true);
  };

  const handleOpenBudgetModal = (budget?: BudgetData) => {
    setEditingBudget(budget || null);
    setIsBudgetModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Initializing FinTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab === 'login' || currentTab === 'register' ? 'home' : (currentTab as any)}
        onNavigate={(tab) => {
          if (!user && (tab === 'dashboard' || tab === 'transactions' || tab === 'budgets')) {
            setCurrentTab('login');
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenAddModal={user ? handleOpenAddTx : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <Home
            onNavigateToLogin={() => setCurrentTab('login')}
            onNavigateToRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'login' && (
          <Login
            onNavigateToRegister={() => setCurrentTab('register')}
            onSuccess={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'register' && (
          <Register
            onNavigateToLogin={() => setCurrentTab('login')}
            onSuccess={() => setCurrentTab('dashboard')}
          />
        )}

        {user && currentTab === 'dashboard' && (
          <Dashboard
            onOpenAddModal={handleOpenAddTx}
            onOpenBudgetModal={() => handleOpenBudgetModal()}
            onNavigateToTransactions={() => setCurrentTab('transactions')}
            onNavigateToBudgets={() => setCurrentTab('budgets')}
            refreshTrigger={refreshTrigger}
          />
        )}

        {user && currentTab === 'transactions' && (
          <Transactions
            onOpenAddModal={handleOpenAddTx}
            onOpenEditModal={handleOpenEditTx}
            refreshTrigger={refreshTrigger}
            onRefreshNeeded={handleRefresh}
          />
        )}

        {user && currentTab === 'budgets' && (
          <Budgets
            onOpenBudgetModal={handleOpenBudgetModal}
            refreshTrigger={refreshTrigger}
            onRefreshNeeded={handleRefresh}
          />
        )}
      </main>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSuccess={handleRefresh}
        initialData={editingTx}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={handleRefresh}
        initialData={editingBudget}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

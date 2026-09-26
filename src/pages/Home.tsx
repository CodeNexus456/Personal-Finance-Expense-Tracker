import React from 'react';
import {
  Wallet,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
  PiggyBank,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { demoLogin } = useAuth();
  const [demoLoading, setDemoLoading] = React.useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    await demoLogin();
    setDemoLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>MERN Stack + JWT Auth Portfolio Project</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Take control of your personal money,{' '}
            <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
              simply & smartly.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FinTrack helps you record everyday expenses, monitor monthly budgets, and analyze spending
            habits without complicated spreadsheets or bloated financial apps.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-all"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base transition-colors"
            >
              Login to Account
            </button>

            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{demoLoading ? 'Logging into Demo...' : '1-Click Demo (Rahul)'}</span>
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            No credit card or real banking credentials needed. Safe, private & sandbox-ready.
          </p>

          {/* Realistic Mock Visual / Preview Strip */}
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">fintrack.app/dashboard</span>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                Live Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">Total Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹49,501</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>Healthy positive net</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60">
                <p className="text-xs text-emerald-800 font-medium">Total Income</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">₹80,000</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <span>Salary + Freelancing</span>
                </div>
              </div>

              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/60">
                <p className="text-xs text-rose-800 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-rose-700 mt-1">₹30,499</p>
                <div className="flex items-center text-xs text-rose-600 mt-1 font-medium">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>Within monthly limits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Built with everything you need, nothing you don't
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              Engineered with clean architectural principles: isolated database layers, JWT authentication, and intuitive visual budgeting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Expense Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log income & expenses with titles, categories, dates, and payment methods (Cash, UPI, Card).
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <PiggyBank className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Monthly Budgets</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set category limits like Food → ₹5,000. Track real-time remaining balance and visual progress bars.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <PieChart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Spending Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear visual breakdown of your top spending categories and monthly income vs expense trends.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Strict Isolation & JWT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bcrypt password hashing and JWT token protection guarantee users only access their own financial records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">FinTrack</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>React.js</span>
            <span>&bull;</span>
            <span>Node.js / Express</span>
            <span>&bull;</span>
            <span>MongoDB & Mongoose</span>
            <span>&bull;</span>
            <span>JWT & bcrypt</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

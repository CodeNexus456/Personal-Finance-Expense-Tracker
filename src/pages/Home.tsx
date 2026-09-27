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
  Zap,
  BarChart3,
  CalendarCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface HomeProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  const { demoLogin } = useAuth();
  const { t } = useLanguage();
  const [demoLoading, setDemoLoading] = React.useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    await demoLogin();
    setDemoLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full text-indigo-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Effortless Daily Personal Finance & Budgeting</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Take complete control of your money,{' '}
            <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">
              anytime & anywhere.
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Log daily expenses in seconds, monitor monthly category budgets, and analyze spending habits with clean visual analytics.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateToRegister}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-sm transition-all"
            >
              <span>{t.register}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base transition-colors"
            >
              {t.login}
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

          <p className="mt-4 text-xs text-slate-400">
            No credit card or banking credentials required. Private, fast & secure.
          </p>

          {/* Live Preview Strip */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <span className="text-xs text-slate-400 font-mono ml-2">fintrack.app</span>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded font-semibold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Real-Time Balance & Budget Sync</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">{t.totalBalance}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹49,501</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  <span>Healthy positive net balance</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60">
                <p className="text-xs text-emerald-800 font-medium">{t.totalIncome}</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">₹80,000</p>
                <div className="flex items-center text-xs text-emerald-600 mt-1 font-medium">
                  <span>Salary + Freelancing</span>
                </div>
              </div>

              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200/60">
                <p className="text-xs text-rose-800 font-medium">{t.totalExpenses}</p>
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
              Built for seamless everyday money management
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
              Everything you need to keep your personal finances organized, transparent, and under control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                1-Tap Fast Logger
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log recurring daily expenses like coffee, snacks, transit, and groceries with convenient shortcuts.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <PiggyBank className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                Monthly Budgets
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set category spending targets and receive early alerts before exceeding your budget limits.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                Visual Analytics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze income vs expenses trends over the past 6 months alongside category breakdown percentages.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-slate-900 text-base mb-1">
                Backup & Privacy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export complete JSON backups and CSV sheets anytime for total ownership of your financial records.
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
            <span>Fast & Responsive</span>
            <span>&bull;</span>
            <span>Node.js / Express</span>
            <span>&bull;</span>
            <span>JWT & Bcrypt</span>
            <span>&bull;</span>
            <span>Data Ownership</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

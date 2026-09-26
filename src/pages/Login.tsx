import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, AlertCircle, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

interface LoginProps {
  onNavigateToRegister: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateToRegister, onSuccess }) => {
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message || 'Invalid email or password');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await demoLogin();
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message || 'Demo login failed');
      }
    } catch (err: any) {
      setErrorMessage('Failed to log in with demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Wallet className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to access your transactions and budgets
          </p>
        </div>

        {/* Demo Callout banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-800">Recruiter / Quick Review?</p>
            <p className="text-xs text-slate-500">Log in with pre-seeded test data with 1-click</p>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors mt-2"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

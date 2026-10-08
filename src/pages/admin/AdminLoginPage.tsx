import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { adminLogin, DEMO_ADMIN_CREDENTIALS } from '../../lib/adminAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Activity,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFillDemo = () => {
    setEmail(DEMO_ADMIN_CREDENTIALS.email);
    setPassword(DEMO_ADMIN_CREDENTIALS.password);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your admin email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your admin password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        onNavigate('admin');
      } else {
        setErrorMessage(result.error || 'Invalid admin credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* Back to Site top-left button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CareNova Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-900/40 mx-auto">
          <Activity className="w-6 h-6" />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-white tracking-tight">
          CareNova Admin Portal
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Clinical Operations & Healthcare Platform Administration
        </p>

        {/* Demo Credentials Quick Pill */}
        <div className="mt-4 inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-full px-3 py-1 text-2xs text-teal-300">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>Portfolio Prototype Access</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white text-slate-900 py-8 px-6 sm:px-8 rounded-2xl shadow-xl border border-slate-200/80">
          
          {/* Demo Credentials Callout */}
          <div className="mb-6 p-4 rounded-xl bg-teal-50/80 border border-teal-200/80 text-xs text-teal-950 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-teal-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-2xs font-bold text-teal-800 hover:text-teal-950 bg-teal-100 hover:bg-teal-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-2xs space-y-0.5 bg-white/70 p-2 rounded-lg border border-teal-100">
              <div>Email: <strong className="text-teal-950">{DEMO_ADMIN_CREDENTIALS.email}</strong></div>
              <div>Password: <strong className="text-teal-950">{DEMO_ADMIN_CREDENTIALS.password}</strong></div>
            </div>
            <p className="text-2xs text-teal-800/80">
              Clearly labeled demo access for reviewer evaluation without requiring confidential credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@carenova.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-2xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl shadow-xs"
              >
                Sign In to Admin Portal
              </Button>
            </div>
          </form>

          {/* Prototype Footer Note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-2xs text-slate-400">
            CareNova Healthcare System Prototype · Admin Security Simulation
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { adminLogin } from '../../lib/adminAuth';
import { Button } from '../../components/ui/Button';
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
  KeyRound,
  Terminal,
  HelpCircle
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
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      if (result.success) {
        onNavigate('admin');
      } else {
        setErrorMessage(result.error || 'Invalid administrator credentials.');
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
          Supabase Authentication & Row-Level Security Protected Portal
        </p>

        {/* Security Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-full px-3 py-1 text-2xs text-teal-300">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Supabase Auth Session Guard</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white text-slate-900 py-8 px-6 sm:px-8 rounded-2xl shadow-xl border border-slate-200/80">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 break-words">
                  <span className="font-semibold">{errorMessage}</span>
                </div>
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
                  autoComplete="email"
                  placeholder="admin@example.com"
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
                  autoComplete="current-password"
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
                className="w-full justify-center bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                Sign In with Supabase Auth
              </Button>
            </div>
          </form>

          {/* First-time setup help accordion */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between text-2xs font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                First-Time Admin Setup Instructions
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showSetupGuide && (
              <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-2xs text-slate-700 space-y-2 animate-in fade-in">
                <p className="font-bold text-slate-900">How to create an administrator:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
                  <li>
                    Create an account in your Supabase project under <strong>Authentication &rarr; Users &rarr; Add user</strong>.
                  </li>
                  <li>Copy the new user's <strong>UUID</strong>.</li>
                  <li>
                    In Supabase <strong>SQL Editor</strong>, run:
                  </li>
                </ol>
                <div className="bg-slate-900 text-teal-300 font-mono p-2.5 rounded-lg text-2xs overflow-x-auto select-all">
                  UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
                </div>
                <p className="text-3xs text-slate-500">
                  Then return here and sign in with those email & password credentials.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

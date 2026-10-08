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
    <div className="min-h-screen bg-[#202020] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#D9DDE2] selection:bg-[#D6B36A] selection:text-[#202020]">
      {/* Back to Site top-left button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#AEB4BB] hover:text-[#FFFDF8] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to CareNova Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[#D6B36A] flex items-center justify-center text-[#202020] shadow-lg shadow-[#D6B36A]/20 mx-auto">
          <Activity className="w-6 h-6 font-bold" />
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-[#FFFDF8] tracking-tight">
          CareNova Admin Portal
        </h1>
        <p className="mt-1 text-xs text-[#AEB4BB]">
          Supabase Authentication & Row-Level Security Protected Portal
        </p>

        {/* Security Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#2A2926] border border-[#3A3833] rounded-full px-3 py-1 text-2xs text-[#E7D19A]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D6B36A]" />
          <span>Supabase Auth Session Guard</span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-[#FFFDF8] text-[#202020] py-8 px-6 sm:px-8 rounded-2xl shadow-xl border border-[#E7DFCE]">
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
              <label className="block text-xs font-bold text-[#3A3833] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEB4BB]" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FBF8EF] border border-[#E7DFCE] rounded-xl text-[#202020] focus:bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#3A3833]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-2xs text-[#77736A] hover:text-[#202020] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEB4BB]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FBF8EF] border border-[#E7DFCE] rounded-xl text-[#202020] focus:bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-transparent transition-all"
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
                className="w-full justify-center font-bold py-2.5 rounded-xl shadow-xs cursor-pointer"
              >
                Sign In with Supabase Auth
              </Button>
            </div>
          </form>

          {/* First-time setup help accordion */}
          <div className="mt-6 pt-4 border-t border-[#E7DFCE]">
            <button
              type="button"
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full flex items-center justify-between text-2xs font-semibold text-[#77736A] hover:text-[#8E6D2B] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#D6B36A]" />
                First-Time Admin Setup Instructions
              </span>
              <HelpCircle className="w-3.5 h-3.5 text-[#AEB4BB]" />
            </button>

            {showSetupGuide && (
              <div className="mt-3 p-3.5 rounded-xl bg-[#FBF8EF] border border-[#E7DFCE] text-2xs text-[#3A3833] space-y-2 animate-in fade-in">
                <p className="font-bold text-[#202020]">How to create an administrator:</p>
                <ol className="list-decimal list-inside space-y-1 text-[#77736A] leading-relaxed">
                  <li>
                    Create an account in your Supabase project under <strong>Authentication &rarr; Users &rarr; Add user</strong>.
                  </li>
                  <li>Copy the new user's <strong>UUID</strong>.</li>
                  <li>
                    In Supabase <strong>SQL Editor</strong>, run:
                  </li>
                </ol>
                <div className="bg-[#202020] text-[#E7D19A] font-mono p-2.5 rounded-lg text-2xs overflow-x-auto select-all border border-[#3A3833]">
                  UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
                </div>
                <p className="text-3xs text-[#AEB4BB]">
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

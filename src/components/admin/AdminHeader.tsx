import React from 'react';
import { PageRoute } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Menu,
  RotateCw,
  ExternalLink,
  Database,
  CheckCircle2
} from 'lucide-react';

interface AdminHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenMobileSidebar: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileSidebar,
  onRefresh,
  isRefreshing = false
}) => {
  const getPageInfo = (): { title: string; subtitle: string } => {
    switch (currentPage) {
      case 'admin':
        return {
          title: 'Operations Dashboard',
          subtitle: 'Real-time overview of clinic appointments, specialists, and patient inquiries'
        };
      case 'admin-appointments':
        return {
          title: 'Appointment Management',
          subtitle: 'Review, confirm, and coordinate patient consultations from public.appointments'
        };
      case 'admin-doctors':
        return {
          title: 'Doctor Directory Management',
          subtitle: 'Active medical specialists, credentials, and schedule availability from public.doctors'
        };
      case 'admin-services':
        return {
          title: 'Clinical Services',
          subtitle: 'Medical service catalog, treatment programs, and departments from public.services'
        };
      case 'admin-messages':
        return {
          title: 'Inquiries & Messages',
          subtitle: 'Inbound patient questions and general contact messages from public.contact_messages'
        };
      default:
        return {
          title: 'Admin Portal',
          subtitle: 'CareNova Clinical Platform Operations'
        };
    }
  };

  const { title, subtitle } = getPageInfo();
  const supabaseConnected = isSupabaseConfigured();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="hidden sm:block text-2xs text-slate-500 font-medium line-clamp-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Status Pill & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Supabase Status Pill */}
          <div
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-bold border transition-colors ${
              supabaseConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{supabaseConnected ? 'Supabase Live' : 'Demo Local Mode'}</span>
            {supabaseConnected && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          )}

          {/* View Website External Link */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

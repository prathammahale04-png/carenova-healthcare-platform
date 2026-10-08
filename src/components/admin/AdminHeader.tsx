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
    <header className="sticky top-0 z-20 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E7DFCE] px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-[#77736A] hover:text-[#202020] hover:bg-[#FBF8EF] rounded-xl transition-colors cursor-pointer"
            aria-label="Open sidebar navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#202020] tracking-tight leading-tight">
              {title}
            </h1>
            <p className="hidden sm:block text-2xs text-[#77736A] font-medium line-clamp-1">
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
                ? 'bg-[#2E7D52]/10 text-[#2E7D52] border-[#2E7D52]/30'
                : 'bg-[#F4E9C9]/60 text-[#8E6D2B] border-[#E7D19A]'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>{supabaseConnected ? 'Supabase Live' : 'Demo Local Mode'}</span>
            {supabaseConnected && <CheckCircle2 className="w-2.5 h-2.5 text-[#2E7D52]" />}
          </div>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-[#77736A] hover:text-[#202020] hover:bg-[#FBF8EF] rounded-xl transition-colors disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B36A]"
              title="Refresh data"
              aria-label="Refresh data"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D6B36A]' : ''}`} />
            </button>
          )}

          {/* View Website External Link */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7DFCE] hover:border-[#D6B36A]/60 text-xs font-semibold text-[#3A3833] hover:text-[#202020] hover:bg-[#FBF8EF] transition-colors cursor-pointer"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#AEB4BB]" />
          </button>
        </div>
      </div>
    </header>
  );
};

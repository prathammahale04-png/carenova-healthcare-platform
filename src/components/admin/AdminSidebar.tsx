import React from 'react';
import { PageRoute } from '../../types';
import { adminLogout, getAdminUser } from '../../lib/adminAuth';
import {
  LayoutDashboard,
  CalendarCheck2,
  Users2,
  Stethoscope,
  MessageSquare,
  ArrowLeft,
  LogOut,
  X,
  Activity,
  ShieldCheck
} from 'lucide-react';

interface AdminSidebarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  counts?: {
    pendingAppointments?: number;
    unreadMessages?: number;
  };
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  counts
}) => {
  const adminUser = getAdminUser();

  const navItems: {
    label: string;
    page: PageRoute;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    {
      label: 'Dashboard',
      page: 'admin',
      icon: LayoutDashboard
    },
    {
      label: 'Appointments',
      page: 'admin-appointments',
      icon: CalendarCheck2,
      badge: counts?.pendingAppointments
    },
    {
      label: 'Doctors',
      page: 'admin-doctors',
      icon: Users2
    },
    {
      label: 'Services',
      page: 'admin-services',
      icon: Stethoscope
    },
    {
      label: 'Messages',
      page: 'admin-messages',
      icon: MessageSquare,
      badge: counts?.unreadMessages
    }
  ];

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    adminLogout();
    onCloseMobile();
    onNavigate('admin-login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => handleNav('admin')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-900/40 group-hover:bg-teal-500 transition-colors">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">CareNova</span>
              <span className="text-2xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded">
                Admin
              </span>
            </div>
            <p className="text-2xs text-slate-400">Clinical Operations Portal</p>
          </div>
        </button>

        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">
            Management
          </p>
        </div>

        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;

          return (
            <button
              key={item.page}
              onClick={() => handleNav(item.page)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-teal-800 text-teal-100'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Admin User Info & Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
        {/* User Card */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">
              {adminUser?.name || 'CareNova Admin'}
            </p>
            <p className="text-2xs text-slate-400 truncate">
              {adminUser?.email || 'admin@carenova.demo'}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-1">
          {/* Back to Website */}
          <button
            onClick={() => handleNav('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            <span>Back to Public Website</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Log Out Admin</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-72 shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

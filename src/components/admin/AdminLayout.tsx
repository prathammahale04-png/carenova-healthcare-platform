import React, { useState, ReactNode } from 'react';
import { PageRoute } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  children: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  counts?: {
    pendingAppointments?: number;
    unreadMessages?: number;
  };
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPage,
  onNavigate,
  children,
  onRefresh,
  isRefreshing = false,
  counts
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Left Sidebar */}
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all">
        {/* Top Header */}
        <AdminHeader
          currentPage={currentPage}
          onNavigate={onNavigate}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

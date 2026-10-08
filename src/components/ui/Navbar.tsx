import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { Activity, Menu, X, CalendarCheck2 } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Doctors', page: 'doctors' },
    { label: 'About', page: 'about' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#E7DFCE] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B36A] rounded-xl p-1 group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D6B36A] flex items-center justify-center text-[#F1F3F5] shadow-sm group-hover:bg-[#C59E52] transition-colors border border-[#C59E52]/40">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#202020] group-hover:text-[#D6B36A] transition-colors">
                CareNova
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FBF8EF] p-1 rounded-xl border border-[#E7DFCE] text-xs font-semibold">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B36A] ${
                    isActive
                      ? 'bg-white text-[#D6B36A] font-bold shadow-2xs border border-[#E7DFCE]'
                      : 'text-[#3A3833] hover:text-[#D6B36A] hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#77736A] hover:text-[#D6B36A] hover:bg-[#FBF8EF] transition-colors cursor-pointer"
              title="Open CareNova Admin Operations Portal"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B36A]"></span>
              <span>Admin Portal</span>
            </button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<CalendarCheck2 className="w-3.5 h-3.5" />}
              onClick={() => handleNavClick('appointment')}
              className="hidden sm:inline-flex font-semibold shadow-xs"
            >
              Book an Appointment
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#202020] hover:text-[#D6B36A] hover:bg-[#FBF8EF] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B36A] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-16 bg-[#202020]/40 backdrop-blur-xs -z-10 animate-in fade-in duration-150"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden border-t border-[#E7DFCE] bg-[#FFFDF8] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => handleNavClick(link.page)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-colors text-left cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#F4E9C9]/50 text-[#202020] font-semibold border border-[#E7DFCE]'
                        : 'text-[#3A3833] hover:bg-[#FBF8EF] hover:text-[#D6B36A]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-[#D6B36A]" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#E7DFCE] flex flex-col gap-2.5">
              <Button
                variant="primary"
                size="md"
                leftIcon={<CalendarCheck2 className="w-4 h-4" />}
                onClick={() => handleNavClick('appointment')}
                className="w-full justify-center"
              >
                Book an Appointment
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => handleNavClick('doctors')}
                className="w-full justify-center"
              >
                Find a Doctor
              </Button>
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 rounded-xl border border-[#E7DFCE] text-xs font-bold text-[#77736A] hover:bg-[#FBF8EF] hover:text-[#202020] transition-colors text-center cursor-pointer"
              >
                Admin Operations Portal
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

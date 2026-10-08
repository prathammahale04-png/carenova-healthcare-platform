import React from 'react';
import { PageRoute } from '../../types';
import { Activity, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#202020] text-[#D9DDE2] border-t border-[#3A3833]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D6B36A] flex items-center justify-center text-[#F1F3F5] shadow-xs border border-[#C59E52]/40">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#FFFDF8]">
                CareNova
              </span>
            </div>
            <p className="text-sm text-[#AEB4BB] max-w-sm leading-relaxed">
              Better Care. Smarter Healthcare. Discover trusted medical specialists, explore tailored clinical services, and seamlessly coordinate appointments online.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#AEB4BB]">
              <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />
              <span>Simulated Digital Healthcare Architecture Prototype</span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h3 className="text-xs font-semibold text-[#FFFDF8] uppercase tracking-wider mb-4">
              Explore Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Clinical Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('doctors')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Doctor Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('appointment')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="text-[#D6B36A] hover:text-[#E7D19A] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D6B36A]"></span>
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialties */}
          <div>
            <h3 className="text-xs font-semibold text-[#FFFDF8] uppercase tracking-wider mb-4">
              Featured Specialties
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  General Medicine
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Cardiology
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Dermatology
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Pediatrics & Orthopedics
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h3 className="text-xs font-semibold text-[#FFFDF8] uppercase tracking-wider mb-4">
              Information
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  About CareNova
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('faq')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#D6B36A] transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <span className="text-xs text-[#D6B36A]/90 block pt-1">
                  Portfolio Design Case Study
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fictional Portfolio Disclaimer Banner */}
        <div className="mt-12 pt-8 border-t border-[#3A3833]">
          <div className="bg-[#2A2926] rounded-xl p-4 border border-[#3A3833] text-xs leading-relaxed text-[#AEB4BB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-[#FFFDF8]">
                CareNova Portfolio Demonstration Notice
              </p>
              <p>
                CareNova is a fictional concept project designed for an AI Web Designer & Digital Product Creator portfolio. No actual medical consultations, clinical diagnoses, or appointments are executed. In a medical emergency, please call your local emergency services immediately.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-1.5 text-[#D9DDE2] bg-[#202020] px-3 py-1.5 rounded-md border border-[#3A3833]">
              <Heart className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>Designed with Care</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736A]">
            <p>© {new Date().getFullYear()} CareNova Health Systems Inc. (Fictional Concept). All rights reserved.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => handleNav('about')} className="hover:text-[#D6B36A] transition-colors">
                Design System Specs
              </button>
              <button onClick={() => handleNav('faq')} className="hover:text-[#D6B36A] transition-colors">
                Demo FAQ
              </button>
              <button onClick={() => handleNav('contact')} className="hover:text-[#D6B36A] transition-colors">
                Portfolio Inquiries
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute, Doctor, HealthcareService } from './types';
import { MOCK_DOCTORS } from './data/mockData';
import { DemoBanner } from './components/ui/DemoBanner';
import { Navbar } from './components/ui/Navbar';
import { Footer } from './components/ui/Footer';
import { isAdminAuthenticated } from './lib/adminAuth';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DoctorProfilePage } from './pages/DoctorProfilePage';
import { AppointmentPage } from './pages/AppointmentPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';

// Map URL path or hash to PageRoute
const getInitialPageFromUrl = (): PageRoute => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');

  const check = (target: string) => path.includes(target) || hash.includes(target);

  if (check('/admin/login') || check('admin/login') || check('admin-login')) return 'admin-login';
  if (check('/admin/appointments') || check('admin/appointments') || check('admin-appointments')) return 'admin-appointments';
  if (check('/admin/doctors') || check('admin/doctors') || check('admin-doctors')) return 'admin-doctors';
  if (check('/admin/services') || check('admin/services') || check('admin-services')) return 'admin-services';
  if (check('/admin/messages') || check('admin/messages') || check('admin-messages')) return 'admin-messages';
  if (check('/admin') || check('admin')) return 'admin';
  if (check('/services') || check('services')) return 'services';
  if (check('/doctors') || check('doctors')) return 'doctors';
  if (check('/appointment') || check('appointment')) return 'appointment';
  if (check('/about') || check('about')) return 'about';
  if (check('/contact') || check('contact')) return 'contact';
  if (check('/faq') || check('faq')) return 'faq';

  return 'home';
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPageFromUrl);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(MOCK_DOCTORS[0]);
  const [prefillDoctor, setPrefillDoctor] = useState<Doctor | null>(null);
  const [prefillSpecialty, setPrefillSpecialty] = useState<string | null>(null);
  const [prefillSchedule, setPrefillSchedule] = useState<{
    date?: string;
    timeSlot?: string;
    consultationType?: 'in-clinic' | 'telehealth';
  } | null>(null);

  // Sync route with URL history
  const navigateTo = (page: PageRoute) => {
    // If attempting to access a protected admin route while unauthenticated, redirect to admin-login
    if (page.startsWith('admin') && page !== 'admin-login') {
      if (!isAdminAuthenticated()) {
        setCurrentPage('admin-login');
        window.history.pushState({}, '', '/admin/login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setCurrentPage(page);

    // Update browser URL bar cleanly
    const urlMap: Record<PageRoute, string> = {
      'home': '/',
      'services': '/services',
      'doctors': '/doctors',
      'doctor-profile': '/doctors/profile',
      'appointment': '/appointment',
      'about': '/about',
      'contact': '/contact',
      'faq': '/faq',
      'admin': '/admin',
      'admin-login': '/admin/login',
      'admin-appointments': '/admin/appointments',
      'admin-doctors': '/admin/doctors',
      'admin-services': '/admin/services',
      'admin-messages': '/admin/messages'
    };

    if (urlMap[page]) {
      window.history.pushState({}, '', urlMap[page]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const page = getInitialPageFromUrl();
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check auth on admin pages
  useEffect(() => {
    if (currentPage.startsWith('admin') && currentPage !== 'admin-login') {
      if (!isAdminAuthenticated()) {
        setCurrentPage('admin-login');
      }
    }
  }, [currentPage]);

  const handleSelectDoctorForProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    navigateTo('doctor-profile');
  };

  const handleBookWithDoctor = (
    doctor: Doctor,
    prefill?: { date?: string; timeSlot?: string; consultationType?: 'in-clinic' | 'telehealth' }
  ) => {
    setPrefillDoctor(doctor);
    setPrefillSpecialty(doctor.specialty);
    setPrefillSchedule(prefill || null);
    navigateTo('appointment');
  };

  const handleBookWithService = (service: HealthcareService) => {
    setPrefillDoctor(null);
    setPrefillSpecialty(service.name);
    setPrefillSchedule(null);
    navigateTo('appointment');
  };

  const isAdminRoute = currentPage.startsWith('admin');

  // If in Admin Section, render admin pages without public header/footer
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#FBF8EF] text-[#202020] selection:bg-[#F4E9C9] selection:text-[#202020] font-sans">
        {currentPage === 'admin-login' && (
          <AdminLoginPage onNavigate={navigateTo} />
        )}

        {currentPage === 'admin' && (
          <AdminDashboardPage onNavigate={navigateTo} />
        )}

        {currentPage === 'admin-appointments' && (
          <AdminAppointmentsPage key={currentPage} onNavigate={navigateTo} />
        )}

        {currentPage === 'admin-doctors' && (
          <AdminDoctorsPage onNavigate={navigateTo} />
        )}

        {currentPage === 'admin-services' && (
          <AdminServicesPage onNavigate={navigateTo} />
        )}

        {currentPage === 'admin-messages' && (
          <AdminMessagesPage onNavigate={navigateTo} />
        )}
      </div>
    );
  }

  // Public Healthcare Website Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-[#3A3833] selection:bg-[#F4E9C9] selection:text-[#202020]">
      {/* Portfolio Context Banner */}
      <DemoBanner />

      {/* Main Top Navbar */}
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      {/* Page Body Router */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onSelectDoctor={handleSelectDoctorForProfile}
            onBookWithDoctor={handleBookWithDoctor}
            onBookWithService={handleBookWithService}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            onNavigate={navigateTo}
            onBookWithService={handleBookWithService}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorsPage
            onNavigate={navigateTo}
            onSelectDoctor={handleSelectDoctorForProfile}
            onBookWithDoctor={handleBookWithDoctor}
          />
        )}

        {currentPage === 'doctor-profile' && (
          <DoctorProfilePage
            doctor={selectedDoctor}
            onNavigate={navigateTo}
            onBookAppointment={handleBookWithDoctor}
          />
        )}

        {currentPage === 'appointment' && (
          <AppointmentPage
            initialDoctor={prefillDoctor}
            initialSpecialty={prefillSpecialty}
            initialSchedule={prefillSchedule}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={navigateTo} />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={navigateTo} />
        )}

        {currentPage === 'faq' && (
          <FaqPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

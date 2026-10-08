import React, { useState, useEffect } from 'react';
import { PageRoute, Doctor, HealthcareService } from '../types';
import { getDoctors, getServices } from '../lib/api';
import {
  MOCK_DOCTORS,
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_FAQS,
  DEMO_STATS,
  HERO_IMAGE,
  PRODUCT_HERO_IMAGE
} from '../data/mockData';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { DoctorCard } from '../components/cards/DoctorCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ServiceDetailModal } from '../components/cards/ServiceDetailModal';
import {
  CalendarCheck2,
  Search,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Video,
  HeartHandshake,
  Star,
  Users
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookWithDoctor: (doctor: Doctor) => void;
  onBookWithService: (service: HealthcareService) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectDoctor,
  onBookWithDoctor,
  onBookWithService
}) => {
  const [activeServiceModal, setActiveServiceModal] = useState<HealthcareService | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  const [doctorsList, setDoctorsList] = useState<Doctor[]>(MOCK_DOCTORS);
  const [servicesList, setServicesList] = useState<HealthcareService[]>(MOCK_SERVICES);

  useEffect(() => {
    let isMounted = true;
    getDoctors().then(res => {
      if (isMounted && res.data && res.data.length > 0) setDoctorsList(res.data);
    }).catch(() => {});
    getServices().then(res => {
      if (isMounted && res.data && res.data.length > 0) setServicesList(res.data);
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const featuredDoctors = doctorsList.slice(0, 3);
  const featuredServices = servicesList.slice(0, 4);
  const previewFaqs = MOCK_FAQS.slice(0, 4);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-w-0">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-800 bg-teal-50/90 border border-teal-200/70 px-3 py-1.5 rounded-md">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Next-Generation Healthcare Concept</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Better Care. <span className="text-teal-700">Smarter Healthcare.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Find trusted healthcare professionals, explore personalized services, and manage your care from one simple digital experience.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<CalendarCheck2 className="w-4 h-4" />}
                  onClick={() => onNavigate('appointment')}
                  className="shadow-sm"
                >
                  Book an Appointment
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Search className="w-4 h-4" />}
                  onClick={() => onNavigate('doctors')}
                >
                  Find a Doctor
                </Button>
              </div>

              {/* Quick Specialist Jump Triage */}
              <div className="pt-2 text-xs text-slate-600">
                <span className="text-slate-500 mr-2">Common specialties:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1.5 sm:mt-0">
                  {['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics'].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        const srv = servicesList.find(s => s.name.toLowerCase().includes(spec.toLowerCase()));
                        if (srv) onBookWithService(srv);
                        else onNavigate('doctors');
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 font-medium transition-colors cursor-pointer"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Micro Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-slate-600 border-t border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">Credentialing UI Demo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">In-Clinic & Telehealth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-700 shrink-0" />
                  <span className="font-medium">Availability Flow Demo</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Carrier */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-100 aspect-16/10 sm:aspect-16/10 lg:aspect-4/3 group">
                <img
                  src={PRODUCT_HERO_IMAGE}
                  alt="CareNova digital healthcare platform interface on tablet device"
                  referrerPolicy="no-referrer"
                  onLoad={() => setHeroImageLoaded(true)}
                  className={`w-full h-full object-cover object-center transition-all duration-700 ${
                    heroImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />

                {/* Subtle gradient scrim at bottom to ensure contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent pointer-events-none" />
                
                {/* Product Badge in Top Corner */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 text-2xs font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>CareNova Patient Portal UI</span>
                </div>
                
                {/* Floating Micro-Card Over Hero Image on tablet/desktop */}
                <div className="hidden sm:block absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-lg text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 shrink-0 font-bold text-xs">
                        AS
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                          <span>Dr. Anaya Sharma</span>
                          <span className="text-2xs font-normal text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded">Cardiology</span>
                        </div>
                        <div className="text-2xs text-slate-600 truncate mt-0.5">Next opening: Today at 3:30 PM (In-Clinic / Video)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookWithDoctor(doctorsList[0] || MOCK_DOCTORS[0])}
                      className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Book Slot</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile companion card below image on small screens */}
              <div className="sm:hidden mt-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 shrink-0 font-bold text-xs">
                      AS
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">Dr. Anaya Sharma</div>
                      <div className="text-2xs text-slate-600 truncate">Cardiology · Available Today · 3:30 PM</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onBookWithDoctor(doctorsList[0] || MOCK_DOCTORS[0])}
                    className="text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Decorative background aura */}
              <div
                className="absolute -top-10 -right-10 w-64 h-64 bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>

          </div>
        </div>
      </section>

      {/* TRUST INDICATORS & STATS */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {DEMO_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="text-left border-l-2 border-teal-600/40 pl-4 py-1"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800 mt-1">
                  {stat.label}
                </div>
                <div className="text-2xs sm:text-xs text-slate-500 mt-0.5">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <span className="text-2xs text-slate-400">
              * Figures represent CareNova design prototype specifications and simulated clinical benchmark data.
            </span>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Personalized Care"
            title="Comprehensive Healthcare Services"
            subtitle="Designed around the complete human lifecycle, from routine preventative screenings to targeted specialty therapies."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onLearnMore={(srv) => setActiveServiceModal(srv)}
                onBookService={(srv) => onBookWithService(srv)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('services')}
            >
              View All 8 Clinical Specialties
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Our Specialists"
            title="Meet Our Featured Doctors"
            subtitle="Explore licensed clinicians dedicated to empathetic listening, evidence-grounded diagnostics, and respectful patient care."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onViewProfile={(doc) => onSelectDoctor(doc)}
                onBookAppointment={(doc) => onBookWithDoctor(doc)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => onNavigate('doctors')}
            >
              Search Full Doctor Directory
            </Button>
          </div>
        </div>
      </section>

      {/* HOW CARENOVA WORKS */}
      <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Simplified Journey"
            title="How CareNova Works"
            subtitle="A transparent, frictionless 3-step digital process designed to eliminate phone tag and traditional clinic waiting-room anxiety."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 text-left shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-700 tracking-wider">
                  01. DISCOVER & FILTER
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Find the Right Specialist
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Filter physicians by specialty, clinical sub-interests, language spoken, and consultation type (in-clinic or telehealth).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Structured bios, credentials & simulated review histories.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 text-left shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-700 tracking-wider">
                  02. SCHEDULE SEAMLESSLY
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Select Your Preferred Slot
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Interactive calendar slot demo. Select morning or afternoon time slots without repetitive phone confirmation loops.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Instant prototype confirmation & simulated calendar preview.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 text-left shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-teal-700 tracking-wider">
                  03. RECEIVE ATTENTIVE CARE
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  Arrive or Connect Online
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Interactive preview for in-clinic arrival workflows and browser telehealth demo interfaces. Complete care notes are accessible post-visit.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                Prototype clinical summary & actionable lifestyle plan demo.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE CARENOVA */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
                The CareNova Difference
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-[1.2]">
                Designed for Human Dignity and Clinical Excellence
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Traditional healthcare websites are notoriously dense, stressful, and difficult to navigate when you feel unwell. CareNova bridges modern design technology with empathetic clinical principles.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Credentialing UI Showcase</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Specialist profiles demonstrate comprehensive medical qualifications and verified portfolio metadata.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Zero Wait-Time Architecture</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Digital pre-registration eliminates repetitive clipboard paperwork upon arrival.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Patient Data Autonomy</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Privacy-by-design architecture ensures your consultation records remain strictly confidential.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('about')}
                >
                  Read Our Vision & Mission
                </Button>
              </div>
            </div>

            {/* Visual Bento Card */}
            <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-800 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                CareNova Core Metric
              </span>
              <div className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                15 min
              </div>
              <p className="text-sm text-slate-300 mt-2 font-medium">
                Average turnaround time for appointment confirmation requests.
              </p>

              <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs text-slate-300">
                <div>
                  <div className="font-semibold text-white">99.4%</div>
                  <div className="text-slate-400 mt-0.5">On-time consultation starts</div>
                </div>
                <div>
                  <div className="font-semibold text-white">100%</div>
                  <div className="text-slate-400 mt-0.5">Digital health intake completion</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                "We built CareNova to demonstrate what happens when patient empathy drives every interaction."
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PATIENT EXPERIENCE (TESTIMONIALS) */}
      <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Patient Voices"
            title="Real Experiences, Compassionate Care"
            subtitle="Attributable feedback from fictional community members who have experienced CareNova's digital care coordination."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {MOCK_TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">
                    {t.patientName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {t.role} · Consulted in {t.specialtyConsulted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Answers & Transparency"
            title="Frequently Asked Questions"
            subtitle="Clear answers regarding scheduling, clinical vetting, and platform demonstration features."
          />

          <div className="space-y-3">
            {previewFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-teal-700 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-teal-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigate('faq')}
            >
              Explore All 8+ Frequently Asked Questions
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 md:py-20 bg-teal-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-[1.2]"
            style={{ textWrap: 'balance' }}
          >
            Ready to experience thoughtful, modern healthcare?
          </h2>
          <p className="text-teal-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Schedule a consultation with our verified clinical specialists today or explore our comprehensive clinical directories.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="white"
              size="lg"
              onClick={() => onNavigate('appointment')}
              className="font-bold shadow-md cursor-pointer"
            >
              Book an Appointment Now
            </Button>
            <Button
              variant="outline-white"
              size="lg"
              onClick={() => onNavigate('doctors')}
              className="font-semibold cursor-pointer"
            >
              Browse Doctor Profiles
            </Button>
          </div>

          <p className="text-2xs text-teal-300 pt-4">
            CareNova is an interactive digital portfolio project. No real patient data is collected or billed.
          </p>
        </div>

        {/* Subtle background glow */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-700/40 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </section>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={activeServiceModal}
        isOpen={Boolean(activeServiceModal)}
        onClose={() => setActiveServiceModal(null)}
        onBookService={(srv) => {
          setActiveServiceModal(null);
          onBookWithService(srv);
        }}
      />

    </div>
  );
};

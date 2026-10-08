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
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-[#E7DFCE] bg-gradient-to-b from-[#FFFDF8] via-[#FBF8EF] to-[#FFFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Copy & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E6D2B] bg-[#F4E9C9]/70 border border-[#E7D19A] px-3.5 py-1.5 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#D6B36A] animate-pulse" />
                <span>Next-Generation Healthcare Concept</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl font-extrabold text-[#202020] tracking-tight leading-[1.15]"
                style={{ textWrap: 'balance' }}
              >
                Better Care. <span className="text-[#D6B36A]">Smarter Healthcare.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#77736A] leading-relaxed max-w-xl font-normal">
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
                  variant="secondary"
                  size="lg"
                  leftIcon={<Search className="w-4 h-4" />}
                  onClick={() => onNavigate('doctors')}
                >
                  Find a Doctor
                </Button>
              </div>

              {/* Quick Specialist Jump Triage */}
              <div className="pt-2 text-xs text-[#77736A]">
                <span className="text-[#77736A] mr-2">Common specialties:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1.5 sm:mt-0">
                  {['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics'].map((spec) => (
                    <button
                      key={spec}
                      onClick={() => {
                        const srv = servicesList.find(s => s.name.toLowerCase().includes(spec.toLowerCase()));
                        if (srv) onBookWithService(srv);
                        else onNavigate('doctors');
                      }}
                      className="px-2.5 py-1 rounded-md bg-[#FFFDF8] hover:bg-[#F4E9C9]/70 hover:text-[#202020] text-[#3A3833] font-medium border border-[#E7DFCE] transition-colors cursor-pointer"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Micro Trust Signals */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs text-[#77736A] border-t border-[#E7DFCE]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D6B36A] shrink-0" />
                  <span className="font-medium text-[#3A3833]">Credentialing UI Demo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#D6B36A] shrink-0" />
                  <span className="font-medium text-[#3A3833]">In-Clinic & Telehealth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D6B36A] shrink-0" />
                  <span className="font-medium text-[#3A3833]">Availability Flow Demo</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Carrier */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E7DFCE] shadow-xl bg-[#FBF8EF] aspect-16/10 sm:aspect-16/10 lg:aspect-4/3 group">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#202020]/65 via-[#202020]/10 to-transparent pointer-events-none" />
                
                {/* Product Badge in Top Corner */}
                <div className="absolute top-3 left-3 bg-[#FFFDF8]/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#E7DFCE] shadow-xs flex items-center gap-1.5 text-2xs font-bold text-[#202020]">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D52] animate-pulse" />
                  <span>CareNova Patient Portal UI</span>
                </div>
                
                {/* Floating Micro-Card Over Hero Image on tablet/desktop */}
                <div className="hidden sm:block absolute bottom-3 left-3 right-3 bg-[#FFFDF8]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#E7DFCE] shadow-lg text-left">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#F4E9C9] border border-[#E7D19A] flex items-center justify-center text-[#5E4A1E] shrink-0 font-bold text-xs">
                        AS
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#202020] truncate flex items-center gap-1.5">
                          <span>Dr. Anaya Sharma</span>
                          <span className="text-2xs font-normal text-[#8E6D2B] bg-[#FBF8EF] border border-[#E7DFCE] px-1.5 py-0.2 rounded">Cardiology</span>
                        </div>
                        <div className="text-2xs text-[#77736A] truncate mt-0.5">Next opening: Today at 3:30 PM (In-Clinic / Video)</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onBookWithDoctor(doctorsList[0] || MOCK_DOCTORS[0])}
                      className="text-xs font-semibold text-[#F1F3F5] bg-[#D6B36A] hover:bg-[#C59E52] hover:text-white flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer border border-[#C59E52]/50"
                    >
                      <span>Book Slot</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile companion card below image on small screens */}
              <div className="sm:hidden mt-3 bg-[#FFFDF8] p-3.5 rounded-xl border border-[#E7DFCE] shadow-xs text-left">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#F4E9C9] border border-[#E7D19A] flex items-center justify-center text-[#5E4A1E] shrink-0 font-bold text-xs">
                      AS
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#202020] truncate">Dr. Anaya Sharma</div>
                      <div className="text-2xs text-[#77736A] truncate">Cardiology · Available Today · 3:30 PM</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onBookWithDoctor(doctorsList[0] || MOCK_DOCTORS[0])}
                    className="text-xs font-semibold text-[#F1F3F5] bg-[#D6B36A] hover:bg-[#C59E52] flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Decorative background aura */}
              <div
                className="absolute -top-10 -right-10 w-64 h-64 bg-[#D6B36A]/15 rounded-full blur-3xl -z-10 pointer-events-none"
                aria-hidden="true"
              />
            </div>

          </div>
        </div>
      </section>

      {/* TRUST INDICATORS & STATS */}
      <section className="py-12 bg-[#FFFDF8] border-b border-[#E7DFCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {DEMO_STATS.map((stat, idx) => (
              <div
                key={idx}
                className="text-left border-l-2 border-[#D6B36A] pl-4 py-1"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-[#202020] tracking-tight tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#3A3833] mt-1">
                  {stat.label}
                </div>
                <div className="text-2xs sm:text-xs text-[#77736A] mt-0.5">
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <span className="text-2xs text-[#AEB4BB]">
              * Figures represent CareNova design prototype specifications and simulated clinical benchmark data.
            </span>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 md:py-24 bg-white border-b border-[#E7DFCE]">
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
              variant="secondary"
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
      <section className="py-16 md:py-24 bg-[#FBF8EF] border-b border-[#E7DFCE]">
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
      <section className="py-16 md:py-24 bg-[#FFFDF8] border-b border-[#E7DFCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            kicker="Simplified Journey"
            title="How CareNova Works"
            subtitle="A transparent, frictionless 3-step digital process designed to eliminate phone tag and traditional clinic waiting-room anxiety."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-[#FBF8EF] rounded-2xl p-6 sm:p-8 border border-[#E7DFCE] text-left shadow-2xs flex flex-col justify-between hover:border-[#D6B36A]/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#8E6D2B] tracking-wider">
                  01. DISCOVER & FILTER
                </span>
                <h3 className="text-xl font-bold text-[#202020] mt-2">
                  Find the Right Specialist
                </h3>
                <p className="mt-3 text-sm text-[#77736A] leading-relaxed">
                  Filter physicians by specialty, clinical sub-interests, language spoken, and consultation type (in-clinic or telehealth).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7DFCE]/70 text-xs text-[#77736A]">
                Structured bios, credentials & simulated review histories.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FBF8EF] rounded-2xl p-6 sm:p-8 border border-[#E7DFCE] text-left shadow-2xs flex flex-col justify-between hover:border-[#D6B36A]/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#8E6D2B] tracking-wider">
                  02. SCHEDULE SEAMLESSLY
                </span>
                <h3 className="text-xl font-bold text-[#202020] mt-2">
                  Select Your Preferred Slot
                </h3>
                <p className="mt-3 text-sm text-[#77736A] leading-relaxed">
                  Interactive calendar slot demo. Select morning or afternoon time slots without repetitive phone confirmation loops.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7DFCE]/70 text-xs text-[#77736A]">
                Instant prototype confirmation & simulated calendar preview.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FBF8EF] rounded-2xl p-6 sm:p-8 border border-[#E7DFCE] text-left shadow-2xs flex flex-col justify-between hover:border-[#D6B36A]/60 transition-colors">
              <div>
                <span className="text-xs font-bold text-[#8E6D2B] tracking-wider">
                  03. RECEIVE ATTENTIVE CARE
                </span>
                <h3 className="text-xl font-bold text-[#202020] mt-2">
                  Arrive or Connect Online
                </h3>
                <p className="mt-3 text-sm text-[#77736A] leading-relaxed">
                  Interactive preview for in-clinic arrival workflows and browser telehealth demo interfaces. Complete care notes are accessible post-visit.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E7DFCE]/70 text-xs text-[#77736A]">
                Prototype clinical summary & actionable lifestyle plan demo.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE CARENOVA */}
      <section className="py-16 md:py-24 bg-[#FBF8EF] border-b border-[#E7DFCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left space-y-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B]">
                The CareNova Difference
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202020] tracking-tight leading-[1.2]">
                Designed for Human Dignity and Clinical Excellence
              </h2>
              <p className="text-base text-[#77736A] leading-relaxed font-normal">
                Traditional healthcare websites are notoriously dense, stressful, and difficult to navigate when you feel unwell. CareNova bridges modern design technology with empathetic clinical principles.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F4E9C9] text-[#8E6D2B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202020]">Credentialing UI Showcase</h4>
                    <p className="text-xs text-[#77736A] mt-0.5">Specialist profiles demonstrate comprehensive medical qualifications and verified portfolio metadata.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F4E9C9] text-[#8E6D2B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202020]">Zero Wait-Time Architecture</h4>
                    <p className="text-xs text-[#77736A] mt-0.5">Digital pre-registration eliminates repetitive clipboard paperwork upon arrival.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F4E9C9] text-[#8E6D2B] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202020]">Patient Data Autonomy</h4>
                    <p className="text-xs text-[#77736A] mt-0.5">Privacy-by-design architecture ensures your consultation records remain strictly confidential.</p>
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
            <div className="lg:col-span-6 bg-[#202020] text-[#FFFDF8] rounded-2xl p-8 sm:p-10 shadow-xl border border-[#3A3833] text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D6B36A]">
                CareNova Core Metric
              </span>
              <div className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-[#FFFDF8]">
                15 min
              </div>
              <p className="text-sm text-[#D9DDE2] mt-2 font-medium">
                Average turnaround time for appointment confirmation requests.
              </p>

              <div className="mt-8 pt-6 border-t border-[#3A3833] grid grid-cols-2 gap-4 text-xs text-[#AEB4BB]">
                <div>
                  <div className="font-semibold text-[#FFFDF8]">99.4%</div>
                  <div className="text-[#AEB4BB] mt-0.5">On-time consultation starts</div>
                </div>
                <div>
                  <div className="font-semibold text-[#FFFDF8]">100%</div>
                  <div className="text-[#AEB4BB] mt-0.5">Digital health intake completion</div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#2A2926] rounded-xl border border-[#3A3833] text-xs text-[#D9DDE2]">
                "We built CareNova to demonstrate what happens when patient empathy drives every interaction."
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PATIENT EXPERIENCE (TESTIMONIALS) */}
      <section className="py-16 md:py-24 bg-[#FFFDF8] border-b border-[#E7DFCE]">
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
                className="bg-[#FBF8EF] rounded-2xl p-6 sm:p-8 border border-[#E7DFCE] shadow-2xs hover:border-[#D6B36A]/50 transition-colors flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D6B36A] mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D6B36A] text-[#D6B36A]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#3A3833] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7DFCE]">
                  <div className="font-bold text-[#202020] text-sm">
                    {t.patientName}
                  </div>
                  <div className="text-xs text-[#77736A] mt-0.5">
                    {t.role} · Consulted in {t.specialtyConsulted}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="py-16 md:py-24 bg-[#FBF8EF] border-b border-[#E7DFCE]">
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
                  className="border border-[#E7DFCE] rounded-xl overflow-hidden transition-colors bg-[#FFFDF8]"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-[#202020] hover:text-[#D6B36A] transition-colors bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#AEB4BB] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D6B36A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-[#77736A] leading-relaxed border-t border-[#E7DFCE] bg-[#FBF8EF]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="secondary"
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
      <section className="py-16 md:py-20 bg-[#202020] text-[#FFFDF8] relative overflow-hidden border-t border-[#3A3833]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#FFFDF8] tracking-tight leading-[1.2]"
            style={{ textWrap: 'balance' }}
          >
            Ready to experience thoughtful, modern healthcare?
          </h2>
          <p className="text-[#D9DDE2] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Schedule a consultation with our verified clinical specialists today or explore our comprehensive clinical directories.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="primary"
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

          <p className="text-2xs text-[#AEB4BB] pt-4">
            CareNova is an interactive digital portfolio project. No real patient data is collected or billed.
          </p>
        </div>

        {/* Subtle background glow */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D6B36A]/15 via-transparent to-transparent pointer-events-none"
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

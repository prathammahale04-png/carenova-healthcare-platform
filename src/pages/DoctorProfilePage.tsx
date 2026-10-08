import React, { useState } from 'react';
import { PageRoute, Doctor } from '../types';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  CalendarCheck2,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Award,
  Globe,
  Video,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';

interface DoctorProfilePageProps {
  doctor: Doctor;
  onNavigate: (page: PageRoute) => void;
  onBookAppointment: (doctor: Doctor, prefill?: { date?: string; timeSlot?: string; consultationType?: 'in-clinic' | 'telehealth' }) => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  doctor,
  onNavigate,
  onBookAppointment
}) => {
  const [imageError, setImageError] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'in-clinic' | 'telehealth'>(
    doctor.telehealthAvailable ? 'telehealth' : 'in-clinic'
  );
  
  // Dynamic upcoming dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000);
  const dayAfterDate = new Date(Date.now() + 86400000 * 2);

  const [selectedDate, setSelectedDate] = useState<string>(tomorrowDate.toISOString().split('T')[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');

  const availableSlots = [
    '09:00 AM',
    '10:30 AM',
    '01:45 PM',
    '03:30 PM',
    '04:45 PM'
  ];

  const handleContinueBooking = () => {
    onBookAppointment(doctor, {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultationType: selectedFormat
    });
  };

  return (
    <div className="py-8 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Back button breadcrumb */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('doctors')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E6D2B] hover:text-[#202020] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left / Main Profile Information */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Card */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              
              {/* Doctor Headshot */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-[#FBF8EF] shrink-0 border border-[#E7DFCE] shadow-xs relative">
                {!imageError ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F4E9C9] text-[#5E4A1E] font-bold text-2xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-[#2E7D52] text-white p-1 rounded-md shadow-xs" title="Verified Specialist">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title & Core Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs text-[#77736A] mb-1">
                  <span className="font-bold text-[#8E6D2B]">{doctor.specialty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doctor.experienceYears} Years Clinical Experience</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#202020] tracking-tight leading-tight">
                  {doctor.name}
                </h1>

                <p className="text-sm text-[#77736A] mt-1 font-normal">
                  {doctor.title}
                </p>

                {/* Rating & Consultations */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#77736A]">
                  <div className="flex items-center gap-1 text-[#D6B36A] font-semibold tabular-nums">
                    <Star className="w-4 h-4 fill-[#D6B36A] text-[#D6B36A]" />
                    <span>{doctor.rating}</span>
                    <span className="text-[#AEB4BB] font-normal">({doctor.reviewCount} verified reviews)</span>
                  </div>
                  <span className="text-[#E7DFCE]">|</span>
                  <div className="flex items-center gap-1 text-[#3A3833]">
                    <Globe className="w-3.5 h-3.5 text-[#AEB4BB]" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Location indicator */}
                <div className="mt-4 pt-3 border-t border-[#E7DFCE]/70 flex items-center gap-2 text-xs text-[#77736A]">
                  <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                  <span>{doctor.location}</span>
                </div>
              </div>

            </div>
          </div>

          {/* About / Bio */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-[#202020]">
              About {doctor.name}
            </h2>
            <p className="text-sm text-[#3A3833] leading-relaxed">
              {doctor.bio}
            </p>
          </div>

          {/* Areas of Clinical Expertise */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg font-bold text-[#202020]">
              Areas of Clinical Focus & Procedures
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctor.areasOfExpertise.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-[#3A3833] bg-[#FBF8EF] p-3 rounded-xl border border-[#E7DFCE]">
                  <CheckCircle2 className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Board Certifications */}
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#202020] flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-[#D6B36A]" />
                <span>Education & Medical Training</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#77736A] pl-2">
                {doctor.education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6B36A] mt-2 shrink-0" />
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#E7DFCE]">
              <h2 className="text-lg font-bold text-[#202020] flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[#D6B36A]" />
                <span>Board Certifications & Affiliations</span>
              </h2>
              <ul className="space-y-2 text-sm text-[#77736A] pl-2">
                {doctor.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AEB4BB] mt-2 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right / Booking & Schedule Card (Sticky on desktop) */}
        <div className="lg:col-span-4">
          <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 shadow-sm sticky top-24 space-y-5">
            
            <div className="border-b border-[#E7DFCE] pb-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B] mb-1">
                Direct Scheduling
              </div>
              <h3 className="text-xl font-bold text-[#202020] tracking-tight leading-snug">
                Select Date & Time
              </h3>
              <p className="text-xs text-[#77736A] mt-0.5">
                Standard visit fee: <strong className="text-[#202020]">${doctor.consultationFee}</strong>
              </p>
            </div>

            {/* Consultation Format */}
            <div>
              <label className="block text-xs font-semibold text-[#3A3833] mb-2">
                Consultation Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('in-clinic')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'in-clinic'
                      ? 'border-[#D6B36A] bg-[#F4E9C9]/50 text-[#202020] ring-1 ring-[#D6B36A]'
                      : 'border-[#E7DFCE] bg-[#FFFDF8] text-[#3A3833] hover:bg-[#FBF8EF]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#D6B36A]" />
                    <span>In-Clinic</span>
                  </div>
                  <div className="text-2xs text-[#77736A] mt-0.5">At Medical Hub</div>
                </button>

                <button
                  type="button"
                  disabled={!doctor.telehealthAvailable}
                  onClick={() => setSelectedFormat('telehealth')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedFormat === 'telehealth'
                      ? 'border-[#D6B36A] bg-[#F4E9C9]/50 text-[#202020] ring-1 ring-[#D6B36A]'
                      : 'border-[#E7DFCE] bg-[#FFFDF8] text-[#3A3833] hover:bg-[#FBF8EF]'
                  } ${!doctor.telehealthAvailable ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Video className="w-3.5 h-3.5 text-[#D6B36A]" />
                    <span>Telehealth</span>
                  </div>
                  <div className="text-2xs text-[#77736A] mt-0.5">HD Video Call</div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#3A3833]">
                  Select Date
                </label>
                <span className="text-2xs text-[#8E6D2B] font-medium">Interactive Schedule Demo</span>
              </div>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-xl border border-[#E7DFCE] text-xs text-[#202020] bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] font-medium cursor-pointer"
              />
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#3A3833] mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`min-h-[38px] py-2 px-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#D6B36A] text-[#F1F3F5] border-[#C59E52]/60 shadow-2xs'
                          : 'bg-[#FFFDF8] text-[#3A3833] border-[#E7DFCE] hover:bg-[#FBF8EF]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Action CTA */}
            <div className="pt-2 space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<CalendarCheck2 className="w-4 h-4" />}
                onClick={handleContinueBooking}
                className="w-full justify-center shadow-xs"
              >
                Book Appointment ({selectedTimeSlot})
              </Button>

              <div className="flex items-center justify-between text-2xs text-[#AEB4BB] pt-1">
                <span>Free cancellation demo</span>
                <span>·</span>
                <span>Simulated booking flow</span>
              </div>
            </div>

            {/* Doctor Location details */}
            <div className="pt-3 border-t border-[#E7DFCE] space-y-1.5 text-2xs text-[#77736A]">
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                <span>{doctor.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#AEB4BB] shrink-0" />
                <span>Next slot: {doctor.nextAvailable}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

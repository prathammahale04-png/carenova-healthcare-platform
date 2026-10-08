import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, Doctor } from '../types';
import { getDoctors } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DoctorCard } from '../components/cards/DoctorCard';
import { Button } from '../components/ui/Button';
import {
  Search,
  Video,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
  Database,
  CheckCircle2
} from 'lucide-react';

interface DoctorsPageProps {
  onNavigate: (page: PageRoute) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  onNavigate,
  onSelectDoctor,
  onBookWithDoctor
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [telehealthOnly, setTelehealthOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'experience' | 'rating' | 'name'>('experience');

  const loadDoctors = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getDoctors();
      setDoctors(response.data);
      setIsFromSupabase(response.isFromSupabase);
      if (response.error && response.isFromSupabase === false && isSupabaseConfigured()) {
        setFetchError(response.error);
      }
    } catch {
      setFetchError('Unable to connect to specialist directory. Showing demo data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Compute available specialty tabs dynamically from loaded doctors
  const specialties = useMemo(() => {
    const specs = Array.from(new Set(doctors.map(d => d.specialty))).filter(Boolean);
    return [
      { id: 'all', label: `All (${doctors.length})` },
      ...specs.map(spec => ({
        id: spec,
        label: `${spec} (${doctors.filter(d => d.specialty === spec).length})`
      }))
    ];
  }, [doctors]);

  const hasActiveFilters = searchQuery !== '' || selectedSpecialty !== 'all' || telehealthOnly;

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.areasOfExpertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.languages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSpecialty =
        selectedSpecialty === 'all' || doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      const matchesTelehealth = !telehealthOnly || doc.telehealthAvailable;

      return matchesSearch && matchesSpecialty && matchesTelehealth;
    }).sort((a, b) => {
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });
  }, [doctors, searchQuery, selectedSpecialty, telehealthOnly, sortBy]);

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <SectionHeader
        kicker="Specialist Directory"
        title="Find Your Trusted Healthcare Specialist"
        subtitle="Search clinical specialist profiles, explore years of experience, and test the interactive booking prototype."
      />

      {/* Supabase Connection Status Pill */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FFFDF8] p-3.5 rounded-xl border border-[#E7DFCE] shadow-2xs">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isFromSupabase ? 'text-[#2E7D52]' : 'text-[#D6B36A]'}`} />
          <span className="text-[#77736A]">
            Data Source:{' '}
            <strong className="font-semibold text-[#202020]">
              {isFromSupabase ? 'Supabase (public.doctors)' : 'CareNova Local Demo Cache'}
            </strong>
          </span>
          {isFromSupabase && (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#2E7D52] border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-[#2E7D52]" />
              Live Connected
            </span>
          )}
        </div>

        <button
          onClick={loadDoctors}
          disabled={isLoading}
          className="text-xs font-semibold text-[#8E6D2B] hover:text-[#202020] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Non-Technical Error Banner if any */}
      {fetchError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{fetchError}</p>
            <p className="text-[#77736A] text-2xs">
              To load live records, verify your Supabase project contains rows in the <code className="bg-amber-100 px-1 rounded">public.doctors</code> table and run the seed script if empty.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDoctors}
            className="shrink-0 text-xs py-1"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-5 sm:p-6 shadow-2xs mb-8 space-y-4">
        
        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEB4BB]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, condition, or language..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#E7DFCE] bg-[#FFFDF8] text-sm text-[#202020] placeholder:text-[#AEB4BB] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#D6B36A] shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#3A3833] cursor-pointer select-none min-h-[44px] px-2 rounded-lg hover:bg-[#FBF8EF]">
              <input
                type="checkbox"
                checked={telehealthOnly}
                onChange={(e) => setTelehealthOnly(e.target.checked)}
                className="rounded text-[#D6B36A] focus:ring-[#D6B36A] border-[#E7DFCE] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span>Telehealth Only</span>
              </span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-[#77736A] border-l border-[#E7DFCE] pl-3">
              <span className="text-[#AEB4BB]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-[#202020] focus:outline-none cursor-pointer py-1"
              >
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="pt-2 border-t border-[#E7DFCE]/70 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {specialties.map((s) => {
            const isActive = selectedSpecialty === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSpecialty(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#D6B36A] text-[#F1F3F5] font-semibold shadow-xs border border-[#C59E52]/60'
                    : 'bg-[#FBF8EF] text-[#3A3833] border border-[#E7DFCE] hover:bg-[#F4E9C9]/60 hover:text-[#202020]'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Directory Count & Credential Badge */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#77736A]">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-[#202020] tabular-nums">{filteredDoctors.length}</strong> specialists
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setTelehealthOnly(false);
              }}
              className="text-xs text-[#8E6D2B] hover:text-[#202020] font-semibold underline underline-offset-2 ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[#8E6D2B] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D6B36A]" />
          <span>Credentialing UI Demo</span>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-[#FFFDF8] rounded-xl border border-[#E7DFCE] p-6 space-y-4 animate-pulse shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#F4E9C9] shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-[#F4E9C9] rounded w-2/3" />
                  <div className="h-3 bg-[#F4E9C9]/60 rounded w-1/2" />
                  <div className="h-3 bg-[#F4E9C9]/40 rounded w-1/3" />
                </div>
              </div>
              <div className="h-8 bg-[#F4E9C9]/50 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : filteredDoctors.length > 0 ? (
        /* DOCTOR CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewProfile={(doc) => onSelectDoctor(doc)}
              onBookAppointment={(doc) => onBookWithDoctor(doc)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4E9C9] border border-[#E7D19A] flex items-center justify-center text-[#8E6D2B] mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-bold text-[#202020]">No physicians match your search</p>
            <p className="text-xs text-[#77736A] mt-1">
              We couldn't find any specialist matching <span className="font-semibold text-[#202020]">"{searchQuery || selectedSpecialty}"</span>.
            </p>
          </div>

          <div className="pt-2 text-xs text-[#77736A]">
            <span className="block mb-2 font-medium text-[#3A3833]">Popular specialties & doctors:</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {['Cardiology', 'General Medicine', 'Dermatology'].map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    setSelectedSpecialty(sug);
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FBF8EF] hover:bg-[#F4E9C9] hover:text-[#202020] text-[#3A3833] border border-[#E7DFCE] font-medium transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setTelehealthOnly(false);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Clinic Ethics Notice */}
      <div className="mt-16 p-6 rounded-2xl bg-[#FFFDF8] border border-[#E7DFCE] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77736A]">
        <div>
          <strong className="text-[#202020]">CareNova Prototype Note:</strong> All clinical profiles and qualifications are simulated for this digital product demonstration.
        </div>
        <button
          onClick={() => onNavigate('about')}
          className="text-[#8E6D2B] hover:text-[#202020] font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
        >
          Learn more about our standards
        </button>
      </div>

    </div>
  );
};

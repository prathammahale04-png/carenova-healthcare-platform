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
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isFromSupabase ? 'text-emerald-600' : 'text-teal-700'}`} />
          <span className="text-slate-700">
            Data Source:{' '}
            <strong className="font-semibold text-slate-900">
              {isFromSupabase ? 'Supabase (public.doctors)' : 'CareNova Local Demo Cache'}
            </strong>
          </span>
          {isFromSupabase && (
            <span className="inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Live Connected
            </span>
          )}
        </div>

        <button
          onClick={loadDoctors}
          disabled={isLoading}
          className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
            <p className="text-slate-600 text-2xs">
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
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-8 space-y-4">
        
        {/* Top Controls: Search & Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by physician name, specialty, condition, or language..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer select-none min-h-[44px] px-2 rounded-lg hover:bg-slate-50">
              <input
                type="checkbox"
                checked={telehealthOnly}
                onChange={(e) => setTelehealthOnly(e.target.checked)}
                className="rounded text-teal-700 focus:ring-teal-600 border-slate-300 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-teal-700" />
                <span>Telehealth Only</span>
              </span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-slate-700 border-l border-slate-200 pl-3">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer py-1"
              >
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {specialties.map((s) => {
            const isActive = selectedSpecialty === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSpecialty(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Directory Count & Credential Badge */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-bold text-slate-900 tabular-nums">{filteredDoctors.length}</strong> specialists
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setTelehealthOnly(false);
              }}
              className="text-xs text-teal-800 hover:text-teal-950 font-semibold underline underline-offset-2 ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Credentialing UI Demo</span>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-6 space-y-4 animate-pulse shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-150 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
              <div className="h-8 bg-slate-100 rounded-lg w-full" />
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
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">No physicians match your search</p>
            <p className="text-xs text-slate-600 mt-1">
              We couldn't find any specialist matching <span className="font-semibold text-slate-800">"{searchQuery || selectedSpecialty}"</span>.
            </p>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            <span className="block mb-2 font-medium text-slate-700">Popular specialties & doctors:</span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {['Cardiology', 'General Medicine', 'Dermatology'].map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    setSelectedSpecialty(sug);
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
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
      <div className="mt-16 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          <strong className="text-slate-800">CareNova Prototype Note:</strong> All clinical profiles and qualifications are simulated for this digital product demonstration.
        </div>
        <button
          onClick={() => onNavigate('about')}
          className="text-teal-700 hover:text-teal-800 font-semibold underline underline-offset-2 shrink-0 cursor-pointer"
        >
          Learn more about our standards
        </button>
      </div>

    </div>
  );
};

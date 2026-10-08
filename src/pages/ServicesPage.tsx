import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, HealthcareService } from '../types';
import { getServices } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ServiceDetailModal } from '../components/cards/ServiceDetailModal';
import { Button } from '../components/ui/Button';
import {
  Search,
  CalendarCheck2,
  ShieldCheck,
  Database,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: PageRoute) => void;
  onBookWithService: (service: HealthcareService) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onBookWithService
}) => {
  const [services, setServices] = useState<HealthcareService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFromSupabase, setIsFromSupabase] = useState<boolean>(false);

  const [selectedService, setSelectedService] = useState<HealthcareService | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const loadServices = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await getServices();
      setServices(response.data);
      setIsFromSupabase(response.isFromSupabase);
      if (response.error && response.isFromSupabase === false && isSupabaseConfigured()) {
        setFetchError(response.error);
      }
    } catch {
      setFetchError('Unable to connect to clinical services directory. Showing demo data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Compute dynamic category list based on loaded services
  const categories = useMemo(() => {
    const rawCategories = Array.from(new Set(services.map(s => s.category))).filter(Boolean);
    return [
      { id: 'all', label: `All Services (${services.length})` },
      ...rawCategories.map(cat => ({
        id: cat,
        label: `${cat} (${services.filter(s => s.category === cat).length})`
      }))
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesSearch =
        srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        srv.commonConditions.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        activeCategory === 'all' ||
        srv.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [services, searchQuery, activeCategory]);

  return (
    <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      
      {/* Header */}
      <SectionHeader
        kicker="CareNova Specialties"
        title="Clinical Services Directory"
        subtitle="Explore our integrated medical specialties designed to provide comprehensive, preventative, and restorative care across every stage of life."
      />

      {/* Supabase Connection Status Pill */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#FFFDF8] p-3.5 rounded-xl border border-[#E7DFCE] shadow-2xs">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isFromSupabase ? 'text-[#2E7D52]' : 'text-[#D6B36A]'}`} />
          <span className="text-[#77736A]">
            Data Source:{' '}
            <strong className="font-semibold text-[#202020]">
              {isFromSupabase ? 'Supabase (public.services)' : 'CareNova Local Demo Cache'}
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
          onClick={loadServices}
          disabled={isLoading}
          className="text-xs font-semibold text-[#8E6D2B] hover:text-[#202020] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Services</span>
        </button>
      </div>

      {/* Non-Technical Error Banner if any */}
      {fetchError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{fetchError}</p>
            <p className="text-[#77736A] text-2xs">
              To load live records, verify your Supabase project contains rows in the <code className="bg-amber-100 px-1 rounded">public.services</code> table and run the seed script if empty.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadServices}
            className="shrink-0 text-xs py-1"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Search & Category Filter Controls */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEB4BB]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by condition, treatment, or specialty..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-[#E7DFCE] bg-[#FFFDF8] text-sm text-[#202020] placeholder:text-[#AEB4BB] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#D6B36A] shadow-2xs"
            />
          </div>

          {/* Result Count */}
          <div className="text-xs text-[#77736A] tabular-nums">
            Showing <strong className="text-[#202020] font-bold">{filteredServices.length}</strong> of {services.length} clinical services
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#D6B36A] text-[#F1F3F5] font-semibold shadow-xs border border-[#C59E52]/60'
                    : 'bg-[#FFFDF8] text-[#3A3833] border border-[#E7DFCE] hover:bg-[#FBF8EF] hover:text-[#202020]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-200" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-150 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="h-3 bg-slate-150 rounded w-16" />
                <div className="h-7 bg-slate-200 rounded-lg w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        /* GRID OF SERVICES */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onLearnMore={(srv) => setSelectedService(srv)}
              onBookService={(srv) => onBookWithService(srv)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-12 text-center max-w-md mx-auto shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F4E9C9] border border-[#E7D19A] flex items-center justify-center text-[#8E6D2B] mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base font-bold text-[#202020]">No clinical services found</p>
            <p className="text-xs text-[#77736A] mt-1">
              Try searching for broader symptoms like "heart", "skin", or "primary care".
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Reassurance Banner */}
      <div className="mt-16 bg-[#FBF8EF] border border-[#E7DFCE] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8E6D2B]">
            <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />
            <span>Need Guidance on Where to Start?</span>
          </div>
          <h3 className="text-lg font-bold text-[#202020]">
            Schedule an Initial Evaluation with General Medicine
          </h3>
          <p className="text-xs sm:text-sm text-[#77736A] max-w-xl">
            Our primary care physicians conduct comprehensive baseline health evaluations and provide warm referrals to sub-specialists when needed.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          leftIcon={<CalendarCheck2 className="w-4 h-4" />}
          onClick={() => onNavigate('appointment')}
          className="shrink-0"
        >
          Book Primary Consultation
        </Button>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        onBookService={(srv) => {
          setSelectedService(null);
          onBookWithService(srv);
        }}
      />

    </div>
  );
};

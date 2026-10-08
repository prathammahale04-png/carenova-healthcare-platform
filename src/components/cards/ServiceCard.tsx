import React from 'react';
import { HealthcareService } from '../../types';
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Baby,
  Activity,
  Brain,
  Salad,
  ShieldCheck,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ServiceCardProps {
  service: HealthcareService;
  onLearnMore: (service: HealthcareService) => void;
  onBookService: (service: HealthcareService) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope className="w-5 h-5 text-[#D6B36A]" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-[#C24141]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#D6B36A]" />,
  Baby: <Baby className="w-5 h-5 text-[#8E6D2B]" />,
  Activity: <Activity className="w-5 h-5 text-[#3A3833]" />,
  Brain: <Brain className="w-5 h-5 text-[#8E6D2B]" />,
  Salad: <Salad className="w-5 h-5 text-[#2E7D52]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#D6B36A]" />
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onLearnMore,
  onBookService
}) => {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] hover:border-[#D6B36A]/60 shadow-2xs hover:shadow-md hover:shadow-[#D6B36A]/10 transition-all duration-200 p-6 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#FBF8EF] border border-[#E7DFCE] flex items-center justify-center group-hover:scale-105 transition-transform">
            {iconMap[service.iconName] || <Stethoscope className="w-5 h-5 text-[#D6B36A]" />}
          </div>
          <span className="text-xs text-[#8E6D2B] font-semibold bg-[#F4E9C9]/50 px-2.5 py-1 rounded-md border border-[#E7DFCE]">
            {service.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#202020] group-hover:text-[#D6B36A] transition-colors leading-snug">
          {service.name}
        </h3>

        <p className="mt-2 text-sm text-[#77736A] leading-relaxed font-normal line-clamp-3">
          {service.shortDescription}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-[#77736A]">
          <Clock className="w-3.5 h-3.5 text-[#AEB4BB]" />
          <span>Consultation: <strong className="font-semibold text-[#3A3833]">{service.averageDuration}</strong></span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E7DFCE]/70 flex items-center justify-between gap-3">
        <button
          onClick={() => onLearnMore(service)}
          className="text-xs font-semibold text-[#8E6D2B] hover:text-[#202020] transition-colors flex items-center gap-1 py-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D6B36A] rounded"
        >
          <span>Explore Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onBookService(service)}
          className="text-xs"
        >
          Book Care
        </Button>
      </div>
    </div>
  );
};

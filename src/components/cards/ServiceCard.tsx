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
  Stethoscope: <Stethoscope className="w-5 h-5 text-teal-600" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-500" />,
  Baby: <Baby className="w-5 h-5 text-sky-500" />,
  Activity: <Activity className="w-5 h-5 text-indigo-500" />,
  Brain: <Brain className="w-5 h-5 text-purple-500" />,
  Salad: <Salad className="w-5 h-5 text-emerald-500" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-teal-600" />
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onLearnMore,
  onBookService
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 p-6 flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
            {iconMap[service.iconName] || <Stethoscope className="w-5 h-5 text-teal-700" />}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {service.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors leading-snug">
          {service.name}
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal line-clamp-3">
          {service.shortDescription}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Consultation: <strong className="font-semibold text-slate-800">{service.averageDuration}</strong></span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onLearnMore(service)}
          className="text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors flex items-center gap-1 py-1 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-teal-700 rounded"
        >
          <span>Explore Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <Button
          variant="outline"
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

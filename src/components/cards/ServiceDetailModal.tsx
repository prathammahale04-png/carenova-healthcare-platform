import React from 'react';
import { HealthcareService } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle2, Clock, CalendarCheck2, Stethoscope, ArrowRight } from 'lucide-react';

interface ServiceDetailModalProps {
  service: HealthcareService | null;
  isOpen: boolean;
  onClose: () => void;
  onBookService: (service: HealthcareService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service.name}
      description={`Category: ${service.category}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        
        {/* Overview */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Clinical Overview
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed">
            {service.fullDescription}
          </p>
        </div>

        {/* Common Conditions */}
        <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Common Conditions Evaluated</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {service.commonConditions.map((condition, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            What to Expect During Your Visit
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-white border border-slate-200/80 rounded-xl p-4">
            {service.whatToExpect}
          </p>
        </div>

        {/* Quick Details Bar */}
        <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Duration: <strong className="text-slate-900">{service.averageDuration}</strong></span>
          </div>
          <span className="text-slate-400">·</span>
          <span>Lead Department: <strong className="text-teal-700">{service.leadSpecialistSpecialty}</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onBookService(service);
            }}
          >
            Request Appointment for {service.name}
          </Button>
        </div>

      </div>
    </Modal>
  );
};

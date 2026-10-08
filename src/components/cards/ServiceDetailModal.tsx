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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B] mb-2">
            Clinical Overview
          </h4>
          <p className="text-sm text-[#3A3833] leading-relaxed">
            {service.fullDescription}
          </p>
        </div>

        {/* Common Conditions */}
        <div className="bg-[#FBF8EF] rounded-xl p-4.5 border border-[#E7DFCE]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202020] mb-3 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>Common Conditions Evaluated</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#3A3833]">
            {service.commonConditions.map((condition, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B36A] shrink-0" />
                <span>{condition}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B] mb-2">
            What to Expect During Your Visit
          </h4>
          <p className="text-sm text-[#3A3833] leading-relaxed bg-[#FFFDF8] border border-[#E7DFCE] rounded-xl p-4">
            {service.whatToExpect}
          </p>
        </div>

        {/* Quick Details Bar */}
        <div className="flex items-center justify-between text-xs text-[#77736A] pt-2 border-t border-[#E7DFCE]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#AEB4BB]" />
            <span>Duration: <strong className="text-[#202020]">{service.averageDuration}</strong></span>
          </div>
          <span className="text-[#E7DFCE]">·</span>
          <span>Lead Department: <strong className="text-[#8E6D2B]">{service.leadSpecialistSpecialty}</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E7DFCE]">
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

import React from 'react';
import { AppointmentStatus } from '../../types';
import { Clock, CheckCircle2, CheckCheck, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus | 'unread' | 'read' | 'replied';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-[#FBF8EF] text-[#8E6D2B] border border-[#E7DFCE] ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-[#D6B36A] animate-pulse" />
          <span>Pending Review</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-[#F4E9C9] text-[#8E6D2B] border border-[#E7D19A] ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-[#D6B36A]" />
          <span>Confirmed</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-[#2E7D52]/10 text-[#2E7D52] border border-[#2E7D52]/30 ${sizeClasses} ${className}`}
        >
          <CheckCheck className="w-3 h-3 text-[#2E7D52]" />
          <span>Completed</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3 h-3 text-rose-500" />
          <span>Cancelled</span>
        </span>
      );
    case 'unread':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-[#F4E9C9]/60 text-[#8E6D2B] border border-[#E7D19A] ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B36A] animate-ping" />
          <span>Unread</span>
        </span>
      );
    case 'read':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#FBF8EF] text-[#77736A] border border-[#E7DFCE] ${sizeClasses} ${className}`}
        >
          <span>Reviewed</span>
        </span>
      );
    case 'replied':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-[#F4E9C9] text-[#8E6D2B] border border-[#E7D19A] ${sizeClasses} ${className}`}
        >
          <CheckCheck className="w-3 h-3 text-[#D6B36A]" />
          <span>Replied</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-[#FBF8EF] text-[#77736A] border border-[#E7DFCE] ${sizeClasses} ${className}`}>
          {status}
        </span>
      );
  }
};

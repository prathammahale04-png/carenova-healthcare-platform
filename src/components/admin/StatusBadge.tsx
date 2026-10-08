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
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses} ${className}`}
        >
          <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
          <span>Pending Review</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-teal-600" />
          <span>Confirmed</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses} ${className}`}
        >
          <CheckCheck className="w-3 h-3 text-emerald-600" />
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
          className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Unread</span>
        </span>
      );
    case 'read':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}
        >
          <span>Reviewed</span>
        </span>
      );
    case 'replied':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses} ${className}`}
        >
          <CheckCheck className="w-3 h-3 text-teal-600" />
          <span>Replied</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 ${sizeClasses} ${className}`}>
          {status}
        </span>
      );
  }
};

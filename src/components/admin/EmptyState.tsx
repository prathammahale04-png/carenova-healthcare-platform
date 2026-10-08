import React, { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-8 sm:p-12 text-center max-w-md mx-auto shadow-2xs space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-[#F4E9C9] border border-[#E7D19A] flex items-center justify-center text-[#8E6D2B] mx-auto">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-[#202020]">{title}</h3>
        <p className="text-xs text-[#77736A] mt-1.5 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

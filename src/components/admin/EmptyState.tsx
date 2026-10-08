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
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-md mx-auto shadow-2xs space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 mx-auto">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

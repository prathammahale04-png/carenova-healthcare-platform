import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading clinical data...',
  rows = 4
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2.5 p-6 text-xs text-[#77736A]">
        <Loader2 className="w-4 h-4 text-[#D6B36A] animate-spin" />
        <span className="font-medium">{label}</span>
      </div>

      <div className="bg-[#FFFDF8] rounded-2xl border border-[#E7DFCE] p-6 space-y-3 shadow-2xs">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center justify-between gap-4 py-2 border-b border-[#E7DFCE]/60 last:border-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-[#F4E9C9] shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 bg-[#F4E9C9] rounded w-1/3" />
                <div className="h-2.5 bg-[#F4E9C9]/60 rounded w-1/2" />
              </div>
            </div>
            <div className="h-6 bg-[#F4E9C9]/50 rounded-full w-20 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

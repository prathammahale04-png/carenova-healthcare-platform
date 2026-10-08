import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#202020] text-[#D9DDE2] border-b border-[#3A3833] text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#D6B36A] shrink-0" />
          <span className="font-normal text-[#D9DDE2]">
            <strong className="font-semibold text-[#FFFDF8]">Portfolio Demo:</strong> CareNova is a fictional digital healthcare design concept. All doctors, metrics, and services are simulated prototypes.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#AEB4BB] hover:text-[#FFFDF8] p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#D6B36A]"
          aria-label="Dismiss demo banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

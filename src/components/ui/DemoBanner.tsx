import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-normal text-slate-300">
            <strong className="font-semibold text-white">Portfolio Demo:</strong> CareNova is a fictional digital healthcare design concept. All doctors, metrics, and services are simulated prototypes.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-teal-400"
          aria-label="Dismiss demo banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

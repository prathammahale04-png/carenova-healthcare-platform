import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconBgColor?: string;
  trendText?: string;
  trendType?: 'positive' | 'neutral' | 'attention';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-teal-50 text-teal-700',
  trendText,
  trendType = 'neutral',
  onClick
}) => {
  const getTrendClasses = () => {
    switch (trendType) {
      case 'positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'attention':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-teal-300' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {trendText && (
          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${getTrendClasses()}`}>
            {trendText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

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
  iconBgColor = 'bg-[#F4E9C9] text-[#8E6D2B]',
  trendText,
  trendType = 'neutral',
  onClick
}) => {
  const getTrendClasses = () => {
    switch (trendType) {
      case 'positive':
        return 'text-[#2E7D52] bg-[#2E7D52]/10 border-[#2E7D52]/30';
      case 'attention':
        return 'text-[#8E6D2B] bg-[#F4E9C9] border-[#E7D19A]';
      default:
        return 'text-[#77736A] bg-[#FBF8EF] border-[#E7DFCE]';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-[#FFFDF8] rounded-2xl p-5 border border-[#E7DFCE] shadow-xs hover:shadow-md hover:border-[#D6B36A]/60 transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#77736A] uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-[#202020] tracking-tight">
          {value}
        </span>
        {trendText && (
          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full border ${getTrendClasses()}`}>
            {trendText}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-[#77736A] line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};

import React from 'react';

export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  subtitle,
  align = 'center',
  className = ''
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`max-w-3xl mb-10 sm:mb-14 ${
        isCenter ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-wider text-[#8E6D2B] mb-2">
          {kicker}
        </p>
      )}
      <h2
        className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202020] leading-[1.22]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm sm:text-base text-[#77736A] leading-relaxed font-normal max-w-2xl ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

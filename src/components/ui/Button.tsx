import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'outline-white' | 'golden';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap shrink-0 select-none cursor-pointer';

  const variants = {
    primary: 'bg-teal-700 text-white hover:bg-teal-800 shadow-xs border border-teal-800/20 active:bg-teal-900',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs border border-slate-900 active:bg-slate-950',
    outline: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 shadow-xs active:bg-slate-100',
    ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200',
    white: 'bg-white text-teal-950 hover:bg-slate-100 hover:text-teal-900 border border-white shadow-md active:bg-slate-200',
    'outline-white': 'bg-transparent text-white border border-white/80 hover:bg-white/10 hover:text-white hover:border-white shadow-xs active:bg-white/20',
    golden: 'bg-amber-100 text-slate-700 border border-amber-300 hover:bg-amber-200 hover:text-slate-900 shadow-xs active:bg-amber-300'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 min-h-[36px] gap-1.5',
    md: 'text-sm px-4.5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-base px-6 py-3 min-h-[48px] gap-2.5'
  };

  const roleClass = variant === 'primary' ? 'button-primary' : variant === 'secondary' ? 'button-secondary' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${roleClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};


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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B36A] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap shrink-0 select-none cursor-pointer';

  const variants = {
    primary: 'button-primary bg-[#D6B36A] text-[#F1F3F5] hover:bg-[#C59E52] hover:text-white border border-[#C59E52]/60 shadow-sm active:bg-[#B68D3F]',
    secondary: 'button-secondary bg-transparent text-[#8E6D2B] border border-[#D6B36A] hover:bg-[#FBF8EF] hover:text-[#202020] hover:border-[#C59E52] shadow-2xs active:bg-[#F4E9C9]',
    outline: 'bg-[#FFFDF8] text-[#3A3833] border border-[#E7DFCE] hover:bg-[#FBF8EF] hover:text-[#202020] hover:border-[#D6B36A] shadow-2xs active:bg-[#F4E9C9]',
    ghost: 'text-[#3A3833] hover:bg-[#FBF8EF] hover:text-[#202020] active:bg-[#F4E9C9]/60',
    white: 'bg-[#FFFDF8] text-[#202020] hover:bg-white hover:text-[#202020] border border-[#E7DFCE] shadow-sm active:bg-[#FBF8EF]',
    'outline-white': 'bg-transparent text-[#F1F3F5] border border-[#E7DFCE]/70 hover:bg-white/10 hover:text-white hover:border-[#F1F3F5] shadow-xs active:bg-white/20',
    golden: 'bg-[#F4E9C9] text-[#5E4A1E] border border-[#E7D19A] hover:bg-[#E7D19A] hover:text-[#202020] shadow-xs active:bg-[#D6B36A]'
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


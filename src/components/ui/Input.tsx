import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#3A3833] tracking-wide"
        >
          {label} {props.required && <span className="text-[#C24141]" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-2xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#77736A]">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[44px] rounded-xl border bg-[#FFFDF8] text-[#202020] text-sm px-3.5 py-2.5 transition-all placeholder:text-[#AEB4BB] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#D6B36A] disabled:bg-[#FBF8EF] disabled:text-[#AEB4BB] ${
            leftIcon ? 'pl-10' : ''
          } ${
            error
              ? 'border-[#C24141] focus:ring-[#C24141] focus:border-[#C24141] bg-rose-50/20'
              : 'border-[#E7DFCE] hover:border-[#D6B36A]/60'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-[#C24141] mt-1 font-medium flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-[#77736A] mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};


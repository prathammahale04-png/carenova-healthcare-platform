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
          className="block text-xs font-semibold text-slate-800 tracking-wide"
        >
          {label} {props.required && <span className="text-rose-600" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[44px] rounded-xl border bg-white text-slate-900 text-sm px-3.5 py-2.5 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 disabled:bg-slate-50 disabled:text-slate-400 ${
            leftIcon ? 'pl-10' : ''
          } ${
            error
              ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-rose-700 mt-1 font-medium flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-600 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};


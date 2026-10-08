import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#3A3833] tracking-wide"
        >
          {label} {props.required && <span className="text-[#C24141]" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-2xs">
        <select
          id={selectId}
          className={`w-full min-h-[44px] appearance-none rounded-xl border bg-[#FFFDF8] text-[#202020] text-sm px-3.5 py-2.5 pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#D6B36A] disabled:bg-[#FBF8EF] disabled:text-[#AEB4BB] cursor-pointer ${
            error
              ? 'border-[#C24141] focus:ring-[#C24141] focus:border-[#C24141] bg-rose-50/20'
              : 'border-[#E7DFCE] hover:border-[#D6B36A]/60'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#77736A]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-[#C24141] mt-1 font-medium">
          {error}
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


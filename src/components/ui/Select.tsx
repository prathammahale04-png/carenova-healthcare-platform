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
          className="block text-xs font-semibold text-slate-800 tracking-wide"
        >
          {label} {props.required && <span className="text-rose-600" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        <select
          id={selectId}
          className={`w-full min-h-[44px] appearance-none rounded-xl border bg-white text-slate-900 text-sm px-3.5 py-2.5 pr-10 transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer ${
            error
              ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
              : 'border-slate-300 hover:border-slate-400'
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
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="text-xs text-rose-700 mt-1 font-medium">
          {error}
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


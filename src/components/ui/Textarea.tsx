import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-[#3A3833] tracking-wide"
        >
          {label} {props.required && <span className="text-[#C24141]">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-2xs">
        <textarea
          id={textareaId}
          rows={rows}
          className={`w-full rounded-xl border bg-[#FFFDF8] text-[#202020] text-sm p-3.5 transition-colors placeholder:text-[#AEB4BB] focus:outline-none focus:ring-2 focus:ring-[#D6B36A] focus:border-[#D6B36A] disabled:bg-[#FBF8EF] disabled:text-[#AEB4BB] ${
            error
              ? 'border-[#C24141] focus:ring-[#C24141] focus:border-[#C24141] bg-rose-50/20'
              : 'border-[#E7DFCE] hover:border-[#D6B36A]/60'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${textareaId}-error`} className="text-xs text-[#C24141] mt-1 font-medium">
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

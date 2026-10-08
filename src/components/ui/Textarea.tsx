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
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-xs">
        <textarea
          id={textareaId}
          rows={rows}
          className={`w-full rounded-lg border bg-white text-slate-900 text-sm p-3.5 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-50 disabled:text-slate-500 ${
            error
              ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
              : 'border-slate-300 hover:border-slate-400'
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${textareaId}-error`} className="text-xs text-rose-600 mt-1 font-medium">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-xs text-slate-500 mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
};

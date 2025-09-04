
import React from 'react';

interface FormFieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, helpText, children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      {children}
      {helpText && <p className="mt-1 text-xs text-slate-400">{helpText}</p>}
    </div>
  );
};

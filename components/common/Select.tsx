import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  return (
    <select
      {...props}
      className={`block w-full pl-3 pr-10 py-2 text-base border-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md bg-slate-200 text-slate-900 ${props.className || ''}`}
    >
      {children}
    </select>
  );
};
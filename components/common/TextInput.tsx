import React, { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can add any custom props here if needed
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const baseClasses = "block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm";

    const styleClasses = props.readOnly
        ? "bg-slate-700/50 text-slate-300 border-slate-700 cursor-default"
        : "bg-slate-200 text-slate-900 border-slate-400 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500";
      
    return (
        <input
            ref={ref}
            {...props}
            className={`${baseClasses} ${styleClasses} ${props.className || ''}`.trim()}
        />
    );
});

TextInput.displayName = "TextInput";
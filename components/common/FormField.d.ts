import React from 'react';
interface FormFieldProps {
    label: React.ReactNode;
    htmlFor?: string;
    helpText?: string;
    children: React.ReactNode;
    className?: string;
}
export declare const FormField: React.FC<FormFieldProps>;
export {};

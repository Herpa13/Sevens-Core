import React from 'react';
interface IconProps extends React.HTMLAttributes<HTMLElement> {
    name: string;
    className?: string;
    title?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}
export declare const Icon: React.FC<IconProps>;
export {};

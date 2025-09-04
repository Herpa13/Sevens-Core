

import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  className?: string;
  title?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Icon: React.FC<IconProps> = ({ name, className, title, onClick, ...rest }) => {
  // Use fa-brands for brand icons, fa-solid as default
  const style = className === 'fab' ? 'fa-brands' : 'fa-solid';
  // Avoid duplicating 'fab' in the class list
  const otherClasses = className === 'fab' ? '' : className;

  return <i 
    className={`${style} fa-${name} ${otherClasses || ''}`.trim()} 
    title={title} 
    onClick={onClick}
    {...rest}
  ></i>;
};

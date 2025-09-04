
import React, { useState, ReactNode } from 'react';
import { Icon } from './Icon';

interface CollapsibleSectionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  id?: string;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  id,
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  return (
    <div id={id} className={`border border-slate-700 rounded-lg mb-4 bg-slate-800/50 ${className || ''}`}>
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center p-3 font-semibold text-left text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-t-lg focus:outline-none"
      >
        <span>{title}</span>
        <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} className="transition-transform" />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
};

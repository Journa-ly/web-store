import clsx from 'clsx';
import React from 'react';

export interface TooltipProps {
  message: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ message, position = 'top', className, children }) => {
  const classes = clsx('tooltip', `tooltip-${position}`, className);

  return (
    <div className={classes} data-tip={message}>
      {children}
    </div>
  );
};

export default Tooltip;

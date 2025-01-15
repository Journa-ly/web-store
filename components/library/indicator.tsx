// components/ui/Indicator.tsx

import clsx from 'clsx';
import React from 'react';

export interface IndicatorProps {
  children: React.ReactNode;
  value?: number | string; // e.g., a number or text
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

const Indicator: React.FC<IndicatorProps> = ({
  children,
  value,
  color = 'primary',
  className,
}) => {
  return (
    <div className={clsx('indicator', className)}>
      {value !== undefined && (
        <span
          className={clsx(
            'indicator-item badge',
            `badge-${color}`
          )}
        >
          {value}
        </span>
      )}
      {children}
    </div>
  );
};

export default Indicator;

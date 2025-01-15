// components/ui/Range.tsx

import clsx from 'clsx';
import React from 'react';


// Omit 'size' because native <select> expects a number for size
type NativeRangeProps = Omit<
  React.SelectHTMLAttributes<HTMLInputElement>,
  'size'
>;

export interface RangeProps extends NativeRangeProps {
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const Range: React.FC<RangeProps> = ({
  size = 'md',
  className,
  ...props
}) => {
  const classes = clsx(
    'range',
    `range-${size}`,
    className
  );

  return <input type="range" className={classes} {...props} />;
};

export default Range;

// components/ui/Select.tsx

import clsx from 'clsx';
import React from 'react';

// Omit 'size' because native <select> expects a number for size
type NativeSelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

export interface SelectProps extends NativeSelectProps {
  size?: 'lg' | 'md' | 'sm' | 'xs'; // Now this is your custom size
  bordered?: boolean;
}

const Select: React.FC<SelectProps> = ({
  size = 'md',
  bordered = false,
  className,
  children,
  ...props
}) => {
  const classes = clsx('select', `select-${size}`, bordered && 'select-bordered', className);

  return (
    <select className={classes} {...props}>
      {children}
    </select>
  );
};

export default Select;

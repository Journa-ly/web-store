// components/ui/Badge.tsx

import clsx from 'clsx';
import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  outline?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  color = 'primary',
  size = 'md',
  outline = false,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'badge',
    `badge-${color}`,
    size && `badge-${size}`,
    outline && 'badge-outline',
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;

import clsx from 'clsx';
import React from 'react';

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({
  status = 'info',
  icon,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'alert',
    `alert-${status}`,
    className
  );

  return (
    <div className={classes} {...props}>
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default Alert;

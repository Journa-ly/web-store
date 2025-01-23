import clsx from 'clsx';
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'link'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  outline?: boolean;
  active?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  outline = false,
  active = false,
  loading = false,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    outline && 'btn-outline',
    active && 'btn-active',
    loading && 'loading',
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;

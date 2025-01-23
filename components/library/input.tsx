import clsx from 'clsx';
import React from 'react';

type NativeInputProps = Omit<React.SelectHTMLAttributes<HTMLInputElement>, 'size'>;

export interface InputProps extends NativeInputProps {
  size?: 'lg' | 'md' | 'sm' | 'xs';
  bordered?: boolean;
}

const Input: React.FC<InputProps> = ({ size = 'md', bordered = false, className, ...props }) => {
  const classes = clsx('input', `input-${size}`, bordered && 'input-bordered', className);

  return <input className={classes} {...props} />;
};

export default Input;

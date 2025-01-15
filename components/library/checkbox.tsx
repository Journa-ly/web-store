// components/ui/Checkbox.tsx

import clsx from 'clsx';
import React from 'react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <label className={clsx('label cursor-pointer', className)}>
      <span className="label-text mr-2">{label}</span>
      <input type="checkbox" className="checkbox" {...props} />
    </label>
  );
};

export default Checkbox;

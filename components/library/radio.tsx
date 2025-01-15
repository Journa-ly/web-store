// components/ui/Radio.tsx

import clsx from 'clsx';
import React from 'react';

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Radio: React.FC<RadioProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <label className={clsx('label cursor-pointer', className)}>
      <span className="label-text mr-2">{label}</span>
      <input type="radio" className="radio" {...props} />
    </label>
  );
};

export default Radio;

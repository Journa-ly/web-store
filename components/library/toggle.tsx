// components/ui/Toggle.tsx

import clsx from 'clsx';
import React from 'react';

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, className, ...props }) => {
  return (
    <label className={clsx('label cursor-pointer', className)}>
      {label && <span className="label-text mr-2">{label}</span>}
      <input type="checkbox" className="toggle" {...props} />
    </label>
  );
};

export default Toggle;

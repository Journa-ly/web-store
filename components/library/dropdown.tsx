import clsx from 'clsx';
import React, { useState } from 'react';

export interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hover?: boolean; // if true, open on hover
}

const Dropdown: React.FC<DropdownProps> = ({ label, children, className, hover = false }) => {
  const [open, setOpen] = useState(false);

  const containerClasses = clsx('dropdown', hover ? 'dropdown-hover' : '', className);

  return (
    <div className={containerClasses} onMouseLeave={() => setOpen(false)}>
      <label tabIndex={0} className="btn m-1" onClick={() => !hover && setOpen(!open)}>
        {label}
      </label>

      <ul
        tabIndex={0}
        className={clsx('menu dropdown-content w-52 rounded-box bg-base-100 p-2 shadow', {
          hidden: !open && !hover,
          block: open || hover
        })}
      >
        {children}
      </ul>
    </div>
  );
};

export default Dropdown;

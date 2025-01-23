// components/ui/FileInput.tsx

import clsx from 'clsx';
import React from 'react';

type NativeFileInputProps = Omit<React.SelectHTMLAttributes<HTMLInputElement>, 'size'>;

export interface FileInputProps extends NativeFileInputProps {
  label?: string;
  bordered?: boolean;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  bordered = false,
  size = 'md',
  className,
  ...props
}) => {
  const classes = clsx(
    'file-input',
    `file-input-${size}`,
    bordered && 'file-input-bordered',
    className
  );

  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input type="file" className={classes} {...props} />
    </div>
  );
};

export default FileInput;

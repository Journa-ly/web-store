// components/ui/Loader.tsx

import clsx from 'clsx';
import React from 'react';

export interface LoaderProps {
  type?: 'spinner' | 'dots' | 'bars' | 'ball';
  className?: string;
  size?: 'lg' | 'md' | 'sm' | 'xs';
}

const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'md',
  className,
}) => {
  const baseClass = clsx('loading', className);

  const typeClass = {
    spinner: 'loading-spinner',
    dots: 'loading-dots',
    bars: 'loading-bars',
    ball: 'loading-ball',
  }[type];

  const sizeClass = `loading-${size}`;

  return <span className={clsx(baseClass, typeClass, sizeClass)} />;
};

export default Loader;

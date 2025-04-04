'use client';

import React, { ReactNode } from 'react';
import StudioTutorial from './StudioTutorial';

interface StudioTutorialWrapperProps {
  children: ReactNode;
}

const StudioTutorialWrapper: React.FC<StudioTutorialWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <StudioTutorial />
    </>
  );
};

export default StudioTutorialWrapper; 
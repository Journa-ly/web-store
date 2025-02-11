import clsx from 'clsx';
import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, className }) => {
  const containerClasses = clsx('modal', open && 'modal-open');
  const modalClasses = clsx('modal-box p-0', className);

  return (
    <div className={containerClasses} onClick={onClose}>
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

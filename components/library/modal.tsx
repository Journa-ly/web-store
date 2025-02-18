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

  const handleModalClick = (e: React.MouseEvent) => {
    // Stop propagation for all clicks within the modal container
    e.stopPropagation();
    e.preventDefault();
    
    // Only close if clicking the backdrop (modal container itself)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={containerClasses} onClick={handleModalClick}>
      <div className={modalClasses}>{children}</div>
    </div>
  );
};

export default Modal;

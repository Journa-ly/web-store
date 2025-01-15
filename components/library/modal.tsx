import clsx from 'clsx';
import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  const containerClasses = clsx(
    'modal',
    open && 'modal-open',
    className
  );

  return (
    <div className={containerClasses} onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
        <div className="modal-action">
          <label className="btn" onClick={onClose}>
            Close
          </label>
        </div>
      </div>
    </div>
  );
};

export default Modal;

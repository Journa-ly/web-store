import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SlideOutModal = ({ isOpen, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  // Manage the visibility and animation class
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Delay adding the 'open' class to allow the CSS transition to work
      requestAnimationFrame(() => {
        setAnimationClass('open');
      });
    } else if (isVisible) {
      setAnimationClass(''); // Remove 'open' class to trigger slide-out
      // Wait for the closing animation before unmounting
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Transition duration in milliseconds
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close the modal when the 'Escape' key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalElements = document.querySelectorAll('.modal-content');
      const elementsContainEventTarget = Array.from(modalElements).some((element) => element.contains(event.target));
      if (isOpen && modalElements && !elementsContainEventTarget) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  const modalClassName = `modal-content ${animationClass}`;

  // Render the modal content into a portal
  return createPortal(
    <div className={modalClassName}>
      {children}
    </div>,
    document.body
  );
};

export default SlideOutModal;

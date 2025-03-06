'use client';

import { useState, useRef, useEffect } from 'react';

interface MobileMenuProps {
  children: React.ReactNode;
}

export default function MobileMenu({ children }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside as EventListener);
      document.addEventListener('touchstart', handleClickOutside as EventListener);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [isMenuOpen]);

  // Close menu when a link is clicked
  useEffect(() => {
    function handleLinkClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      // Check if the clicked element is an anchor tag or has an anchor tag parent
      if (target.tagName === 'A' || target.closest('a')) {
        setIsMenuOpen(false);
      }
    }
    
    if (isMenuOpen && menuRef.current) {
      menuRef.current.addEventListener('click', handleLinkClick as EventListener);
    }
    
    return () => {
      if (menuRef.current) {
        menuRef.current.removeEventListener('click', handleLinkClick as EventListener);
      }
    };
  }, [isMenuOpen]);

  return (
    <div className="relative lg:hidden" ref={menuRef}>
      <button 
        className="btn btn-ghost m-1"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="absolute top-full left-0 z-50 menu p-2 shadow bg-base-100 rounded-box w-52">
          {children}
        </div>
      )}
    </div>
  );
} 
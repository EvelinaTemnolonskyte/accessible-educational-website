'use client';

import React, { useEffect, useRef } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  confirmBtnColor?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
  maxWidth = '540px'
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
          return;
        }

        if (e.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) { 
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { 
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      
      const timer = setTimeout(() => {
          modalRef.current?.focus();
      }, 10);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timer);
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        zIndex: 2000, backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()} 
        style={{
          borderRadius: '20px',
          border: '1px solid var(--blue-buttons-border)',
          width: '90%', maxWidth: maxWidth,
          overflow: 'hidden',
          outline: 'none' 
        }}
      >
        <div style={{ 
          background: 'var(--blue-to-black)', color: 'var(--white-bg)', 
          padding: '30px 40px', textAlign: 'left' , borderBottom: '1px solid var(--blue-buttons-border)'
        }}>
          <h2 id="modal-title" style={{ margin: '0 0 8px', color: 'var(--white-bg)' }}>
            {title}
          </h2>
          {subtitle && (
            <h3 style={{color: 'var(--white-bg)'}}>{subtitle}</h3>
          )}
        </div>

        <div style={{ padding: '40px', background: 'var(--secondary-bg)' }}>
          {children}

          <div style={{ 
            display: 'flex', justifyContent: 'space-between', 
            alignItems: 'center', marginTop: '35px' 
          }}>
            <button
              onClick={onClose}
              className="action-btn secondary-btn"
            >
              {cancelText}
            </button>
            
            <button
              onClick={onConfirm}
              className="primary-btn action-btn"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
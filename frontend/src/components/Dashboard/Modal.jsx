import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, title, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className={`surface-card-strong ${sizeClasses[size]} w-full max-h-[90vh] overflow-auto`}>
        <div className="sticky top-0 border-b border-[var(--app-border)] bg-[color:var(--app-surface-strong)] p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[var(--app-text)]">{title}</h2>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--app-border)] text-muted transition hover:text-[var(--app-text)]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

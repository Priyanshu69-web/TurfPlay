import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Modal = ({ isOpen, title, onClose, children, size = 'md' }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className={`sticky top-0 border-b ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} p-6`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <button
              onClick={onClose}
              className={`text-2xl leading-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ×
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

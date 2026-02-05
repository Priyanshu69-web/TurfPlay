import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Card = ({ title, children, className = '' }) => {
  const { isDark } = useTheme();

  return (
    <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} ${className}`}>
      {title && <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4`}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;

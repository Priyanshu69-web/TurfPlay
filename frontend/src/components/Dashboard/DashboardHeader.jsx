import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const DashboardHeader = ({ title, subtitle }) => {
  const { isDark } = useTheme();

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg`}>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-blue-100">{subtitle}</p>}
    </div>
  );
};

export default DashboardHeader;

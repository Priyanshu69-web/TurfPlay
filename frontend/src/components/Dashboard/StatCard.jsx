import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  const { isDark } = useTheme();

  const colorClasses = {
    blue: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600',
    green: isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600',
    purple: isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600',
    red: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600',
  };

  return (
    <div className={`rounded-lg shadow-md p-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm mb-1`}>{label}</p>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

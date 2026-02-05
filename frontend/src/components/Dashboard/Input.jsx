import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false, error }) => {
  const { isDark } = useTheme();

  return (
    <div className="mb-4">
      {label && (
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : isDark
            ? 'border-gray-700 bg-gray-800 text-white focus:ring-blue-500'
            : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;

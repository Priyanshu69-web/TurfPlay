import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          404
        </h1>
        <p className={`text-2xl font-semibold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Page Not Found
        </p>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2 mb-8`}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Home size={20} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

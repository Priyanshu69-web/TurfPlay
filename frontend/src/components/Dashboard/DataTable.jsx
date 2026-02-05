import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const DataTable = ({ columns, data, onEdit, onDelete, loading = false }) => {
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No data found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b-2`}>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`px-4 py-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className={`px-4 py-3 text-left font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <React.Fragment key={row._id || idx}>
              <tr className={`border-b ${isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row._id)}
                          className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;

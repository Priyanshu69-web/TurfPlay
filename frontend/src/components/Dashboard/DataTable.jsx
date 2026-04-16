import React from 'react';
import Button from './Button';

const DataTable = ({ columns, data, onEdit, onDelete, editLabel = "Edit", deleteLabel = "Delete", loading = false }) => {
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
        <p className="text-muted">No data found</p>
      </div>
    );
  }

  return (
    <div className="premium-scrollbar overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--app-border)] bg-white/8">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-[var(--app-text)]">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3 text-left font-semibold text-[var(--app-text)]">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <React.Fragment key={row._id || idx}>
              <tr className="border-b border-[var(--app-border)] transition hover:bg-white/6">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-[var(--app-text)]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onEdit && (
                        <Button
                          onClick={() => onEdit(row)}
                          variant="secondary"
                          size="sm"
                        >
                          {editLabel}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          onClick={() => onDelete(row._id)}
                          variant="danger"
                          size="sm"
                        >
                          {deleteLabel}
                        </Button>
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

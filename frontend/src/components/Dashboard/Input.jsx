import React from 'react';

const Input = ({ label, name, type = 'text', value, onChange, placeholder, required = false, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-medium text-[var(--app-text)]">
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
            : 'border-[var(--app-border)] bg-white/10 text-[var(--app-text)] focus:ring-emerald-500'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;

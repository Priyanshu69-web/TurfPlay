import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const variants = {
    primary: 'brand-gradient text-white shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5',
    secondary: 'border border-[var(--app-border)] bg-white/8 text-[var(--app-text)] hover:-translate-y-0.5 hover:bg-white/12',
    danger: 'bg-rose-500 text-white hover:-translate-y-0.5 hover:bg-rose-600',
    success: 'bg-emerald-500 text-white hover:-translate-y-0.5 hover:bg-emerald-600',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-2xl font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;

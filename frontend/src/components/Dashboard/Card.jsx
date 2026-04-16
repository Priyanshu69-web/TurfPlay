import React from 'react';

const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`surface-card p-6 text-[var(--app-text)] ${className}`}>
      {title ? <h3 className="mb-4 text-lg font-semibold text-[var(--app-text)]">{title}</h3> : null}
      {children}
    </div>
  );
};

export default Card;

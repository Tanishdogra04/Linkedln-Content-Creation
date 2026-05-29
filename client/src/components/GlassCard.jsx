import React from 'react';

const GlassCard = ({ children, className = '', hover = true, padding = true, ...props }) => {
  return (
    <div 
      className={`
        glass-panel
        ${hover ? 'glass-panel-hover' : ''}
        ${padding ? 'p-6 md:p-8' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;

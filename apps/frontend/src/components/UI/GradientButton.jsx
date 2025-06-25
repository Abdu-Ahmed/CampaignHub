import React from 'react';

const GradientButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all transform hover:scale-[1.03]';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    danger: 'bg-gradient-to-r from-rose-500 to-red-600 text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className} px-5 py-2.5`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-2xl transition-all active:translate-y-[4px] active:border-b-0 uppercase tracking-widest flex items-center justify-center gap-2 select-none";
  
  const variants = {
    primary: "bg-duo-green border-b-4 border-duo-green-dark text-white hover:bg-opacity-90 active:border-t-4 active:border-t-transparent",
    secondary: "bg-white border-2 border-b-4 border-duo-gray text-duo-text hover:bg-gray-50 active:border-gray-200",
    danger: "bg-duo-red border-b-4 border-duo-red-dark text-white hover:bg-opacity-90 active:border-t-4 active:border-t-transparent",
    ghost: "bg-transparent text-duo-blue hover:bg-duo-blue/10 border-0 active:translate-y-0"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm border-b-[3px]",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  ...props 
}) => {
  return (
    <button className={`button ${variant}`} {...props}>
      {children}
    </button>
  );
};
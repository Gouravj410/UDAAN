import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', isLoading = false, children, disabled, ...props }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    primary: { bg: '#1a5490', text: 'white' },
    secondary: { bg: '#e0e0e0', text: 'black' },
    danger: { bg: '#d32f2f', text: 'white' },
  };

  const style = colors[variant];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        background: style.bg,
        color: style.text,
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '4px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        fontSize: '1rem',
        ...props.style,
      }}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

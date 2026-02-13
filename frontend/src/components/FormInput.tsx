import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{label}</label>}
      <input
        {...props}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: '4px',
          border: error ? '1px solid #d32f2f' : '1px solid #ccc',
          fontSize: '1rem',
          boxSizing: 'border-box',
          ...props.style,
        }}
      />
      {error && (
        <span style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  );
};

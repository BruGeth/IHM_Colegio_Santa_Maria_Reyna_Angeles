import React from 'react';

interface ToastProps {
  message: string | null;
  isError?: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, isError = false }) => {
  if (!message) return null;

  return (
    <div
      className={`toast ${isError ? 'error' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
};


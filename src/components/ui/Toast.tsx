import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  className?: string;
  onClose?: () => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'border-green-600/30 bg-green-50 text-green-800',
  error: 'border-[var(--color-prime-red)]/30 bg-red-50 text-[var(--color-prime-red)]',
  info: 'border-blue-600/30 bg-blue-50 text-blue-800',
  warning: 'border-yellow-600/30 bg-yellow-50 text-yellow-800',
};

export default function Toast({ 
  type, 
  message, 
  className = '', 
  onClose 
}: ToastProps) {
  return (
    <div
      role="alert"
      className={`flex items-center rounded-md border px-4 py-3 text-sm ${toastStyles[type]} ${className}`}
    >
      <div className="flex-shrink-0">
        {type === 'success' && (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="h-5 w-5 text-[var(--color-prime-red)]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L6.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'info' && (
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.5 4a1 1 0 000 2h3a1 1 0 100-2h-3zM9.5 12a1 1 0 000 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'warning' && (
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.581 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.492-1.646-1.742-2.98l5.581-9.92zM11 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'success' && (
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="ml-3 text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 flex items-center rounded-full hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

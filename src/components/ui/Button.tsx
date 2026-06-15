'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  loading?: boolean;
  children: ReactNode;
}

const baseClass =
  'inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2';

const variantClass = {
  primary:
    'bg-[var(--color-prime-gold)] text-[var(--color-prime-black)] hover:opacity-90 focus:ring-[var(--color-prime-gold)]',
  outline:
    'border border-[var(--color-prime-gold)] text-[var(--color-prime-gold)] hover:bg-[var(--color-prime-gold)]/10 focus:ring-[var(--color-prime-gold)]',
  ghost:
    'text-gray-600 hover:bg-gray-100 focus:ring-gray-300',
  danger:
    'bg-[var(--color-prime-red)] text-white hover:opacity-90 focus:ring-[var(--color-prime-red)]',
};

export default function Button({
  variant = 'primary',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="-ml-1 mr-2 h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const styles = {
  base: 'inline-flex items-center justify-center font-semibold rounded-[var(--radius-sm)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm',
  variant: {
    primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)] active:scale-[0.98]',
    secondary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] focus:ring-[var(--color-accent)] active:scale-[0.98]',
    outline: 'border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-pale)] focus:ring-[var(--color-primary)]',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-primary-pale)] focus:ring-[var(--color-primary-light)]',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-[var(--radius-sm)]',
    lg: 'px-6 py-3 text-lg rounded-[var(--radius-sm)]',
  },
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.base} ${styles.variant[variant]} ${styles.size[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

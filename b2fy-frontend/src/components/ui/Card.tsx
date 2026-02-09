import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '', ...rest }: Readonly<CardProps>) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow)] p-5 transition-shadow hover:shadow-[var(--shadow-lg)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h3 className={`text-lg font-bold text-[var(--color-primary)] ${className}`}>{children}</h3>
}

export function CardContent({ children, className = '' }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={`mt-2 text-[var(--color-text-muted)] ${className}`}>{children}</div>
}

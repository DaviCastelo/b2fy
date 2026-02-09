import React, { useEffect, useRef, useState } from 'react'

interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, children, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setOpen((o) => !o)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}>
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute top-full mt-2 z-50 min-w-[200px] rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] py-1 overflow-hidden ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`w-full text-left px-4 py-2.5 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-primary-pale)] transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

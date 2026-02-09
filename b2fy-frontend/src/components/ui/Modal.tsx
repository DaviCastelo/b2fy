import React, { useEffect } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-primary)]/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="max-w-md w-full rounded-[var(--radius)] bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[var(--shadow-lg)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-[var(--color-border)] bg-[var(--color-primary-pale)]">
            <h2 className="text-lg font-bold text-[var(--color-primary)]">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fechar" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              ×
            </Button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="px-5 py-4 border-t-2 border-[var(--color-border)] flex justify-end gap-2 bg-[var(--color-bg)]">{footer}</div>}
      </div>
    </div>
  )
}

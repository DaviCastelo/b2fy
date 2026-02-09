import React, { useEffect } from 'react'

interface ToastProps {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
  type?: 'success' | 'error' | 'info'
}

export function Toast({ message, visible, onClose, duration = 3000, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (!visible || !message) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [visible, message, duration, onClose])

  if (!visible) return null

  const typeStyles = {
    success: 'bg-[var(--color-primary)] text-white shadow-lg',
    error: 'bg-[var(--color-error)] text-white shadow-lg',
    info: 'bg-[var(--color-text)] text-white shadow-lg',
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <div
        role="alert"
        aria-live="polite"
        className={`px-5 py-3 rounded-xl font-medium text-sm animate-toast-in ${typeStyles[type]}`}
      >
        {type === 'success' && (
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </span>
        )}
        {type !== 'success' && message}
      </div>
    </div>
  )
}

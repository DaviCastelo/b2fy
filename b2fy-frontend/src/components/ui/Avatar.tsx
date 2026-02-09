import React from 'react'

interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-12 h-12 text-lg' }

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizes[size]
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    )
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white font-bold ${sizeClass} ${className}`}
      aria-label={alt ?? name}
    >
      {name ? initials(name) : '?'}
    </div>
  )
}

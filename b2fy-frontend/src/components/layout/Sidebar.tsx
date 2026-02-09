import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItemsEmpresa = [
  { to: '/', label: 'Home' },
  { to: '/agendar-licitacao', label: 'Agendar licitação' },
  { to: '/conversas', label: 'Conversas' },
]

const navItemsFornecedor = [
  { to: '/', label: 'Home' },
  { to: '/conversas', label: 'Conversas' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: Readonly<SidebarProps>) {
  const { isEmpresa } = useAuth()
  const navItems = isEmpresa ? navItemsEmpresa : navItemsFornecedor

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-width)] border-r-2 border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col shadow-[var(--shadow)] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Menu principal"
      aria-hidden={!isOpen}
    >
      <div className="p-5 border-b-2 border-[var(--color-border)] bg-[var(--color-surface)]">
        <NavLink to="/" className="flex items-center gap-3 no-underline group">
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/b2fy%20Logo%20-%20Modern%20Wordmark%20in%20Blue%20and%20Vibrant%20Teal-Picsart-BackgroundRemover.png"
              alt="B2FY"
              className="h-10 w-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            <div className="logo-fallback absolute inset-0 hidden w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white items-center justify-center text-sm font-bold">
              B2
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-[var(--color-primary)] block">B2FY</span>
            <span className="text-xs text-[var(--color-text-muted)]">Licitações B2B Inteligentes</span>
          </div>
        </NavLink>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1 list-none m-0 p-0">
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-[var(--radius-sm)] text-[var(--color-text)] no-underline font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--color-primary-pale)] text-[var(--color-primary)] border-l-4 border-[var(--color-primary)]'
                      : 'hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] border-l-4 border-transparent'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

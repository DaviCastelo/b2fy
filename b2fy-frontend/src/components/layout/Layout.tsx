import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div
      className="min-h-screen bg-[var(--color-bg)]"
      style={
        { '--sidebar-effective-width': isSidebarOpen ? 'var(--sidebar-width)' : '0px' } as React.CSSProperties
      }
    >
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen((o) => !o)} />
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <main
        className="pt-[var(--header-height)] min-h-screen py-6 px-[10px] transition-[padding] duration-300 ease-in-out"
        style={{
          paddingTop: 'var(--header-height)',
          paddingLeft: 'calc(var(--sidebar-effective-width, var(--sidebar-width)) + 12px)',
        }}
      >
        <Outlet />
      </main>
    </div>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <Header />
      <main
        className="pt-[var(--header-height)] pl-[var(--sidebar-width)] min-h-screen p-6"
        style={{ paddingTop: 'var(--header-height)' }}
      >
        <Outlet />
      </main>
    </div>
  )
}

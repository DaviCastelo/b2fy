import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <header
      className="fixed top-0 right-0 left-[var(--sidebar-width)] z-30 h-[var(--header-height)] border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-end px-6 shadow-[var(--shadow-sm)]"
      aria-label="Cabeçalho"
    >
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-[var(--color-primary)] hidden sm:inline">B2FY</span>
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 cursor-pointer rounded-full p-1 hover:bg-[var(--color-primary-pale)] transition-colors">
              <Avatar src={user.fotoPerfilUrl} name={user.nome} size="md" className="ring-2 ring-[var(--color-primary-light)]" />
            </div>
          }
          align="right"
        >
          <DropdownItem onClick={() => navigate('/perfil')}>Informações do perfil</DropdownItem>
          <DropdownItem onClick={() => navigate('/configuracoes')}>Configurações</DropdownItem>
          <DropdownItem onClick={() => { logout(); navigate('/login'); }} className="text-[var(--color-error)] font-medium">
            Sair
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}

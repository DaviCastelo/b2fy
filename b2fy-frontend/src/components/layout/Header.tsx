import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import type { NotificacaoResponse } from '../../types/api'

interface HeaderProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarOpen, onToggleSidebar }: Readonly<HeaderProps>) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [notificacoes, setNotificacoes] = useState<NotificacaoResponse[]>([])
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false)
  const [countNaoLidas, setCountNaoLidas] = useState(0)
  const refNotif = useRef<HTMLDivElement>(null)

  const carregarNotificacoes = () => {
    api.get<NotificacaoResponse[]>('/notificacoes').then(setNotificacoes).catch(() => {})
    api.get<{ count: number }>('/notificacoes/nao-lidas').then((r) => setCountNaoLidas(r.count)).catch(() => {})
  }

  useEffect(() => {
    if (!user) return
    carregarNotificacoes()
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refNotif.current && !refNotif.current.contains(e.target as Node)) setNotificacoesAbertas(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const aoAbrirNotificacoes = () => {
    setNotificacoesAbertas((o) => !o)
    if (!notificacoesAbertas) carregarNotificacoes()
  }

  const aoClicarNotificacao = (n: NotificacaoResponse) => {
    if (!n.lida) {
      api.patch(`/notificacoes/${n.id}/lida`).then(() => {
        setCountNaoLidas((c) => Math.max(0, c - 1))
        setNotificacoes((prev) => prev.map((x) => (x.id === n.id ? { ...x, lida: true } : x)))
      }).catch(() => {})
    }
    setNotificacoesAbertas(false)
    navigate(`/licitacao/${n.licitacaoId}`)
  }

  if (!user) return null

  return (
    <header
      className="fixed top-0 right-0 z-30 h-[var(--header-height)] border-b-2 border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between px-4 transition-[left] duration-300 ease-in-out shadow-[var(--shadow-sm)]"
      style={{ left: 'var(--sidebar-effective-width, var(--sidebar-width))' }}
      aria-label="Cabeçalho"
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-[var(--color-text)] hover:bg-[var(--color-primary-pale)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
        aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={isSidebarOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative" ref={refNotif}>
          <button
            type="button"
            onClick={aoAbrirNotificacoes}
            className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-sm)] text-[var(--color-text)] hover:bg-[var(--color-primary-pale)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            aria-label="Notificações"
            aria-expanded={notificacoesAbertas}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {countNaoLidas > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white">
                {countNaoLidas > 99 ? '99+' : countNaoLidas}
              </span>
            )}
          </button>
          {notificacoesAbertas && (
            <div className="absolute right-0 top-full z-50 mt-2 w-[320px] max-h-[400px] overflow-y-auto rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] py-2">
              <div className="px-4 py-2 border-b border-[var(--color-border)]">
                <h3 className="text-sm font-semibold text-[var(--color-primary)]">Notificações</h3>
              </div>
              {notificacoes.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">Nenhuma notificação.</p>
              ) : (
                <ul className="list-none m-0 p-0">
                  {notificacoes.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => aoClicarNotificacao(n)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[var(--color-primary-pale)] border-b border-[var(--color-border)] last:border-b-0 ${!n.lida ? 'bg-[var(--color-primary-pale)]/50 font-medium' : 'text-[var(--color-text)]'}`}
                      >
                        <span className="block text-[var(--color-text)]">{n.mensagem}</span>
                        <span className="block mt-1 text-xs text-[var(--color-text-muted)]">{n.licitacaoNome}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
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

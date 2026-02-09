import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import type { UsuarioResponse, NichoResponse } from '../types/api'
import type { AtualizarPerfilRequest } from '../types/api'

export function Perfil() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<UsuarioResponse | null>(null)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nome, setNome] = useState('')
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [estado, setEstado] = useState('')
  const [nichos, setNichos] = useState<string[]>([])
  const [nichoInput, setNichoInput] = useState('')
  const [nichosDisponiveis, setNichosDisponiveis] = useState<NichoResponse[]>([])
  const [nichoDropdownAberto, setNichoDropdownAberto] = useState(false)
  const nichoInputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<NichoResponse[]>('/nichos').then(setNichosDisponiveis).catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (nichoInputRef.current && !nichoInputRef.current.contains(e.target as Node)) {
        setNichoDropdownAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  const nichosFiltrados = nichoInput.trim()
    ? nichosDisponiveis.filter((n) => n.nome.toLowerCase().includes(nichoInput.trim().toLowerCase()))
    : nichosDisponiveis

  const [fotoPerfilUrl, setFotoPerfilUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api
      .get<UsuarioResponse>('/usuarios/me')
      .then((p) => {
        setPerfil(p)
        setEmail(p.email)
        setTelefone(p.telefone ?? '')
        setNome(p.nome)
        setCep(p.cep ?? '')
        setEndereco(p.endereco ?? '')
        setEstado(p.estado ?? '')
        setNichos(p.nichos ?? [])
        setFotoPerfilUrl(p.fotoPerfilUrl ?? '')
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  function addNicho() {
    const n = nichoInput.trim()
    if (n && !nichos.includes(n)) {
      setNichos([...nichos, n])
      setNichoInput('')
    }
  }

  function selecionarNicho(nome: string) {
    if (!nichos.includes(nome)) setNichos([...nichos, nome])
    setNichoInput('')
    setNichoDropdownAberto(false)
  }

  function removeNicho(n: string) {
    setNichos(nichos.filter((x) => x !== n))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!senhaAtual) {
      setError('Informe sua senha atual para confirmar as alterações.')
      return
    }
    setError('')
    setSuccess('')
    setSaving(true)
    const data: AtualizarPerfilRequest = {
      senhaAtual,
      email,
      telefone: telefone || undefined,
      nome,
      cep: cep || undefined,
      endereco: endereco || undefined,
      estado: estado || undefined,
      nichos,
      fotoPerfilUrl: fotoPerfilUrl || undefined,
    }
    try {
      await api.put('/usuarios/me', data)
      setSuccess('Perfil atualizado com sucesso.')
      setSenhaAtual('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !perfil) return <div className="text-[var(--color-text-muted)] font-medium">Carregando...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Informações do perfil</h1>
      <Card className="max-w-2xl shadow-[var(--shadow)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Senha atual (obrigatório para editar)"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            placeholder="Digite sua senha para confirmar"
            required
          />
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <Input label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
          <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
          <Input label="Estado (UF)" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} />
          <Input label="URL da foto de perfil" value={fotoPerfilUrl} onChange={(e) => setFotoPerfilUrl(e.target.value)} placeholder="https://..." />
          <div ref={nichoInputRef}>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Nichos</label>
            <div className="flex gap-2 mb-2 relative">
              <input
                type="text"
                value={nichoInput}
                onChange={(e) => {
                  setNichoInput(e.target.value)
                  setNichoDropdownAberto(true)
                }}
                onFocus={() => nichoInput.trim().length >= 1 && setNichoDropdownAberto(true)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNicho())}
                placeholder="Digite para ver nichos cadastrados"
                className="flex-1 px-4 py-2.5 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                autoComplete="off"
              />
              <Button type="button" variant="outline" onClick={addNicho}>Adicionar</Button>
              {nichoDropdownAberto && nichoInput.trim().length >= 1 && nichosFiltrados.length > 0 && (
                <ul
                  className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg z-10 py-1"
                  role="listbox"
                >
                  {nichosFiltrados.map((n) => (
                    <li
                      key={n.id}
                      role="option"
                      className="px-4 py-2.5 text-sm cursor-pointer hover:bg-[var(--color-primary-pale)] text-[var(--color-text)]"
                      onClick={() => selecionarNicho(n.nome)}
                    >
                      {n.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {nichos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {nichos.map((n) => (
                  <span key={n} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary-pale)] text-[var(--color-primary)] text-sm font-medium">
                    {n}
                    <button type="button" onClick={() => removeNicho(n)} className="text-[var(--color-error)] hover:underline font-bold">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 px-3 py-2 rounded-[var(--radius-sm)]">{error}</p>}
          {success && <p className="text-sm font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-3 py-2 rounded-[var(--radius-sm)]">{success}</p>}
          <Button type="submit" disabled={saving} variant="secondary">{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
        </form>
      </Card>
    </div>
  )
}

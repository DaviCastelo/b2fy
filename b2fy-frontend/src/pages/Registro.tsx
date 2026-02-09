import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import type { NichoResponse, RegistroRequest } from '../types/api'

export function Registro() {
  const [tipo, setTipo] = useState<'EMPRESA' | 'FORNECEDOR'>('EMPRESA')
  const [cpfOuCnpj, setCpfOuCnpj] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nome, setNome] = useState('')
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [estado, setEstado] = useState('')
  const [nichos, setNichos] = useState<string[]>([])
  const [nichoInput, setNichoInput] = useState('')
  const [nichosDisponiveis, setNichosDisponiveis] = useState<NichoResponse[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get<NichoResponse[]>('/nichos', false).then(setNichosDisponiveis).catch(() => {})
  }, [])

  function addNicho() {
    const n = nichoInput.trim()
    if (n && !nichos.includes(n)) {
      setNichos([...nichos, n])
      setNichoInput('')
    }
  }

  function removeNicho(n: string) {
    setNichos(nichos.filter((x) => x !== n))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (nichos.length === 0) {
      setError('Selecione ou informe pelo menos um nicho.')
      return
    }
    setLoading(true)
    const data: RegistroRequest = {
      tipo,
      cpfOuCnpj: cpfOuCnpj.replace(/\D/g, ''),
      email,
      senha,
      telefone: telefone || undefined,
      nome,
      cep: cep || undefined,
      endereco: endereco || undefined,
      estado: estado || undefined,
      nichos,
    }
    try {
      await register(data)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container auth-page min-h-screen flex flex-col bg-[var(--color-bg)]">
      <div className="page-main flex-1 flex items-center justify-center p-6 py-10 min-h-0">
        <div className="auth-card w-full max-w-[520px] mx-auto rounded-2xl bg-white border border-[var(--color-border)] shadow-lg p-8 sm:p-10">
            {/* Header: logo e título centralizados */}
            <div className="auth-card__header text-center mb-8">
              <div className="flex justify-center mb-6 min-h-[48px]">
                <img
                  src="/b2fy%20Logo%20-%20Modern%20Wordmark%20in%20Blue%20and%20Vibrant%20Teal-Picsart-BackgroundRemover.png"
                  alt="B2FY"
                  className="h-14 w-auto max-w-[240px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.parentElement?.querySelector('.logo-fallback') as HTMLElement
                    if (fallback) fallback.style.display = 'inline-flex'
                  }}
                />
                <div className="logo-fallback items-center gap-2" style={{ display: 'none' }}>
                  <span className="text-xl font-bold text-[var(--color-primary)]">B2FY</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Cadastre-se</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Crie sua conta B2FY</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <fieldset>
                <legend className="block text-sm font-semibold text-[var(--color-text)] mb-2">Tipo de usuário</legend>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border-2 border-[#e5e5e5] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
                    <input type="radio" name="tipo" checked={tipo === 'EMPRESA'} onChange={() => setTipo('EMPRESA')} className="accent-[var(--color-primary)]" />
                    Empresa
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border-2 border-[#e5e5e5] hover:border-[var(--color-primary)] has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[var(--color-primary-pale)] transition-colors">
                    <input type="radio" name="tipo" checked={tipo === 'FORNECEDOR'} onChange={() => setTipo('FORNECEDOR')} className="accent-[var(--color-primary)]" />
                    Fornecedor
                  </label>
                </div>
              </fieldset>
              <Input label="CPF ou CNPJ" value={cpfOuCnpj} onChange={(e) => setCpfOuCnpj(e.target.value)} placeholder="Somente números" required className="auth-input" />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="auth-input" />
              <Input label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} className="auth-input" />
              <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="auth-input" />
              <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required className="auth-input" />
              <Input label="CEP" value={cep} onChange={(e) => setCep(e.target.value)} className="auth-input" />
              <Input label="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} className="auth-input" />
              <Input label="Estado (UF)" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} placeholder="Ex: SP" className="auth-input" />
              <div>
                <label id="nicho-label" htmlFor="nicho-input" className="block text-sm font-medium text-[var(--color-text)] mb-2">Nichos *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    id="nicho-input"
                    type="text"
                    value={nichoInput}
                    aria-labelledby="nicho-label"
                    onChange={(e) => setNichoInput(e.target.value)}
                    onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNicho()
                  }
                }}
                    placeholder="Digite e adicione"
                    className="flex-1 px-4 py-2.5 rounded-lg border-2 border-[#e5e5e5] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] auth-input"
                  />
                  <Button type="button" variant="outline" onClick={addNicho}>
                    Adicionar
                  </Button>
                </div>
                {nichosDisponiveis.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {nichosDisponiveis.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => (nichos.includes(n.nome) ? removeNicho(n.nome) : setNichos([...nichos, n.nome]))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${nichos.includes(n.nome) ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-pale)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/30'}`}
                      >
                        {n.nome}
                      </button>
                    ))}
                  </div>
                )}
                {nichos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-[var(--color-text-muted)]">Selecionados:</span>
                    {nichos.map((n) => (
                      <span key={n} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary-pale)] text-[var(--color-primary)] text-sm font-medium">
                        {n}
                        <button type="button" onClick={() => removeNicho(n)} className="text-[var(--color-error)] hover:underline font-bold" aria-label={`Remover ${n}`}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {error && <p className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 px-3 py-2 rounded-lg">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="auth-btn-primary w-full py-3 rounded-lg font-semibold text-white bg-[#1a1a1a] hover:bg-[#2c2c2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              Já tem conta?{' '}
              <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline inline-flex items-center gap-1">
                Entrar <span aria-hidden>→</span>
              </Link>
            </p>

            <nav className="auth-card__footer mt-6 pt-6 border-t border-[var(--color-border)] flex justify-center gap-6" aria-label="Rodapé">
              <Link to="/ajuda" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Ajuda</Link>
              <Link to="/privacidade" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Privacidade</Link>
              <Link to="/termos" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)]">Termos</Link>
            </nav>
        </div>
      </div>
    </div>
  )
}

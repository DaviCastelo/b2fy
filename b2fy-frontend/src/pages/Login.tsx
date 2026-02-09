import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const [cpfOuCnpj, setCpfOuCnpj] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(cpfOuCnpj.trim(), senha)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container auth-page min-h-screen flex flex-col bg-[var(--color-bg)]">
      <div className="page-main flex-1 flex items-center justify-center p-6 min-h-0">
        <div className="auth-card w-full max-w-[420px] mx-auto rounded-2xl bg-white border border-[var(--color-border)] shadow-lg p-8 sm:p-10">
            {/* Header: logo e título centralizados */}
            <div className="auth-card__header text-center mb-8">
              <div className="flex justify-center mb-6 min-h-[48px]">
                <img
                  src="/b2fy%20Logo%20-%20Modern%20Wordmark%20in%20Blue%20and%20Vibrant%20Teal-Picsart-BackgroundRemover.png"
                  alt="B2FY"
                  className="h-200 w-auto max-w-[240px] object-contain"
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
              <h1 className="text-2xl font-bold text-[#1a1a1a]">Entrar</h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Acesse sua conta B2FY</p>
            </div>

            <div className="login-card__content">
              {/* 1. Formulário principal (CPF/CNPJ + Senha + botão escuro) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="CPF ou CNPJ"
                  value={cpfOuCnpj}
                  onChange={(e) => setCpfOuCnpj(e.target.value)}
                  placeholder="Somente números"
                  required
                  autoComplete="username"
                  className="auth-input"
                />
                <Input
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="auth-input"
                />
                {error && (
                  <p className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-btn-primary w-full py-3 rounded-lg font-semibold text-white bg-[#1a1a1a] hover:bg-[#2c2c2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  {loading ? 'Entrando...' : 'Continuar com CPF/CNPJ'}
                </button>
              </form>

              {/* 2. Separador "ou" */}
              <div className="flex items-center gap-3 my-6">
                <span className="flex-1 h-px bg-[var(--color-border)]" aria-hidden />
                <span className="text-sm text-[var(--color-text-muted)] font-medium">ou</span>
                <span className="flex-1 h-px bg-[var(--color-border)]" aria-hidden />
              </div>

              {/* 3. Entrar com passkey (botão claro, borda azul/teal) */}
              <button
                type="button"
                id="web_authn_btn_trigger"
                disabled
                title="Em breve"
                className="auth-btn-passkey ui-button ui-button--full-width ui-button--size-large w-full h-11 rounded-lg border-2 border-[var(--color-primary)] bg-white text-[#1a1a1a] font-medium text-sm opacity-70 cursor-not-allowed mb-4"
                aria-label="Entrar com passkey (em breve)"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <PasskeyIcon />
                  Entrar com passkey
                </span>
              </button>

              {/* 4. Apple, Facebook, Google */}
              <div className="external-login-provider flex gap-3 justify-center flex-wrap">
                <button
                  type="button"
                  disabled
                  title="Em breve"
                  className="auth-btn-external w-[125px] h-11 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] font-medium text-sm opacity-70 cursor-not-allowed"
                  aria-label="Entrar com Apple (em breve)"
                >
                  Apple
                </button>
                <button
                  type="button"
                  disabled
                  title="Em breve"
                  className="auth-btn-external w-[125px] h-11 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] font-medium text-sm opacity-70 cursor-not-allowed"
                  aria-label="Entrar com Facebook (em breve)"
                >
                  Facebook
                </button>
                <button
                  type="button"
                  disabled
                  title="Em breve"
                  className="auth-btn-external w-[125px] h-11 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] font-medium text-sm opacity-70 cursor-not-allowed"
                  aria-label="Entrar com Google (em breve)"
                >
                  Google
                </button>
              </div>
            </div>

            {/* Footer: "Não tem conta? Cadastre-se →" */}
            <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
              Não tem conta?{' '}
              <Link to="/registro" className="text-[var(--color-primary)] font-semibold hover:underline inline-flex items-center gap-1">
                Cadastre-se <span aria-hidden>→</span>
              </Link>
            </p>

            {/* Links rodapé: Ajuda, Privacidade, Termos */}
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

function PasskeyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15 7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" />
      <path d="M12 12a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4Z" />
      <circle cx="12" cy="7" r="2" />
    </svg>
  )
}

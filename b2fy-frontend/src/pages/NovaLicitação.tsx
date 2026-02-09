import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { api } from '../services/api'
import type { NichoResponse } from '../types/api'
import type { NovaLicitacaoRequest } from '../types/api'

const MIN_DAYS = 3

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function NovaLicitação() {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataFechamento, setDataFechamento] = useState(toISODate(addDays(new Date(), MIN_DAYS)))
  const [nichos, setNichos] = useState<string[]>([])
  const [nichoInput, setNichoInput] = useState('')
  const [nichosDisponiveis, setNichosDisponiveis] = useState<NichoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api.get<NichoResponse[]>('/nichos').then(setNichosDisponiveis).catch(() => {})
  }, [])

  const minData = toISODate(addDays(new Date(), MIN_DAYS))

  function addNicho() {
    const n = nichoInput.trim()
    if (n && !nichos.includes(n)) {
      setNichos([...nichos, n])
      setNichoInput('')
    }
  }

  function toggleNicho(nome: string) {
    setNichos((prev) => (prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (nichos.length === 0) {
      setError('Selecione pelo menos um nicho.')
      return
    }
    setLoading(true)
    const data: NovaLicitacaoRequest = {
      nome,
      descricaoProdutosServicos: descricao || undefined,
      dataFechamento,
      nichos,
    }
    try {
      await api.post('/licitacoes', data)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar licitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Nova licitação</h1>
      <Card className="max-w-2xl shadow-[var(--shadow)]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Nome da licitação" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: LICITAÇÃO CANETAS" required />
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Descrição dos produtos/serviços desejados</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder="Descreva o que você precisa..."
            />
          </div>
          <Input
            label="Data de fechamento"
            type="date"
            value={dataFechamento}
            onChange={(e) => setDataFechamento(e.target.value)}
            min={minData}
            required
          />
          <p className="text-sm text-[var(--color-text-muted)]">Mínimo de {MIN_DAYS} dias a partir de hoje.</p>
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Nichos *</label>
            <div className="flex flex-wrap gap-2">
              {nichosDisponiveis.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNicho(n.nome)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${nichos.includes(n.nome) ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-pale)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/30'}`}
                >
                  {n.nome}
                </button>
              ))}
            </div>
            {nichos.length > 0 && <p className="mt-2 text-sm text-[var(--color-text-muted)]">Selecionados: {nichos.join(', ')}</p>}
          </div>
          {error && <p className="text-sm font-medium text-[var(--color-error)] bg-[var(--color-error)]/10 px-3 py-2 rounded-[var(--radius-sm)]">{error}</p>}
          <div className="flex gap-3">
            <Button type="submit" disabled={loading} variant="secondary">
              {loading ? 'Criando...' : 'Criar licitação'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardTitle, CardContent } from '../components/ui/Card'
import { api } from '../services/api'
import type { LicitacaoResponse } from '../types/api'

const faseLabel: Record<string, string> = {
  ABERTA: 'Aberta',
  SEGUNDA_FASE: 'Segunda fase',
  ENCERRADA: 'Encerrada',
}

const faseBadgeClass: Record<string, string> = {
  ABERTA: 'bg-[var(--color-primary-light)]/30 text-[var(--color-primary)]',
  SEGUNDA_FASE: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  ENCERRADA: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
}

export function HomeFornecedor() {
  const [licitacoes, setLicitacoes] = useState<LicitacaoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<LicitacaoResponse[]>('/licitacoes/fornecedor')
      .then(setLicitacoes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-[var(--color-text-muted)] font-medium">Carregando licitações...</div>
  if (error) return <p className="text-[var(--color-error)] font-medium bg-[var(--color-error)]/10 px-4 py-3 rounded-[var(--radius-sm)]">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Licitações disponíveis para você</h1>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {licitacoes.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <CardTitle className="text-xl">Nenhuma licitação no momento</CardTitle>
            <CardContent>
              <p className="text-[var(--color-text-muted)]">Quando houver licitações nos seus nichos, elas aparecerão aqui.</p>
            </CardContent>
          </Card>
        ) : (
          licitacoes.map((l) => (
            <Card
              key={l.id}
              className="cursor-pointer hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-lg)] transition-all"
              onClick={() => navigate(`/licitacao/${l.id}`)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-[var(--color-primary)]">{l.nome}</CardTitle>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${faseBadgeClass[l.fase] ?? 'bg-[var(--color-border)]'}`}>
                  {faseLabel[l.fase] ?? l.fase}
                </span>
              </div>
              <CardContent>
                <p className="text-sm text-[var(--color-text-muted)]">
                  <span className="font-semibold text-[var(--color-text)]">Empresa:</span> {l.empresaNome}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  <span className="font-semibold text-[var(--color-text)]">Fechamento:</span> {new Date(l.dataFechamento).toLocaleDateString('pt-BR')}
                </p>
                <Button
                  className="mt-4"
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/licitacao/${l.id}`)
                  }}
                >
                  Ver e enviar proposta
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

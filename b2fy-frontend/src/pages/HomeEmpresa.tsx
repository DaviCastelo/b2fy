import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

export function HomeEmpresa() {
  const [licitacoes, setLicitacoes] = useState<LicitacaoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get<LicitacaoResponse[]>('/licitacoes/empresa')
      .then(setLicitacoes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-[var(--color-text-muted)] font-medium">Carregando licitações...</div>
  if (error) return <p className="text-[var(--color-error)] font-medium bg-[var(--color-error)]/10 px-4 py-3 rounded-[var(--radius-sm)]">{error}</p>

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Dashboard — Minhas licitações</h1>
        <Button onClick={() => navigate('/agendar-licitacao')} className="whitespace-nowrap">
          Nova licitação
        </Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {licitacoes.length === 0 ? (
          <Card className="col-span-full p-8 text-center">
            <CardTitle className="text-xl">Nenhuma licitação</CardTitle>
            <CardContent>
              <p className="mb-6 text-[var(--color-text-muted)]">Você ainda não criou licitações. Clique em &quot;Nova licitação&quot; para começar.</p>
              <Button onClick={() => navigate('/agendar-licitacao')} variant="secondary">
                Nova licitação
              </Button>
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
                  <span className="font-semibold text-[var(--color-text)]">Fechamento:</span> {new Date(l.dataFechamento).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  {l.fase === 'ENCERRADA' && l.ganhadorNome
                    ? `Ganhador: ${l.ganhadorNome}`
                    : `${l.totalPropostasFaseAtual} proposta(s) na fase atual`}
                </p>
                <Link to={`/licitacao/${l.id}`} className="text-sm text-[var(--color-primary)] font-semibold mt-3 inline-flex items-center gap-1 hover:underline" onClick={(e) => e.stopPropagation()}>
                  Ver detalhes →
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

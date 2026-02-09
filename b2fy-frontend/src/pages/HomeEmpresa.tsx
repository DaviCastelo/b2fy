import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Recharts: tipos podem conflitar com React 18; overrides no package.json unificam @types/react
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Button } from '../components/ui/Button'
import { Card, CardTitle, CardContent } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { api } from '../services/api'
import type { DashboardEmpresaResponse, LicitacaoResponse } from '../types/api'

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

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const CORES_PIZZA = ['#2A676E', '#81BFB4', '#E78330', '#16a34a', '#5a6c6a', '#c5ddd9']

export function HomeEmpresa() {
  const [licitacoes, setLicitacoes] = useState<LicitacaoResponse[]>([])
  const [dashboard, setDashboard] = useState<DashboardEmpresaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalHistorico, setModalHistorico] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get<LicitacaoResponse[]>('/licitacoes/empresa'),
      api.get<DashboardEmpresaResponse>('/dashboard/empresa'),
    ])
      .then(([lics, dash]) => {
        setLicitacoes(lics)
        setDashboard(dash)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-[var(--color-text-muted)] font-medium">Carregando licitações...</div>
  if (error) return <p className="text-[var(--color-error)] font-medium bg-[var(--color-error)]/10 px-4 py-3 rounded-[var(--radius-sm)]">{error}</p>

  const dadosGraficoFases = dashboard
    ? [
        { nome: 'Finalizadas', quantidade: dashboard.encerradas, fill: 'var(--color-success)' },
        { nome: 'Segunda fase', quantidade: dashboard.segundaFase, fill: 'var(--color-accent)' },
        { nome: 'Abertas', quantidade: dashboard.abertas, fill: 'var(--color-primary)' },
        { nome: 'Atrasadas', quantidade: dashboard.atrasadas, fill: 'var(--color-error)' },
      ]
    : []

  const dadosGraficoNichos =
    dashboard?.porNicho.map((n, i) => ({ name: n.nichoNome, value: n.quantidade, fill: CORES_PIZZA[i % CORES_PIZZA.length] })) ?? []

  return (
    <div className="py-[10px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Dashboard — Minhas licitações</h1>
        <Button onClick={() => navigate('/agendar-licitacao')} className="whitespace-nowrap">
          Nova licitação
        </Button>
      </div>

      {dashboard && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Resumo</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card className="shadow-[var(--shadow)]">
              <CardTitle className="text-base">Licitações por fase</CardTitle>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosGraficoFases} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v: number | undefined) => [v ?? 0, 'Quantidade']} />
                      <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                        {dadosGraficoFases.map((entry) => (
                          <Cell key={entry.nome} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-2">Atrasadas = data de fechamento já passou e licitação não encerrada.</p>
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardTitle className="text-base">Licitações concluídas por nicho</CardTitle>
              <CardContent>
                {dadosGraficoNichos.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)] py-8 text-center">Nenhuma licitação encerrada por nicho ainda.</p>
                ) : (
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dadosGraficoNichos} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
                          {dadosGraficoNichos.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number | undefined) => [v ?? 0, 'Licitações']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-[var(--shadow)]">
              <CardTitle className="text-base">Gasto no mês vigente</CardTitle>
              <CardContent>
                <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">
                  R$ {(dashboard.gastoMesAtual ?? 0).toFixed(2).replace('.', ',')}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">Somente licitações finalizadas (valor já com 10% da plataforma). Zera no dia 1º de cada mês.</p>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setModalHistorico(true)}>
                  Histórico de gastos
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <h2 className="text-lg font-bold text-[var(--color-primary)] mb-4">Minhas licitações</h2>
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

      <Modal open={modalHistorico} onClose={() => setModalHistorico(false)} title="Histórico de gastos" footer={<Button onClick={() => setModalHistorico(false)}>Fechar</Button>}>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">Valor total gasto (com 10% da plataforma) por mês/ano.</p>
        {dashboard?.historicoGastos && dashboard.historicoGastos.length > 0 ? (
          <ul className="space-y-2 max-h-[300px] overflow-y-auto">
            {dashboard.historicoGastos.map((h) => (
              <li key={`${h.ano}-${h.mes}`} className="flex justify-between items-center py-2 border-b border-[var(--color-border)] last:border-0">
                <span className="font-medium text-[var(--color-text)]">
                  {MESES[h.mes - 1]} / {h.ano}
                </span>
                <span className="font-semibold text-[var(--color-primary)]">R$ {(h.valor ?? 0).toFixed(2).replace('.', ',')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)] py-4">Nenhum gasto registrado em meses anteriores.</p>
        )}
      </Modal>
    </div>
  )
}

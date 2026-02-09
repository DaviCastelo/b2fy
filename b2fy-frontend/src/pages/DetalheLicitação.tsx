import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardTitle, CardContent } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import type { LicitacaoResponse, NichoResponse, PropostaResponse } from '../types/api'
import type { NovaPropostaRequest } from '../types/api'

const MIN_DAYS = 3

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const faseLabel: Record<string, string> = {
  ABERTA: 'Aberta',
  SEGUNDA_FASE: 'Segunda fase',
  ENCERRADA: 'Encerrada',
}

export function DetalheLicitação() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isEmpresa, isFornecedor } = useAuth()
  const [licitacao, setLicitacao] = useState<LicitacaoResponse | null>(null)
  const [propostas, setPropostas] = useState<PropostaResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalProposta, setModalProposta] = useState(false)
  const [descricaoProposta, setDescricaoProposta] = useState('')
  const [valorOrcamento, setValorOrcamento] = useState('')
  const [enviandoProposta, setEnviandoProposta] = useState(false)
  const [segundaFase, setSegundaFase] = useState(false)
  const [propostaIdsSegundaFase, setPropostaIdsSegundaFase] = useState<number[]>([])
  const [enviandoSegundaFase, setEnviandoSegundaFase] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [editNome, setEditNome] = useState('')
  const [editDescricao, setEditDescricao] = useState('')
  const [editDataFechamento, setEditDataFechamento] = useState('')
  const [editNichos, setEditNichos] = useState<string[]>([])
  const [nichosDisponiveis, setNichosDisponiveis] = useState<NichoResponse[]>([])
  const [salvandoEdicao, setSalvandoEdicao] = useState(false)
  const [propostaDetalheFornecedor, setPropostaDetalheFornecedor] = useState<PropostaResponse | null>(null)
  const [toastPropostaEnviada, setToastPropostaEnviada] = useState(false)

  useEffect(() => {
    if (!id) return
    api
      .get<LicitacaoResponse>(`/licitacoes/${id}`)
      .then((l) => {
        setLicitacao(l)
        if (isEmpresa) {
          return api.get<PropostaResponse[]>(`/licitacoes/${id}/propostas`).then(setPropostas)
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [id, isEmpresa])

  useEffect(() => {
    if (modalEditar) {
      api.get<NichoResponse[]>('/nichos').then(setNichosDisponiveis).catch(() => {})
    }
  }, [modalEditar])

  function abrirModalEditar() {
    if (!licitacao) return
    setEditNome(licitacao.nome)
    setEditDescricao(licitacao.descricaoProdutosServicos ?? '')
    setEditDataFechamento(licitacao.dataFechamento.slice(0, 10))
    setEditNichos([...licitacao.nichos])
    setModalEditar(true)
  }

  function toggleNichoEditar(nome: string) {
    setEditNichos((prev) => (prev.includes(nome) ? prev.filter((x) => x !== nome) : [...prev, nome]))
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault()
    if (!id || editNichos.length === 0) return
    setSalvandoEdicao(true)
    try {
      await api.put(`/licitacoes/${id}`, {
        nome: editNome,
        descricaoProdutosServicos: editDescricao || undefined,
        dataFechamento: editDataFechamento,
        nichos: editNichos,
      })
      const l = await api.get<LicitacaoResponse>(`/licitacoes/${id}`)
      setLicitacao(l)
      setModalEditar(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar alterações')
    } finally {
      setSalvandoEdicao(false)
    }
  }

  async function enviarProposta(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    const valor = parseFloat(valorOrcamento.replace(',', '.'))
    if (isNaN(valor) || valor <= 0) return
    setEnviandoProposta(true)
    const isSegundaFase = licitacao?.fase === 'SEGUNDA_FASE'
    const body: NovaPropostaRequest = {
      descricaoProdutosServicos: descricaoProposta || undefined,
      valorOrcamento: valor,
    }
    try {
      await api.post(`/licitacoes/${id}/propostas?segundaFase=${isSegundaFase}`, body)
      setModalProposta(false)
      setDescricaoProposta('')
      setValorOrcamento('')
      setToastPropostaEnviada(true)
      const l = await api.get<LicitacaoResponse>(`/licitacoes/${id}`)
      setLicitacao(l)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar proposta')
    } finally {
      setEnviandoProposta(false)
    }
  }

  async function definirGanhador(propostaId: number) {
    if (!id) return
    try {
      await api.post(`/licitacoes/${id}/ganhador`, { propostaId })
      const l = await api.get<LicitacaoResponse>(`/licitacoes/${id}`)
      setLicitacao(l)
      const list = await api.get<PropostaResponse[]>(`/licitacoes/${id}/propostas`)
      setPropostas(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao definir ganhador')
    }
  }

  async function irParaSegundaFase() {
    if (!id || propostaIdsSegundaFase.length === 0) return
    setEnviandoSegundaFase(true)
    try {
      await api.post(`/licitacoes/${id}/segunda-fase`, { propostaIds: propostaIdsSegundaFase })
      const l = await api.get<LicitacaoResponse>(`/licitacoes/${id}`)
      setLicitacao(l)
      const list = await api.get<PropostaResponse[]>(`/licitacoes/${id}/propostas`)
      setPropostas(list)
      setSegundaFase(false)
      setPropostaIdsSegundaFase([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao avançar para segunda fase')
    } finally {
      setEnviandoSegundaFase(false)
    }
  }

  function togglePropostaSegundaFase(propostaId: number) {
    setPropostaIdsSegundaFase((prev) => (prev.includes(propostaId) ? prev.filter((x) => x !== propostaId) : [...prev, propostaId]))
  }

  if (loading || !licitacao) return <div className="text-[var(--color-text-muted)]">Carregando...</div>
  if (error) return <p className="text-[var(--color-error)]">{error}</p>

  const podeEnviarProposta = isFornecedor && (licitacao.fase === 'ABERTA' || licitacao.fase === 'SEGUNDA_FASE') && licitacao.fase !== 'ENCERRADA'
  const faseAtualPropostas = propostas

  return (
    <div>
      <div className="mb-4">
        <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-[var(--color-primary)] hover:underline">
          ← Voltar
        </button>
      </div>
      <Card className="mb-6 shadow-[var(--shadow)]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle>{licitacao.nome}</CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            {user?.id === licitacao.empresaId && licitacao.fase === 'ABERTA' && (
              <Button size="sm" variant="outline" onClick={abrirModalEditar}>
                Editar
              </Button>
            )}
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            licitacao.fase === 'ENCERRADA' ? 'bg-[var(--color-success)]/20 text-[var(--color-success)]' :
            licitacao.fase === 'SEGUNDA_FASE' ? 'bg-[var(--color-accent-light)] text-[var(--color-accent)]' :
            'bg-[var(--color-primary-light)]/30 text-[var(--color-primary)]'
          }`}>
            {faseLabel[licitacao.fase] ?? licitacao.fase}
            </span>
          </div>
        </div>
        <CardContent>
          <p className="text-sm text-[var(--color-text-muted)]"><span className="font-semibold text-[var(--color-text)]">Data de fechamento:</span> {new Date(licitacao.dataFechamento).toLocaleDateString('pt-BR')}</p>
          {licitacao.descricaoProdutosServicos && (
            <p className="text-sm mt-2"><strong>Descrição:</strong> {licitacao.descricaoProdutosServicos}</p>
          )}
          {licitacao.ganhadorNome && <p className="text-sm text-[var(--color-success)]"><strong>Ganhador:</strong> {licitacao.ganhadorNome}</p>}
          {podeEnviarProposta && (
            <Button className="mt-4" variant="secondary" onClick={() => setModalProposta(true)}>
              {licitacao.fase === 'SEGUNDA_FASE' ? 'Enviar proposta 2ª fase' : 'Enviar proposta'}
            </Button>
          )}
        </CardContent>
      </Card>

      {isEmpresa && licitacao.fase !== 'ENCERRADA' && (
        <>
          <h2 className="text-lg font-bold text-[var(--color-primary)] mb-3">Propostas da fase atual</h2>
          {faseAtualPropostas.length === 0 ? (
            <p className="text-[var(--color-text-muted)]">Nenhuma proposta ainda.</p>
          ) : (
            <div className="space-y-4">
              {faseAtualPropostas.map((p) => (
                <Card key={p.id} className="border-l-4 border-l-[var(--color-primary)]">
                  <CardTitle>{p.fornecedorNome}</CardTitle>
                  <CardContent>
                    <p className="text-sm"><strong>Email:</strong> {p.fornecedorEmail}</p>
                    {p.descricaoProdutosServicos && <p className="text-sm"><strong>Descrição:</strong> {p.descricaoProdutosServicos}</p>}
                    <p className="text-sm"><strong>Valor (com taxa 10%):</strong> R$ {p.valorComTaxa.toFixed(2).replace('.', ',')}</p>
                    <Button size="sm" variant="outline" className="mb-2" onClick={() => setPropostaDetalheFornecedor(p)}>
                      Ver dados do fornecedor
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => definirGanhador(p.id)}>Definir como ganhador</Button>
                      {licitacao.fase === 'ABERTA' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePropostaSegundaFase(p.id)}
                        >
                          {propostaIdsSegundaFase.includes(p.id) ? 'Remover da 2ª fase' : 'Incluir na 2ª fase'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {licitacao.fase === 'ABERTA' && propostaIdsSegundaFase.length > 0 && (
                <div className="flex gap-2 items-center">
                  <Button onClick={irParaSegundaFase} disabled={enviandoSegundaFase}>
                    {enviandoSegundaFase ? 'Avançando...' : 'Ir para segunda fase'}
                  </Button>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {propostaIdsSegundaFase.length} proposta(s) selecionada(s)
                  </span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <Modal
        open={modalProposta}
        onClose={() => setModalProposta(false)}
        title={licitacao.fase === 'SEGUNDA_FASE' ? 'Enviar proposta (2ª fase)' : 'Enviar proposta'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalProposta(false)}>Cancelar</Button>
            <Button type="submit" form="form-proposta" disabled={enviandoProposta}>Enviar</Button>
          </>
        }
      >
        <form id="form-proposta" onSubmit={enviarProposta} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Descrição dos produtos/serviços</label>
            <textarea
              value={descricaoProposta}
              onChange={(e) => setDescricaoProposta(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder="Descreva o que você oferece..."
            />
          </div>
          <Input
            label="Valor do orçamento (R$)"
            type="text"
            value={valorOrcamento}
            onChange={(e) => setValorOrcamento(e.target.value)}
            placeholder="0,00"
            required
          />
          <p className="text-xs text-[var(--color-text-muted)]">Será acrescentado 10% de taxa da plataforma ao valor final.</p>
        </form>
      </Modal>

      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar licitação"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalEditar(false)}>Cancelar</Button>
            <Button type="submit" form="form-editar-licitacao" disabled={salvandoEdicao}>
              {salvandoEdicao ? 'Salvando...' : 'Salvar'}
            </Button>
          </>
        }
      >
        <form id="form-editar-licitacao" onSubmit={salvarEdicao} className="space-y-4">
          <Input
            label="Nome da licitação"
            value={editNome}
            onChange={(e) => setEditNome(e.target.value)}
            placeholder="Ex: LICITAÇÃO CANETAS"
            required
          />
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Descrição dos produtos/serviços desejados</label>
            <textarea
              value={editDescricao}
              onChange={(e) => setEditDescricao(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder="Descreva o que você precisa..."
            />
          </div>
          <Input
            label="Data de fechamento"
            type="date"
            value={editDataFechamento}
            onChange={(e) => setEditDataFechamento(e.target.value)}
            min={toISODate(addDays(new Date(), MIN_DAYS))}
            required
          />
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text)] mb-2">Nichos *</label>
            <div className="flex flex-wrap gap-2">
              {nichosDisponiveis.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNichoEditar(n.nome)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-colors ${editNichos.includes(n.nome) ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary-pale)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]/30'}`}
                >
                  {n.nome}
                </button>
              ))}
            </div>
            {editNichos.length > 0 && <p className="mt-2 text-sm text-[var(--color-text-muted)]">Selecionados: {editNichos.join(', ')}</p>}
          </div>
        </form>
      </Modal>

      <Modal
        open={!!propostaDetalheFornecedor}
        onClose={() => setPropostaDetalheFornecedor(null)}
        title="Detalhes do fornecedor"
      >
        {propostaDetalheFornecedor && (
          <div className="space-y-3 text-sm">
            <p><strong>Nome:</strong> {propostaDetalheFornecedor.fornecedorNome}</p>
            <p><strong>CPF/CNPJ:</strong> {(propostaDetalheFornecedor.fornecedorCpfOuCnpj?.trim()) || 'Não informado'}</p>
            <p><strong>Endereço:</strong> {(propostaDetalheFornecedor.fornecedorEndereco?.trim()) || 'Não informado'}</p>
            <p><strong>Email:</strong> {propostaDetalheFornecedor.fornecedorEmail}</p>
            <p><strong>Telefone:</strong> {(propostaDetalheFornecedor.fornecedorTelefone?.trim()) || 'Não informado'}</p>
            <div className="pt-2">
              <Button size="sm" onClick={() => setPropostaDetalheFornecedor(null)}>Fechar</Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast
        message="Proposta enviada"
        visible={toastPropostaEnviada}
        onClose={() => setToastPropostaEnviada(false)}
        duration={3000}
        type="success"
      />
    </div>
  )
}

export type TipoUsuario = 'EMPRESA' | 'FORNECEDOR'
export type FaseLicitacao = 'ABERTA' | 'SEGUNDA_FASE' | 'ENCERRADA'
export type FaseProposta = 'FASE_1' | 'FASE_2'
export type StatusProposta = 'ENVIADA' | 'SELECIONADA_2FASE' | 'GANHADORA'

export interface LoginRequest {
  cpfOuCnpj: string
  senha: string
}

export interface LoginResponse {
  token: string
  id: number
  email: string
  nome: string
  tipo: TipoUsuario
  fotoPerfilUrl: string | null
  nichos: string[]
}

export interface RegistroRequest {
  tipo: TipoUsuario
  cpfOuCnpj: string
  email: string
  senha: string
  telefone?: string
  nome: string
  cep?: string
  endereco?: string
  estado?: string
  nichos: string[]
}

export interface UsuarioResponse {
  id: number
  tipo: TipoUsuario
  email: string
  telefone: string | null
  nome: string
  cep: string | null
  endereco: string | null
  estado: string | null
  fotoPerfilUrl: string | null
  nichos: string[]
}

export interface AtualizarPerfilRequest {
  senhaAtual: string
  email: string
  telefone?: string
  nome: string
  cep?: string
  endereco?: string
  estado?: string
  nichos?: string[]
  fotoPerfilUrl?: string
}

export interface LicitacaoResponse {
  id: number
  nome: string
  descricaoProdutosServicos: string | null
  dataFechamento: string
  fase: FaseLicitacao
  empresaId: number
  empresaNome: string
  ganhadorId: number | null
  ganhadorNome: string | null
  createdAt: string
  nichos: string[]
  totalPropostasFaseAtual: number
}

export interface PropostaResponse {
  id: number
  fornecedorId: number
  fornecedorNome: string
  fornecedorEmail: string
  fase: FaseProposta
  descricaoProdutosServicos: string | null
  valorOrcamento: number
  valorComTaxa: number
  status: StatusProposta
  createdAt: string
}

export interface NichoResponse {
  id: number
  nome: string
}

export interface NovaLicitacaoRequest {
  nome: string
  descricaoProdutosServicos?: string
  dataFechamento: string
  nichos: string[]
}

export interface NovaPropostaRequest {
  descricaoProdutosServicos?: string
  valorOrcamento: number
}

export type TipoNotificacao = 'LICITACAO_ABERTA' | 'SELECIONADO_2FASE' | 'GANHADOR'

export interface NotificacaoResponse {
  id: number
  licitacaoId: number
  licitacaoNome: string
  tipo: TipoNotificacao
  mensagem: string
  lida: boolean
  createdAt: string
}

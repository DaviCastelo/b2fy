package com.b2fy.backend.service;

import com.b2fy.backend.domain.*;
import com.b2fy.backend.dto.request.NovaLicitacaoRequest;
import com.b2fy.backend.dto.response.LicitacaoResponse;
import com.b2fy.backend.dto.response.PropostaResponse;
import com.b2fy.backend.exception.BusinessException;
import com.b2fy.backend.repository.LicitacaoRepository;
import com.b2fy.backend.repository.NichoRepository;
import com.b2fy.backend.repository.PropostaRepository;
import com.b2fy.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LicitacaoService {

    private final LicitacaoRepository licitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PropostaRepository propostaRepository;
    private final NichoRepository nichoRepository;
    private final EmailService emailService;
    private final NotificacaoService notificacaoService;

    @Value("${b2fy.licitacao.dias-minimos-fechamento:3}")
    private int diasMinimosFechamento;

    public LicitacaoService(
        LicitacaoRepository licitacaoRepository,
        UsuarioRepository usuarioRepository,
        PropostaRepository propostaRepository,
        NichoRepository nichoRepository,
        EmailService emailService,
        NotificacaoService notificacaoService
    ) {
        this.licitacaoRepository = licitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.propostaRepository = propostaRepository;
        this.nichoRepository = nichoRepository;
        this.emailService = emailService;
        this.notificacaoService = notificacaoService;
    }

    @Transactional
    public LicitacaoResponse criar(NovaLicitacaoRequest request) {
        Long empresaId = UsuarioService.getCurrentUserId();
        Usuario empresa = usuarioRepository.findById(empresaId).orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        if (empresa.getTipo() != TipoUsuario.EMPRESA) {
            throw new BusinessException("Apenas empresas podem criar licitações.");
        }
        LocalDate minData = LocalDate.now().plusDays(diasMinimosFechamento);
        if (request.dataFechamento().isBefore(minData)) {
            throw new BusinessException("Data de fechamento deve ser no mínimo " + diasMinimosFechamento + " dias a partir de hoje.");
        }
        Set<Nicho> nichos = new java.util.HashSet<>();
        for (String nomeNicho : request.nichos()) {
            Nicho n = nichoRepository.findByNomeIgnoreCase(nomeNicho.trim())
                .orElseThrow(() -> new BusinessException("Nicho não encontrado: " + nomeNicho));
            nichos.add(n);
        }
        Licitacao licitacao = new Licitacao();
        licitacao.setEmpresa(empresa);
        licitacao.setNome(request.nome());
        licitacao.setDescricaoProdutosServicos(request.descricaoProdutosServicos());
        licitacao.setDataFechamento(request.dataFechamento());
        licitacao.setFase(FaseLicitacao.ABERTA);
        licitacao.setNichos(nichos);
        licitacao = licitacaoRepository.save(licitacao);
        String licitacaoNome = licitacao.getNome();
        String empresaNome = licitacao.getEmpresa().getNome();
        String empresaEndereco = licitacao.getEmpresa().getEndereco();
        String dataFechamentoStr = licitacao.getDataFechamento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        String descricao = licitacao.getDescricaoProdutosServicos();
        String mensagemAberta = "Licitação foi aberta pela empresa " + empresaNome + ", dê uma olhadinha!";
        List<String> nomesNicho = nichos.stream().map(Nicho::getNome).toList();
        List<Usuario> fornecedores = usuarioRepository.findFornecedoresByNichoNomes(TipoUsuario.FORNECEDOR, nomesNicho);
        for (Usuario fornecedor : fornecedores) {
            if (!fornecedor.getId().equals(empresaId)) {
                emailService.enviarNovaLicitacaoParaFornecedores(
                    fornecedor.getEmail(), fornecedor.getNome(), licitacaoNome,
                    descricao != null ? descricao : "-", empresaNome,
                    empresaEndereco != null ? empresaEndereco : "-", dataFechamentoStr
                );
                notificacaoService.criarLicitacaoAberta(fornecedor, licitacao, mensagemAberta);
            }
        }
        return toResponse(licitacao);
    }

    @Transactional(readOnly = true)
    public List<LicitacaoResponse> listarPorEmpresa() {
        Long empresaId = UsuarioService.getCurrentUserId();
        List<Licitacao> list = licitacaoRepository.findByEmpresaIdOrderByCreatedAtDesc(empresaId);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LicitacaoResponse> listarPorFornecedor() {
        Long fornecedorId = UsuarioService.getCurrentUserId();
        List<Licitacao> list = licitacaoRepository.findLicitacoesByFornecedorNichos(fornecedorId);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LicitacaoResponse buscarPorId(Long id) {
        Licitacao licitacao = licitacaoRepository.findById(id).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        Long userId = UsuarioService.getCurrentUserId();
        if (licitacao.getEmpresa().getId().equals(userId)) {
            return toResponse(licitacao);
        }
        boolean fornecedorParticipa = licitacao.getNichos().stream()
            .anyMatch(n -> n.getUsuarios().stream().anyMatch(u -> u.getId().equals(userId)));
        if (!fornecedorParticipa) {
            throw new BusinessException("Licitação não encontrada ou sem permissão.");
        }
        return toResponse(licitacao);
    }

    @Transactional(readOnly = true)
    public List<PropostaResponse> listarPropostasDaFaseAtual(Long licitacaoId) {
        Licitacao licitacao = licitacaoRepository.findById(licitacaoId).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        if (!licitacao.getEmpresa().getId().equals(UsuarioService.getCurrentUserId())) {
            throw new BusinessException("Apenas a empresa dona da licitação pode ver as propostas.");
        }
        FaseProposta fase = licitacao.getFase() == FaseLicitacao.SEGUNDA_FASE ? FaseProposta.FASE_2 : FaseProposta.FASE_1;
        List<Proposta> propostas = propostaRepository.findByLicitacaoIdAndFase(licitacaoId, fase);
        return propostas.stream().map(this::toPropostaResponse).collect(Collectors.toList());
    }

    @Transactional
    public void definirGanhador(Long licitacaoId, Long propostaId) {
        Licitacao licitacao = licitacaoRepository.findById(licitacaoId).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        if (!licitacao.getEmpresa().getId().equals(UsuarioService.getCurrentUserId())) {
            throw new BusinessException("Apenas a empresa dona da licitação pode definir o ganhador.");
        }
        if (licitacao.getFase() == FaseLicitacao.ENCERRADA) {
            throw new BusinessException("Licitação já encerrada.");
        }
        Proposta proposta = propostaRepository.findById(propostaId).orElseThrow(() -> new BusinessException("Proposta não encontrada."));
        if (!proposta.getLicitacao().getId().equals(licitacaoId)) {
            throw new BusinessException("Proposta não pertence a esta licitação.");
        }
        FaseProposta faseAtual = licitacao.getFase() == FaseLicitacao.SEGUNDA_FASE ? FaseProposta.FASE_2 : FaseProposta.FASE_1;
        if (proposta.getFase() != faseAtual) {
            throw new BusinessException("Proposta não é da fase atual.");
        }
        licitacao.setFase(FaseLicitacao.ENCERRADA);
        licitacao.setGanhador(proposta.getFornecedor());
        licitacaoRepository.save(licitacao);
        proposta.setStatus(StatusProposta.GANHADORA);
        propostaRepository.save(proposta);
        String licitacaoNome = licitacao.getNome();
        String empresaNome = licitacao.getEmpresa().getNome();
        String fornecedorEmail = proposta.getFornecedor().getEmail();
        String fornecedorNome = proposta.getFornecedor().getNome();
        String mensagemGanhador = "Parabéns! Você foi o ganhador da licitação \"" + licitacaoNome + "\" da empresa " + empresaNome + ".";
        emailService.enviarGanhadorLicitacao(fornecedorEmail, fornecedorNome, licitacaoNome);
        notificacaoService.criarGanhador(proposta.getFornecedor(), licitacao, mensagemGanhador);
    }

    @Transactional
    public void irParaSegundaFase(Long licitacaoId, List<Long> propostaIds) {
        Licitacao licitacao = licitacaoRepository.findById(licitacaoId).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        if (!licitacao.getEmpresa().getId().equals(UsuarioService.getCurrentUserId())) {
            throw new BusinessException("Apenas a empresa dona da licitação pode avançar para a segunda fase.");
        }
        if (licitacao.getFase() != FaseLicitacao.ABERTA) {
            throw new BusinessException("Só é possível ir para a segunda fase quando a licitação está aberta.");
        }
        String licitacaoNome = licitacao.getNome();
        String mensagem2Fase = "Você foi selecionado para a segunda fase da licitação \"" + licitacaoNome + "\". Parabéns!";
        for (Long propostaId : propostaIds) {
            Proposta p = propostaRepository.findById(propostaId).orElseThrow(() -> new BusinessException("Proposta não encontrada."));
            if (!p.getLicitacao().getId().equals(licitacaoId) || p.getFase() != FaseProposta.FASE_1) continue;
            p.setStatus(StatusProposta.SELECIONADA_2FASE);
            propostaRepository.save(p);
            String fornecedorEmail = p.getFornecedor().getEmail();
            String fornecedorNome = p.getFornecedor().getNome();
            emailService.enviarSelecionadoSegundaFase(fornecedorEmail, fornecedorNome, licitacaoNome);
            notificacaoService.criarSelecionado2Fase(p.getFornecedor(), licitacao, mensagem2Fase);
        }
        licitacao.setFase(FaseLicitacao.SEGUNDA_FASE);
        licitacaoRepository.save(licitacao);
    }

    private LicitacaoResponse toResponse(Licitacao l) {
        FaseProposta faseProposta = l.getFase() == FaseLicitacao.SEGUNDA_FASE ? FaseProposta.FASE_2 : FaseProposta.FASE_1;
        int total = propostaRepository.findByLicitacaoIdAndFase(l.getId(), faseProposta).size();
        List<String> nichos = l.getNichos().stream().map(Nicho::getNome).collect(Collectors.toList());
        return new LicitacaoResponse(
            l.getId(),
            l.getNome(),
            l.getDescricaoProdutosServicos(),
            l.getDataFechamento(),
            l.getFase(),
            l.getEmpresa().getId(),
            l.getEmpresa().getNome(),
            l.getGanhador() != null ? l.getGanhador().getId() : null,
            l.getGanhador() != null ? l.getGanhador().getNome() : null,
            l.getCreatedAt(),
            nichos,
            total
        );
    }

    private PropostaResponse toPropostaResponse(Proposta p) {
        return new PropostaResponse(
            p.getId(),
            p.getFornecedor().getId(),
            p.getFornecedor().getNome(),
            p.getFornecedor().getEmail(),
            p.getFase(),
            p.getDescricaoProdutosServicos(),
            p.getValorOrcamento(),
            p.getValorComTaxa(),
            p.getStatus(),
            p.getCreatedAt()
        );
    }
}

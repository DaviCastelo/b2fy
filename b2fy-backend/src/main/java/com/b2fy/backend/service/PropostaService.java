package com.b2fy.backend.service;

import com.b2fy.backend.domain.*;
import com.b2fy.backend.dto.request.NovaPropostaRequest;
import com.b2fy.backend.dto.response.PropostaResponse;
import com.b2fy.backend.exception.BusinessException;
import com.b2fy.backend.repository.LicitacaoRepository;
import com.b2fy.backend.repository.PropostaRepository;
import com.b2fy.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropostaService {

    private final PropostaRepository propostaRepository;
    private final LicitacaoRepository licitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    @Value("${b2fy.taxa-plataforma:0.10}")
    private java.math.BigDecimal taxaPlataforma;

    public PropostaService(
        PropostaRepository propostaRepository,
        LicitacaoRepository licitacaoRepository,
        UsuarioRepository usuarioRepository,
        EmailService emailService
    ) {
        this.propostaRepository = propostaRepository;
        this.licitacaoRepository = licitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @Transactional
    public PropostaResponse enviar(Long licitacaoId, NovaPropostaRequest request, boolean segundaFase) {
        Long fornecedorId = UsuarioService.getCurrentUserId();
        Licitacao licitacao = licitacaoRepository.findById(licitacaoId).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        if (licitacao.getFase() == FaseLicitacao.ENCERRADA) {
            throw new BusinessException("Licitação já encerrada.");
        }
        FaseProposta fase = segundaFase ? FaseProposta.FASE_2 : FaseProposta.FASE_1;
        if (segundaFase && licitacao.getFase() != FaseLicitacao.SEGUNDA_FASE) {
            throw new BusinessException("Licitação não está na segunda fase.");
        }
        if (!segundaFase && licitacao.getFase() != FaseLicitacao.ABERTA) {
            throw new BusinessException("Licitação não está aberta para novas propostas.");
        }
        boolean fornecedorParticipa = licitacao.getNichos().stream()
            .anyMatch(n -> n.getUsuarios().stream().anyMatch(u -> u.getId().equals(fornecedorId)));
        if (!fornecedorParticipa) {
            throw new BusinessException("Seu perfil não atende aos nichos desta licitação.");
        }
        if (segundaFase) {
            boolean selecionado = propostaRepository.findByLicitacaoIdAndFase(licitacaoId, FaseProposta.FASE_1).stream()
                .anyMatch(p -> p.getFornecedor().getId().equals(fornecedorId) && p.getStatus() == StatusProposta.SELECIONADA_2FASE);
            if (!selecionado) {
                throw new BusinessException("Você não foi selecionado para a segunda fase.");
            }
        }
        Usuario fornecedor = usuarioRepository.findById(fornecedorId).orElseThrow(() -> new BusinessException("Fornecedor não encontrado."));
        if (propostaRepository.existsByLicitacaoIdAndFornecedorIdAndFase(licitacaoId, fornecedorId, fase)) {
            throw new BusinessException("Você já enviou proposta para esta fase. Edição não permitida nesta versão.");
        }
        BigDecimal valorOrcamento = request.valorOrcamento().setScale(2, RoundingMode.HALF_UP);
        BigDecimal valorComTaxa = valorOrcamento.multiply(BigDecimal.ONE.add(taxaPlataforma)).setScale(2, RoundingMode.HALF_UP);
        Proposta proposta = new Proposta();
        proposta.setLicitacao(licitacao);
        proposta.setFornecedor(fornecedor);
        proposta.setFase(fase);
        proposta.setDescricaoProdutosServicos(request.descricaoProdutosServicos());
        proposta.setValorOrcamento(valorOrcamento);
        proposta.setValorComTaxa(valorComTaxa);
        proposta.setStatus(StatusProposta.ENVIADA);
        proposta = propostaRepository.save(proposta);
        emailService.enviarRespostaFornecedorParaEmpresa(
            licitacao.getEmpresa(),
            fornecedor,
            licitacao,
            proposta.getDescricaoProdutosServicos(),
            valorComTaxa
        );
        return toResponse(proposta);
    }

    public List<PropostaResponse> listarPorLicitacao(Long licitacaoId) {
        Licitacao licitacao = licitacaoRepository.findById(licitacaoId).orElseThrow(() -> new BusinessException("Licitação não encontrada."));
        Long userId = UsuarioService.getCurrentUserId();
        if (!licitacao.getEmpresa().getId().equals(userId)) {
            throw new BusinessException("Apenas a empresa dona da licitação pode listar propostas.");
        }
        List<Proposta> propostas = propostaRepository.findByLicitacaoIdOrderByCreatedAtDesc(licitacaoId);
        return propostas.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PropostaResponse toResponse(Proposta p) {
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

package com.b2fy.backend.service;

import com.b2fy.backend.domain.*;
import com.b2fy.backend.dto.response.NotificacaoResponse;
import com.b2fy.backend.exception.BusinessException;
import com.b2fy.backend.repository.NotificacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;

    public NotificacaoService(NotificacaoRepository notificacaoRepository) {
        this.notificacaoRepository = notificacaoRepository;
    }

    @Transactional(readOnly = true)
    public List<NotificacaoResponse> listarPorUsuario() {
        Long userId = UsuarioService.getCurrentUserId();
        List<Notificacao> list = notificacaoRepository.findByUsuarioIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countNaoLidas() {
        Long userId = UsuarioService.getCurrentUserId();
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(userId);
    }

    @Transactional
    public void marcarComoLida(Long id) {
        Notificacao n = notificacaoRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Notificação não encontrada."));
        if (!n.getUsuario().getId().equals(UsuarioService.getCurrentUserId())) {
            throw new BusinessException("Notificação não encontrada.");
        }
        n.setLida(true);
        notificacaoRepository.save(n);
    }

    @Transactional
    public void criarLicitacaoAberta(Usuario fornecedor, Licitacao licitacao, String mensagem) {
        criar(fornecedor, licitacao, TipoNotificacao.LICITACAO_ABERTA, mensagem);
    }

    @Transactional
    public void criarSelecionado2Fase(Usuario fornecedor, Licitacao licitacao, String mensagem) {
        criar(fornecedor, licitacao, TipoNotificacao.SELECIONADO_2FASE, mensagem);
    }

    @Transactional
    public void criarGanhador(Usuario fornecedor, Licitacao licitacao, String mensagem) {
        criar(fornecedor, licitacao, TipoNotificacao.GANHADOR, mensagem);
    }

    private void criar(Usuario usuario, Licitacao licitacao, TipoNotificacao tipo, String mensagem) {
        Notificacao n = new Notificacao();
        n.setUsuario(usuario);
        n.setLicitacao(licitacao);
        n.setTipo(tipo);
        n.setMensagem(mensagem);
        notificacaoRepository.save(n);
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return new NotificacaoResponse(
            n.getId(),
            n.getLicitacao().getId(),
            n.getLicitacao().getNome(),
            n.getTipo(),
            n.getMensagem(),
            n.isLida(),
            n.getCreatedAt()
        );
    }
}

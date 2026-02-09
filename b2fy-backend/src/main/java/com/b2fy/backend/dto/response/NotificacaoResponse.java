package com.b2fy.backend.dto.response;

import com.b2fy.backend.domain.TipoNotificacao;

import java.time.Instant;

public record NotificacaoResponse(
    Long id,
    Long licitacaoId,
    String licitacaoNome,
    TipoNotificacao tipo,
    String mensagem,
    boolean lida,
    Instant createdAt
) {}

package com.b2fy.backend.dto.response;

import com.b2fy.backend.domain.FaseLicitacao;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record LicitacaoResponse(
    Long id,
    String nome,
    String descricaoProdutosServicos,
    LocalDate dataFechamento,
    FaseLicitacao fase,
    Long empresaId,
    String empresaNome,
    Long ganhadorId,
    String ganhadorNome,
    Instant createdAt,
    List<String> nichos,
    int totalPropostasFaseAtual
) {}

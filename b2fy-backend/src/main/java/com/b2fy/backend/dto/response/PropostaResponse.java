package com.b2fy.backend.dto.response;

import com.b2fy.backend.domain.FaseProposta;
import com.b2fy.backend.domain.StatusProposta;

import java.math.BigDecimal;
import java.time.Instant;

public record PropostaResponse(
    Long id,
    Long fornecedorId,
    String fornecedorNome,
    String fornecedorEmail,
    FaseProposta fase,
    String descricaoProdutosServicos,
    BigDecimal valorOrcamento,
    BigDecimal valorComTaxa,
    StatusProposta status,
    Instant createdAt
) {}

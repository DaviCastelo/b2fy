package com.b2fy.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record NovaPropostaRequest(
    @Size(max = 5000)
    String descricaoProdutosServicos,

    @NotNull(message = "Valor do orçamento é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser positivo")
    BigDecimal valorOrcamento
) {}

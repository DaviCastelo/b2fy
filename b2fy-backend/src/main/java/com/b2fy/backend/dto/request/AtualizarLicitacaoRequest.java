package com.b2fy.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record AtualizarLicitacaoRequest(
    @NotBlank(message = "Nome da licitação é obrigatório")
    @Size(max = 255)
    String nome,

    @Size(max = 5000)
    String descricaoProdutosServicos,

    @NotNull(message = "Data de fechamento é obrigatória")
    LocalDate dataFechamento,

    @NotNull(message = "Pelo menos um nicho é obrigatório")
    List<@NotBlank String> nichos
) {}

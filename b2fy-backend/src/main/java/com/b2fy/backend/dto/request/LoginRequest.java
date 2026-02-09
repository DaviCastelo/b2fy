package com.b2fy.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "CPF ou CNPJ é obrigatório")
    String cpfOuCnpj,

    @NotBlank(message = "Senha é obrigatória")
    String senha
) {}

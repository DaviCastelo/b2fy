package com.b2fy.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AtualizarPerfilRequest(
    @NotBlank(message = "Senha atual é obrigatória para confirmar edição")
    String senhaAtual,

    @NotBlank(message = "Email é obrigatório")
    @Email
    @Size(max = 255)
    String email,

    @Size(max = 20)
    String telefone,

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 255)
    String nome,

    @Size(max = 10)
    String cep,

    @Size(max = 500)
    String endereco,

    @Size(max = 2)
    String estado,

    List<@NotBlank String> nichos,

    @Size(max = 500)
    String fotoPerfilUrl
) {}

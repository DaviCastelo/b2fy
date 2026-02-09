package com.b2fy.backend.dto.request;

import com.b2fy.backend.domain.TipoUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record RegistroRequest(
    @NotNull(message = "Tipo de usuário é obrigatório")
    TipoUsuario tipo,

    @NotBlank(message = "CPF ou CNPJ é obrigatório")
    @Size(max = 18)
    String cpfOuCnpj,

    @NotBlank(message = "Email é obrigatório")
    @Email
    @Size(max = 255)
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 6, max = 100)
    String senha,

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

    @NotNull(message = "Pelo menos um nicho é obrigatório")
    List<@NotBlank String> nichos
) {}

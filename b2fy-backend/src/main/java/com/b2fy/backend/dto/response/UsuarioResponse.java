package com.b2fy.backend.dto.response;

import com.b2fy.backend.domain.TipoUsuario;

import java.util.List;

public record UsuarioResponse(
    Long id,
    TipoUsuario tipo,
    String email,
    String telefone,
    String nome,
    String cep,
    String endereco,
    String estado,
    String fotoPerfilUrl,
    List<String> nichos
) {}

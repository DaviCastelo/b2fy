package com.b2fy.backend.dto.response;

import com.b2fy.backend.domain.TipoUsuario;

import java.util.List;

public record LoginResponse(
    String token,
    Long id,
    String email,
    String nome,
    TipoUsuario tipo,
    String fotoPerfilUrl,
    List<String> nichos
) {}

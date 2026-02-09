package com.b2fy.backend.security;

import com.b2fy.backend.domain.TipoUsuario;

import java.util.List;

public record JwtClaims(Long userId, String email, TipoUsuario tipo, List<String> roles) {}

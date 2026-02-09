package com.b2fy.backend.security;

import com.b2fy.backend.domain.TipoUsuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtService(
        @Value("${b2fy.jwt.secret}") String secret,
        @Value("${b2fy.jwt.expiration-ms}") long expirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId, String email, TipoUsuario tipo) {
        String role = "ROLE_" + tipo.name();
        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("email", email)
            .claim("tipo", tipo.name())
            .claim("roles", List.of(role))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(secretKey)
            .compact();
    }

    public JwtClaims parseToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
        Long userId = Long.parseLong(claims.getSubject());
        String email = claims.get("email", String.class);
        TipoUsuario tipo = TipoUsuario.valueOf(claims.get("tipo", String.class));
        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);
        return new JwtClaims(userId, email, tipo, roles != null ? roles : List.of());
    }
}

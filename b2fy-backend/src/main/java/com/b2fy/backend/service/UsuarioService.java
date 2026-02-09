package com.b2fy.backend.service;

import com.b2fy.backend.domain.Nicho;
import com.b2fy.backend.domain.Usuario;
import com.b2fy.backend.dto.request.AtualizarPerfilRequest;
import com.b2fy.backend.dto.response.UsuarioResponse;
import com.b2fy.backend.exception.BusinessException;
import com.b2fy.backend.repository.NichoRepository;
import com.b2fy.backend.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final NichoRepository nichoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
        UsuarioRepository usuarioRepository,
        NichoRepository nichoRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.nichoRepository = nichoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Long id) return id;
        throw new BusinessException("Usuário não autenticado.");
    }

    public UsuarioResponse getPerfil() {
        Long userId = getCurrentUserId();
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        return toResponse(u);
    }

    @Transactional
    public UsuarioResponse atualizarPerfil(AtualizarPerfilRequest request) {
        Long userId = getCurrentUserId();
        Usuario u = usuarioRepository.findById(userId).orElseThrow(() -> new BusinessException("Usuário não encontrado."));
        if (!passwordEncoder.matches(request.senhaAtual(), u.getSenhaHash())) {
            throw new BusinessException("Senha atual incorreta.");
        }
        u.setEmail(request.email());
        u.setTelefone(request.telefone());
        u.setNome(request.nome());
        u.setCep(request.cep());
        u.setEndereco(request.endereco());
        u.setEstado(request.estado());
        u.setFotoPerfilUrl(request.fotoPerfilUrl());
        if (request.nichos() != null && !request.nichos().isEmpty()) {
            Set<Nicho> nichos = new HashSet<>();
            for (String nomeNicho : request.nichos()) {
                Nicho nicho = nichoRepository.findByNomeIgnoreCase(nomeNicho.trim())
                    .orElseGet(() -> {
                        Nicho novo = new Nicho();
                        novo.setNome(nomeNicho.trim());
                        return nichoRepository.save(novo);
                    });
                nichos.add(nicho);
            }
            u.setNichos(nichos);
        }
        u = usuarioRepository.save(u);
        return toResponse(u);
    }

    private UsuarioResponse toResponse(Usuario u) {
        List<String> nichos = u.getNichos().stream().map(Nicho::getNome).collect(Collectors.toList());
        return new UsuarioResponse(
            u.getId(),
            u.getTipo(),
            u.getEmail(),
            u.getTelefone(),
            u.getNome(),
            u.getCep(),
            u.getEndereco(),
            u.getEstado(),
            u.getFotoPerfilUrl(),
            nichos
        );
    }
}

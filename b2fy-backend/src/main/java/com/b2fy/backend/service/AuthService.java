package com.b2fy.backend.service;

import com.b2fy.backend.domain.Nicho;
import com.b2fy.backend.domain.TipoUsuario;
import com.b2fy.backend.domain.Usuario;
import com.b2fy.backend.dto.request.LoginRequest;
import com.b2fy.backend.dto.request.RegistroRequest;
import com.b2fy.backend.dto.response.LoginResponse;
import com.b2fy.backend.exception.BusinessException;
import com.b2fy.backend.repository.NichoRepository;
import com.b2fy.backend.repository.UsuarioRepository;
import com.b2fy.backend.security.JwtService;
import com.b2fy.backend.util.CpfCnpjUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final NichoRepository nichoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UsuarioRepository usuarioRepository,
        NichoRepository nichoRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.nichoRepository = nichoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        String cpfOuCnpj = CpfCnpjUtil.apenasDigitos(request.cpfOuCnpj());
        if (cpfOuCnpj == null || (!CpfCnpjUtil.isCpf(cpfOuCnpj) && !CpfCnpjUtil.isCnpj(cpfOuCnpj))) {
            throw new BusinessException("CPF ou CNPJ inválido.");
        }
        Usuario usuario = usuarioRepository.findByCpfOuCnpj(cpfOuCnpj)
            .orElseThrow(() -> new BusinessException("CPF/CNPJ ou senha inválidos."));
        if (!usuario.isAtivo()) {
            throw new BusinessException("Usuário inativo.");
        }
        if (!passwordEncoder.matches(request.senha(), usuario.getSenhaHash())) {
            throw new BusinessException("CPF/CNPJ ou senha inválidos.");
        }
        String token = jwtService.generateToken(usuario.getId(), usuario.getEmail(), usuario.getTipo());
        List<String> nichos = usuario.getNichos().stream().map(Nicho::getNome).toList();
        return new LoginResponse(
            token,
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNome(),
            usuario.getTipo(),
            usuario.getFotoPerfilUrl(),
            nichos
        );
    }

    @Transactional
    public LoginResponse registro(RegistroRequest request) {
        String cpfOuCnpj = CpfCnpjUtil.apenasDigitos(request.cpfOuCnpj());
        if (cpfOuCnpj == null || !CpfCnpjUtil.isValido(cpfOuCnpj)) {
            throw new BusinessException("CPF ou CNPJ inválido.");
        }
        if (usuarioRepository.existsByCpfOuCnpj(cpfOuCnpj)) {
            throw new BusinessException("CPF/CNPJ já cadastrado.");
        }
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado.");
        }
        Set<Nicho> nichos = new HashSet<>();
        for (String nomeNicho : request.nichos()) {
            Nicho n = nichoRepository.findByNomeIgnoreCase(nomeNicho.trim())
                .orElseGet(() -> {
                    Nicho novo = new Nicho();
                    novo.setNome(nomeNicho.trim());
                    return nichoRepository.save(novo);
                });
            nichos.add(n);
        }
        Usuario usuario = new Usuario();
        usuario.setTipo(request.tipo());
        usuario.setCpfOuCnpj(cpfOuCnpj);
        usuario.setEmail(request.email());
        usuario.setSenhaHash(passwordEncoder.encode(request.senha()));
        usuario.setTelefone(request.telefone());
        usuario.setNome(request.nome());
        usuario.setCep(request.cep());
        usuario.setEndereco(request.endereco());
        usuario.setEstado(request.estado());
        usuario.setNichos(nichos);
        usuario = usuarioRepository.save(usuario);
        String token = jwtService.generateToken(usuario.getId(), usuario.getEmail(), usuario.getTipo());
        List<String> nichosNomes = usuario.getNichos().stream().map(Nicho::getNome).toList();
        return new LoginResponse(
            token,
            usuario.getId(),
            usuario.getEmail(),
            usuario.getNome(),
            usuario.getTipo(),
            usuario.getFotoPerfilUrl(),
            nichosNomes
        );
    }
}

package com.b2fy.backend.controller;

import com.b2fy.backend.dto.request.AtualizarLicitacaoRequest;
import com.b2fy.backend.dto.request.NovaLicitacaoRequest;
import com.b2fy.backend.dto.response.LicitacaoResponse;
import com.b2fy.backend.dto.response.PropostaResponse;
import com.b2fy.backend.service.LicitacaoService;
import com.b2fy.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Licitação")
@RestController
@RequestMapping("/licitacoes")
@SecurityRequirement(name = "bearerAuth")
public class LicitacaoController {

    private final LicitacaoService licitacaoService;

    public LicitacaoController(LicitacaoService licitacaoService) {
        this.licitacaoService = licitacaoService;
    }

    @Operation(summary = "Criar nova licitação (empresa)")
    @PostMapping
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<LicitacaoResponse> criar(@Valid @RequestBody NovaLicitacaoRequest request) {
        return ResponseEntity.ok(licitacaoService.criar(request));
    }

    @Operation(summary = "Listar licitações da empresa (dashboard)")
    @GetMapping("/empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<LicitacaoResponse>> listarPorEmpresa() {
        return ResponseEntity.ok(licitacaoService.listarPorEmpresa());
    }

    @Operation(summary = "Listar licitações do fornecedor (home)")
    @GetMapping("/fornecedor")
    @PreAuthorize("hasRole('FORNECEDOR')")
    public ResponseEntity<List<LicitacaoResponse>> listarPorFornecedor() {
        return ResponseEntity.ok(licitacaoService.listarPorFornecedor());
    }

    @Operation(summary = "Buscar licitação por ID")
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<LicitacaoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(licitacaoService.buscarPorId(id));
    }

    @Operation(summary = "Editar licitação (empresa dona, apenas fase aberta)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<LicitacaoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody AtualizarLicitacaoRequest request) {
        return ResponseEntity.ok(licitacaoService.atualizar(id, request));
    }

    @Operation(summary = "Listar propostas da fase atual da licitação")
    @GetMapping("/{id}/propostas")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<PropostaResponse>> listarPropostas(@PathVariable Long id) {
        return ResponseEntity.ok(licitacaoService.listarPropostasDaFaseAtual(id));
    }

    @Operation(summary = "Definir ganhador da licitação")
    @PostMapping("/{id}/ganhador")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> definirGanhador(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long propostaId = body.get("propostaId");
        if (propostaId == null) {
            throw new IllegalArgumentException("propostaId é obrigatório");
        }
        licitacaoService.definirGanhador(id, propostaId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Avançar para segunda fase (selecionar propostas)")
    @PostMapping("/{id}/segunda-fase")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<Void> irParaSegundaFase(@PathVariable Long id, @RequestBody Map<String, List<Long>> body) {
        List<Long> propostaIds = body.get("propostaIds");
        if (propostaIds == null) propostaIds = List.of();
        licitacaoService.irParaSegundaFase(id, propostaIds);
        return ResponseEntity.noContent().build();
    }
}

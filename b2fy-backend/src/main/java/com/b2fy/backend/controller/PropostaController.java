package com.b2fy.backend.controller;

import com.b2fy.backend.dto.request.NovaPropostaRequest;
import com.b2fy.backend.dto.response.PropostaResponse;
import com.b2fy.backend.service.PropostaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Proposta")
@RestController
@RequestMapping("/licitacoes/{licitacaoId}/propostas")
@SecurityRequirement(name = "bearerAuth")
public class PropostaController {

    private final PropostaService propostaService;

    public PropostaController(PropostaService propostaService) {
        this.propostaService = propostaService;
    }

    @Operation(summary = "Enviar proposta (fornecedor) - fase 1 ou 2")
    @PostMapping
    @PreAuthorize("hasRole('FORNECEDOR')")
    public ResponseEntity<PropostaResponse> enviar(
        @PathVariable Long licitacaoId,
        @Valid @RequestBody NovaPropostaRequest request,
        @RequestParam(defaultValue = "false") boolean segundaFase
    ) {
        return ResponseEntity.ok(propostaService.enviar(licitacaoId, request, segundaFase));
    }

    @Operation(summary = "Listar todas as propostas da licitação (empresa)")
    @GetMapping("/todas")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<List<PropostaResponse>> listarTodas(@PathVariable Long licitacaoId) {
        return ResponseEntity.ok(propostaService.listarPorLicitacao(licitacaoId));
    }
}

package com.b2fy.backend.controller;

import com.b2fy.backend.dto.response.NotificacaoResponse;
import com.b2fy.backend.service.NotificacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Notificações")
@RestController
@RequestMapping("/notificacoes")
@SecurityRequirement(name = "bearerAuth")
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    public NotificacaoController(NotificacaoService notificacaoService) {
        this.notificacaoService = notificacaoService;
    }

    @Operation(summary = "Listar minhas notificações")
    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listar() {
        return ResponseEntity.ok(notificacaoService.listarPorUsuario());
    }

    @Operation(summary = "Quantidade de notificações não lidas")
    @GetMapping("/nao-lidas")
    public ResponseEntity<Map<String, Long>> countNaoLidas() {
        return ResponseEntity.ok(Map.of("count", notificacaoService.countNaoLidas()));
    }

    @Operation(summary = "Marcar notificação como lida")
    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Long id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }
}

package com.b2fy.backend.controller;

import com.b2fy.backend.dto.response.NichoResponse;
import com.b2fy.backend.repository.NichoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Nichos")
@RestController
@RequestMapping("/nichos")
@SecurityRequirement(name = "bearerAuth")
public class NichoController {

    private final NichoRepository nichoRepository;

    public NichoController(NichoRepository nichoRepository) {
        this.nichoRepository = nichoRepository;
    }

    @Operation(summary = "Listar todos os nichos cadastrados")
    @GetMapping
    public ResponseEntity<List<NichoResponse>> listar() {
        return ResponseEntity.ok(
            nichoRepository.findAll().stream()
                .map(n -> new NichoResponse(n.getId(), n.getNome()))
                .toList()
        );
    }
}

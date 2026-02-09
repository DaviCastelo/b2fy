package com.b2fy.backend.controller;

import com.b2fy.backend.dto.response.DashboardEmpresaResponse;
import com.b2fy.backend.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboard")
@RestController
@RequestMapping("/dashboard")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Operation(summary = "Dashboard da empresa (gráficos, gastos, histórico)")
    @GetMapping("/empresa")
    @PreAuthorize("hasRole('EMPRESA')")
    public ResponseEntity<DashboardEmpresaResponse> dashboardEmpresa() {
        return ResponseEntity.ok(dashboardService.dashboardEmpresa());
    }
}

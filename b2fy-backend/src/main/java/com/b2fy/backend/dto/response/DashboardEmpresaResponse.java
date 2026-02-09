package com.b2fy.backend.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record DashboardEmpresaResponse(
    long abertas,
    long segundaFase,
    long encerradas,
    long atrasadas,
    List<NichoConcluidoItem> porNicho,
    BigDecimal gastoMesAtual,
    List<GastoMesItem> historicoGastos
) {
    public record NichoConcluidoItem(String nichoNome, long quantidade) {}
    public record GastoMesItem(int ano, int mes, BigDecimal valor) {}
}

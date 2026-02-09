package com.b2fy.backend.service;

import com.b2fy.backend.domain.FaseLicitacao;
import com.b2fy.backend.domain.Nicho;
import com.b2fy.backend.domain.Proposta;
import com.b2fy.backend.domain.StatusProposta;
import com.b2fy.backend.dto.response.DashboardEmpresaResponse;
import com.b2fy.backend.repository.LicitacaoRepository;
import com.b2fy.backend.repository.PropostaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final LicitacaoRepository licitacaoRepository;
    private final PropostaRepository propostaRepository;

    public DashboardService(LicitacaoRepository licitacaoRepository, PropostaRepository propostaRepository) {
        this.licitacaoRepository = licitacaoRepository;
        this.propostaRepository = propostaRepository;
    }

    @Transactional(readOnly = true)
    public DashboardEmpresaResponse dashboardEmpresa() {
        Long empresaId = UsuarioService.getCurrentUserId();
        LocalDate hoje = LocalDate.now();

        long abertas = licitacaoRepository.countByEmpresaIdAndFase(empresaId, FaseLicitacao.ABERTA);
        long segundaFase = licitacaoRepository.countByEmpresaIdAndFase(empresaId, FaseLicitacao.SEGUNDA_FASE);
        long encerradas = licitacaoRepository.countByEmpresaIdAndFase(empresaId, FaseLicitacao.ENCERRADA);
        long atrasadas = licitacaoRepository.countByEmpresaIdAndDataFechamentoBeforeAndFaseNot(empresaId, hoje, FaseLicitacao.ENCERRADA);

        List<com.b2fy.backend.domain.Licitacao> licitacoesEncerradas = licitacaoRepository.findByEmpresaIdAndFaseEncerradaWithNichos(empresaId, FaseLicitacao.ENCERRADA);
        Map<String, Long> nichoCount = new HashMap<>();
        for (com.b2fy.backend.domain.Licitacao l : licitacoesEncerradas) {
            for (Nicho n : l.getNichos()) {
                nichoCount.merge(n.getNome(), 1L, Long::sum);
            }
        }
        List<DashboardEmpresaResponse.NichoConcluidoItem> porNicho = nichoCount.entrySet().stream()
            .map(e -> new DashboardEmpresaResponse.NichoConcluidoItem(e.getKey(), e.getValue()))
            .sorted(Comparator.comparing(DashboardEmpresaResponse.NichoConcluidoItem::nichoNome))
            .collect(Collectors.toList());

        ZonedDateTime inicioMes = hoje.withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime fimMes = inicioMes.plusMonths(1);
        BigDecimal gastoMesAtual = propostaRepository.sumValorComTaxaGanhadorasByEmpresaAndPeriod(
            empresaId, inicioMes.toInstant(), fimMes.toInstant()
        );
        if (gastoMesAtual == null) gastoMesAtual = BigDecimal.ZERO;

        List<Proposta> ganhadoras = propostaRepository.findByStatusAndLicitacaoEmpresaIdWithLicitacao(StatusProposta.GANHADORA, empresaId);
        Map<String, BigDecimal> gastoPorMes = new TreeMap<>(Comparator.reverseOrder());
        for (Proposta p : ganhadoras) {
            Instant enc = p.getLicitacao().getEncerradaEm();
            if (enc == null) continue;
            LocalDate d = enc.atZone(ZoneId.systemDefault()).toLocalDate();
            String key = d.getYear() + "-" + String.format("%02d", d.getMonthValue());
            gastoPorMes.merge(key, p.getValorComTaxa(), BigDecimal::add);
        }
        List<DashboardEmpresaResponse.GastoMesItem> historicoGastos = gastoPorMes.entrySet().stream()
            .map(e -> {
                String[] parts = e.getKey().split("-");
                int ano = Integer.parseInt(parts[0]);
                int mes = Integer.parseInt(parts[1]);
                return new DashboardEmpresaResponse.GastoMesItem(ano, mes, e.getValue());
            })
            .collect(Collectors.toList());

        return new DashboardEmpresaResponse(abertas, segundaFase, encerradas, atrasadas, porNicho, gastoMesAtual, historicoGastos);
    }
}

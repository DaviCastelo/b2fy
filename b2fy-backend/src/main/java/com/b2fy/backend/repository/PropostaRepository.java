package com.b2fy.backend.repository;

import com.b2fy.backend.domain.FaseProposta;
import com.b2fy.backend.domain.Proposta;
import com.b2fy.backend.domain.StatusProposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropostaRepository extends JpaRepository<Proposta, Long> {

    List<Proposta> findByLicitacaoIdOrderByCreatedAtDesc(Long licitacaoId);

    List<Proposta> findByLicitacaoIdAndFase(Long licitacaoId, FaseProposta fase);

    @Query("SELECT p FROM Proposta p JOIN FETCH p.fornecedor WHERE p.licitacao.id = :licitacaoId AND p.fase = :fase")
    List<Proposta> findByLicitacaoIdAndFaseWithFornecedor(@Param("licitacaoId") Long licitacaoId, @Param("fase") FaseProposta fase);

    @Query("SELECT COALESCE(SUM(p.valorComTaxa), 0) FROM Proposta p WHERE p.status = 'GANHADORA' AND p.licitacao.empresa.id = :empresaId AND p.licitacao.encerradaEm >= :inicio AND p.licitacao.encerradaEm < :fim")
    BigDecimal sumValorComTaxaGanhadorasByEmpresaAndPeriod(@Param("empresaId") Long empresaId, @Param("inicio") Instant inicio, @Param("fim") Instant fim);

    @Query("SELECT p FROM Proposta p JOIN FETCH p.licitacao WHERE p.status = :status AND p.licitacao.empresa.id = :empresaId AND p.licitacao.encerradaEm IS NOT NULL")
    List<Proposta> findByStatusAndLicitacaoEmpresaIdWithLicitacao(@Param("status") StatusProposta status, @Param("empresaId") Long empresaId);

    @Query("SELECT p FROM Proposta p WHERE p.licitacao.id = :licitacaoId AND p.fornecedor.id = :fornecedorId AND p.fase = :fase")
    Optional<Proposta> findByLicitacaoAndFornecedorAndFase(
        @Param("licitacaoId") Long licitacaoId,
        @Param("fornecedorId") Long fornecedorId,
        @Param("fase") FaseProposta fase
    );

    boolean existsByLicitacaoIdAndFornecedorIdAndFase(Long licitacaoId, Long fornecedorId, FaseProposta fase);
}

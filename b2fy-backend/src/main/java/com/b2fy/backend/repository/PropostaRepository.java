package com.b2fy.backend.repository;

import com.b2fy.backend.domain.FaseProposta;
import com.b2fy.backend.domain.Proposta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropostaRepository extends JpaRepository<Proposta, Long> {

    List<Proposta> findByLicitacaoIdOrderByCreatedAtDesc(Long licitacaoId);

    List<Proposta> findByLicitacaoIdAndFase(Long licitacaoId, FaseProposta fase);

    @Query("SELECT p FROM Proposta p WHERE p.licitacao.id = :licitacaoId AND p.fornecedor.id = :fornecedorId AND p.fase = :fase")
    Optional<Proposta> findByLicitacaoAndFornecedorAndFase(
        @Param("licitacaoId") Long licitacaoId,
        @Param("fornecedorId") Long fornecedorId,
        @Param("fase") FaseProposta fase
    );

    boolean existsByLicitacaoIdAndFornecedorIdAndFase(Long licitacaoId, Long fornecedorId, FaseProposta fase);
}

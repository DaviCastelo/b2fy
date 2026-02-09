package com.b2fy.backend.repository;

import com.b2fy.backend.domain.FaseLicitacao;
import com.b2fy.backend.domain.Licitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LicitacaoRepository extends JpaRepository<Licitacao, Long> {

    List<Licitacao> findByEmpresaIdOrderByCreatedAtDesc(Long empresaId);

    long countByEmpresaIdAndFase(Long empresaId, FaseLicitacao fase);

    long countByEmpresaIdAndDataFechamentoBeforeAndFaseNot(Long empresaId, LocalDate data, FaseLicitacao fase);

    @Query("SELECT l FROM Licitacao l LEFT JOIN FETCH l.nichos WHERE l.empresa.id = :empresaId AND l.fase = :fase AND l.encerradaEm IS NOT NULL")
    List<Licitacao> findByEmpresaIdAndFaseEncerradaWithNichos(@Param("empresaId") Long empresaId, @Param("fase") FaseLicitacao fase);

    @Query("SELECT DISTINCT l FROM Licitacao l JOIN l.nichos n JOIN n.usuarios u WHERE u.id = :fornecedorId ORDER BY l.createdAt DESC")
    List<Licitacao> findLicitacoesByFornecedorNichos(@Param("fornecedorId") Long fornecedorId);
}

package com.b2fy.backend.repository;

import com.b2fy.backend.domain.FaseLicitacao;
import com.b2fy.backend.domain.Licitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicitacaoRepository extends JpaRepository<Licitacao, Long> {

    List<Licitacao> findByEmpresaIdOrderByCreatedAtDesc(Long empresaId);

    @Query("SELECT DISTINCT l FROM Licitacao l JOIN l.nichos n JOIN n.usuarios u WHERE u.id = :fornecedorId ORDER BY l.createdAt DESC")
    List<Licitacao> findLicitacoesByFornecedorNichos(@Param("fornecedorId") Long fornecedorId);
}

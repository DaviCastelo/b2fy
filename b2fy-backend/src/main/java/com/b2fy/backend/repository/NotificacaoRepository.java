package com.b2fy.backend.repository;

import com.b2fy.backend.domain.Notificacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    @Query("SELECT n FROM Notificacao n JOIN FETCH n.licitacao WHERE n.usuario.id = :usuarioId ORDER BY n.createdAt DESC")
    List<Notificacao> findByUsuarioIdOrderByCreatedAtDesc(@Param("usuarioId") Long usuarioId);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);
}

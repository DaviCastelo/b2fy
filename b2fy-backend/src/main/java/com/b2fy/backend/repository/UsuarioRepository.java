package com.b2fy.backend.repository;

import com.b2fy.backend.domain.TipoUsuario;
import com.b2fy.backend.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByCpfOuCnpj(String cpfOuCnpj);

    Optional<Usuario> findByEmail(String email);

    boolean existsByCpfOuCnpj(String cpfOuCnpj);

    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM Usuario u JOIN u.nichos n WHERE u.tipo = :tipo AND u.ativo = true AND n.nome IN :nomes")
    List<Usuario> findFornecedoresByNichoNomes(@Param("tipo") TipoUsuario tipo, @Param("nomes") List<String> nomesNicho);
}

package com.b2fy.backend.repository;

import com.b2fy.backend.domain.Nicho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface NichoRepository extends JpaRepository<Nicho, Long> {

    Optional<Nicho> findByNomeIgnoreCase(String nome);

    List<Nicho> findByNomeIgnoreCaseIn(Set<String> nomes);

    boolean existsByNomeIgnoreCase(String nome);
}

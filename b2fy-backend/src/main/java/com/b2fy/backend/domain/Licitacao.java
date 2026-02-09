package com.b2fy.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "licitacao", indexes = {
    @Index(name = "idx_licitacao_empresa", columnList = "empresa_id"),
    @Index(name = "idx_licitacao_fase", columnList = "fase"),
    @Index(name = "idx_licitacao_data_fechamento", columnList = "dataFechamento")
})
public class Licitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id", nullable = false)
    private Usuario empresa;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricaoProdutosServicos;

    @NotNull
    @Column(nullable = false)
    private LocalDate dataFechamento;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FaseLicitacao fase = FaseLicitacao.ABERTA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ganhador_id")
    private Usuario ganhador;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "licitacao_nicho",
        joinColumns = @JoinColumn(name = "licitacao_id"),
        inverseJoinColumns = @JoinColumn(name = "nicho_id")
    )
    private Set<Nicho> nichos = new HashSet<>();

    @OneToMany(mappedBy = "licitacao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Proposta> propostas = new ArrayList<>();

    public Set<Nicho> getNichos() {
        return nichos;
    }

    public void setNichos(Set<Nicho> nichos) {
        this.nichos = nichos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Usuario empresa) {
        this.empresa = empresa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricaoProdutosServicos() {
        return descricaoProdutosServicos;
    }

    public void setDescricaoProdutosServicos(String descricaoProdutosServicos) {
        this.descricaoProdutosServicos = descricaoProdutosServicos;
    }

    public LocalDate getDataFechamento() {
        return dataFechamento;
    }

    public void setDataFechamento(LocalDate dataFechamento) {
        this.dataFechamento = dataFechamento;
    }

    public FaseLicitacao getFase() {
        return fase;
    }

    public void setFase(FaseLicitacao fase) {
        this.fase = fase;
    }

    public Usuario getGanhador() {
        return ganhador;
    }

    public void setGanhador(Usuario ganhador) {
        this.ganhador = ganhador;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<Proposta> getPropostas() {
        return propostas;
    }

    public void setPropostas(List<Proposta> propostas) {
        this.propostas = propostas;
    }
}

package com.b2fy.backend.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "proposta", indexes = {
    @Index(name = "idx_proposta_licitacao", columnList = "licitacao_id"),
    @Index(name = "idx_proposta_fornecedor", columnList = "fornecedor_id"),
    @Index(name = "idx_proposta_licitacao_fase", columnList = "licitacao_id, fase")
})
public class Proposta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "licitacao_id", nullable = false)
    private Licitacao licitacao;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fornecedor_id", nullable = false)
    private Usuario fornecedor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private FaseProposta fase;

    @Column(columnDefinition = "TEXT")
    private String descricaoProdutosServicos;

    @NotNull
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorOrcamento;

    @NotNull
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal valorComTaxa;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusProposta status = StatusProposta.ENVIADA;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Licitacao getLicitacao() {
        return licitacao;
    }

    public void setLicitacao(Licitacao licitacao) {
        this.licitacao = licitacao;
    }

    public Usuario getFornecedor() {
        return fornecedor;
    }

    public void setFornecedor(Usuario fornecedor) {
        this.fornecedor = fornecedor;
    }

    public FaseProposta getFase() {
        return fase;
    }

    public void setFase(FaseProposta fase) {
        this.fase = fase;
    }

    public String getDescricaoProdutosServicos() {
        return descricaoProdutosServicos;
    }

    public void setDescricaoProdutosServicos(String descricaoProdutosServicos) {
        this.descricaoProdutosServicos = descricaoProdutosServicos;
    }

    public BigDecimal getValorOrcamento() {
        return valorOrcamento;
    }

    public void setValorOrcamento(BigDecimal valorOrcamento) {
        this.valorOrcamento = valorOrcamento;
    }

    public BigDecimal getValorComTaxa() {
        return valorComTaxa;
    }

    public void setValorComTaxa(BigDecimal valorComTaxa) {
        this.valorComTaxa = valorComTaxa;
    }

    public StatusProposta getStatus() {
        return status;
    }

    public void setStatus(StatusProposta status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

package com.b2fy.backend.service;

import com.b2fy.backend.domain.Licitacao;
import com.b2fy.backend.domain.Proposta;
import com.b2fy.backend.domain.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarNovaLicitacaoParaFornecedores(Usuario fornecedor, Licitacao licitacao) {
        String assunto = "Nova licitação para você";
        String corpo = String.format(
            "Olá %s,\n\nUma nova licitação foi publicada na B2FY.\n\n" +
            "Licitação: %s\n" +
            "Descrição: %s\n" +
            "Empresa: %s\n" +
            "Endereço: %s\n" +
            "Data de fechamento: %s\n\n" +
            "Acesse a plataforma para enviar sua proposta.",
            fornecedor.getNome(),
            licitacao.getNome(),
            licitacao.getDescricaoProdutosServicos() != null ? licitacao.getDescricaoProdutosServicos() : "-",
            licitacao.getEmpresa().getNome(),
            licitacao.getEmpresa().getEndereco() != null ? licitacao.getEmpresa().getEndereco() : "-",
            licitacao.getDataFechamento().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        );
        enviar(fornecedor.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarRespostaFornecedorParaEmpresa(Usuario empresa, Usuario fornecedor, Licitacao licitacao, String descricao, BigDecimal valorComTaxa) {
        String assunto = "Resposta do fornecedor na licitação " + licitacao.getNome();
        String corpo = String.format(
            "Olá %s,\n\nO fornecedor %s enviou uma proposta para a licitação %s.\n\n" +
            "Descrição: %s\n" +
            "Valor (com taxa 10%%): R$ %s\n\n" +
            "Acesse a plataforma para ver todos os detalhes.",
            empresa.getNome(),
            fornecedor.getNome(),
            licitacao.getNome(),
            descricao != null ? descricao : "-",
            valorComTaxa != null ? valorComTaxa.setScale(2, java.math.RoundingMode.HALF_UP).toString() : "-"
        );
        enviar(empresa.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarSelecionadoSegundaFase(Usuario fornecedor, Licitacao licitacao) {
        String assunto = "Você foi selecionado para a segunda fase";
        String corpo = String.format(
            "Olá %s,\n\nParabéns! Você foi selecionado para a segunda fase da licitação %s.\n\n" +
            "Acesse a plataforma para enviar sua nova proposta e orçamento.",
            fornecedor.getNome(),
            licitacao.getNome()
        );
        enviar(fornecedor.getEmail(), assunto, corpo);
    }

    @Async
    public void enviarGanhadorLicitacao(Usuario fornecedor, Licitacao licitacao) {
        String assunto = "Você foi o ganhador da licitação " + licitacao.getNome();
        String corpo = String.format(
            "Olá %s,\n\nParabéns! Você foi escolhido como ganhador da licitação %s.\n\n" +
            "Entre em contato com a empresa para os próximos passos.",
            fornecedor.getNome(),
            licitacao.getNome()
        );
        enviar(fornecedor.getEmail(), assunto, corpo);
    }

    private void enviar(String to, String subject, String text) {
        if (from == null || from.isBlank()) return; // skip if mail not configured
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            mailSender.send(message);
        } catch (Exception ignored) {
            // log in production
        }
    }
}

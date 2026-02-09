package com.b2fy.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void enviarNovaLicitacaoParaFornecedores(String fornecedorEmail, String fornecedorNome, String licitacaoNome,
                                                     String descricao, String empresaNome, String empresaEndereco, String dataFechamento) {
        String assunto = "Nova licitação para você";
        String corpo = String.format(
            "Olá %s,\n\nUma nova licitação foi publicada na B2FY.\n\n" +
            "Licitação: %s\n" +
            "Descrição: %s\n" +
            "Empresa: %s\n" +
            "Endereço: %s\n" +
            "Data de fechamento: %s\n\n" +
            "Acesse a plataforma para enviar sua proposta.",
            fornecedorNome,
            licitacaoNome,
            descricao != null ? descricao : "-",
            empresaNome,
            empresaEndereco != null ? empresaEndereco : "-",
            dataFechamento
        );
        enviar(fornecedorEmail, assunto, corpo);
    }

    @Async
    public void enviarRespostaFornecedorParaEmpresa(String empresaEmail, String empresaNome, String fornecedorNome,
                                                     String licitacaoNome, String descricao, String valorComTaxaStr) {
        String assunto = "Resposta do fornecedor na licitação " + licitacaoNome;
        String corpo = String.format(
            "Olá %s,\n\nO fornecedor %s enviou uma proposta para a licitação %s.\n\n" +
            "Descrição: %s\n" +
            "Valor (com taxa 10%%): R$ %s\n\n" +
            "Acesse a plataforma para ver todos os detalhes.",
            empresaNome,
            fornecedorNome,
            licitacaoNome,
            descricao != null ? descricao : "-",
            valorComTaxaStr != null ? valorComTaxaStr : "-"
        );
        enviar(empresaEmail, assunto, corpo);
    }

    @Async
    public void enviarSelecionadoSegundaFase(String fornecedorEmail, String fornecedorNome, String licitacaoNome) {
        String assunto = "Você foi selecionado para a segunda fase";
        String corpo = String.format(
            "Olá %s,\n\nParabéns! Você foi selecionado para a segunda fase da licitação %s.\n\n" +
            "Acesse a plataforma para enviar sua nova proposta e orçamento.",
            fornecedorNome,
            licitacaoNome
        );
        enviar(fornecedorEmail, assunto, corpo);
    }

    @Async
    public void enviarGanhadorLicitacao(String fornecedorEmail, String fornecedorNome, String licitacaoNome) {
        String assunto = "Você foi o ganhador da licitação " + licitacaoNome;
        String corpo = String.format(
            "Olá %s,\n\nParabéns! Você foi escolhido como ganhador da licitação %s.\n\n" +
            "Entre em contato com a empresa para os próximos passos.",
            fornecedorNome,
            licitacaoNome
        );
        enviar(fornecedorEmail, assunto, corpo);
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

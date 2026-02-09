# B2FY - Licitações B2B Inteligentes

Plataforma web para licitações B2B: empresas criam licitações, fornecedores enviam propostas em duas fases, e a empresa escolhe o ganhador.

## Estrutura do projeto

- **b2fy-backend**: API REST em Java 17 + Spring Boot 3.x (JWT, JPA, PostgreSQL, e-mail)
- **b2fy-frontend**: SPA em React 18 + TypeScript (Vite)

## Pré-requisitos

- Java 17+
- Node.js 18+
- PostgreSQL (ou uso do Beekeeper Studio com Postgres)
- Maven 3.8+

## Backend

```bash
cd b2fy-backend
```

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE b2fy;
```

**Configurar credenciais do PostgreSQL** (obrigatório se o usuário/senha não forem `postgres`/`postgres`):

- **Opção A – Arquivo local (recomendado):** na pasta `b2fy-backend/src/main/resources/`, copie `application-local.example.yml` para `application-local.yml`, edite e coloque seu usuário e senha do Postgres. Depois execute com o perfil `local`:
  ```cmd
  "C:\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run -Dspring-boot.run.profiles=local
  ```
- **Opção B – Variáveis de ambiente:** no CMD, antes de rodar o Maven:
  ```cmd
  set DB_USERNAME=postgres
  set DB_PASSWORD=SUA_SENHA_AQUI
  "C:\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run
  ```

Outras variáveis (opcional): `JWT_SECRET`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`.

Executar (no CMD ou PowerShell com Maven no PATH):

```bash
mvn spring-boot:run
```

Se o Maven não estiver no PATH, use o caminho completo. No **CMD**:

```cmd
"C:\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run
```

No **PowerShell**:

```powershell
& "C:\apache-maven-3.9.12\bin\mvn.cmd" spring-boot:run
```

API disponível em `http://localhost:8080/api`. Documentação Swagger: `http://localhost:8080/api/swagger-ui.html`.

## Frontend

```bash
cd b2fy-frontend
npm install
npm run dev
```

Aplicação em `http://localhost:5173`.

**Logo:** Para exibir a logo B2FY no login e na sidebar, copie a imagem da logo para a pasta `public` do frontend com o nome `logo.jpeg`:

- Origem: `image/README/WhatsApp Image 2026-02-09 at 11.20.44.jpeg`
- Destino: `b2fy-frontend/public/logo.jpeg`

Se o arquivo não existir, o sistema exibe o texto "B2FY" como fallback. O proxy do Vite encaminha `/api` para o backend em `http://localhost:8080`.

## Fluxo principal

1. **Cadastro**: Empresa ou fornecedor se cadastra (CPF/CNPJ, e-mail, nichos, etc.).
2. **Login**: Login com CPF ou CNPJ e senha.
3. **Empresa**: Cria licitação (nome, descrição, data de fechamento mín. 3 dias, nichos). Fornecedores dos nichos recebem e-mail.
4. **Fornecedor**: Vê licitações do seu nicho, envia proposta (descrição + orçamento). É aplicada taxa de 10% sobre o valor.
5. **Empresa**: Vê propostas, define ganhador ou avança para segunda fase (seleciona fornecedores).
6. **Segunda fase**: Fornecedores selecionados recebem e-mail e podem enviar nova proposta. Empresa define o ganhador final e o fornecedor é notificado por e-mail.

## Licença

Uso interno / educacional.

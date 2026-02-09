# B2FY — Smart B2B Bidding

Web platform for B2B tenders: companies create tenders, suppliers submit proposals in two phases, and the company selects the winner.

## Project structure

- **b2fy-backend**: REST API with Java 17 + Spring Boot 3.x (JWT, JPA, PostgreSQL, email)
- **b2fy-frontend**: SPA with React 18 + TypeScript (Vite)

## Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL (or use Beekeeper Studio with Postgres)
- Maven 3.8+

## Backend

```bash
cd b2fy-backend
```

Create the database in PostgreSQL:

```sql
CREATE DATABASE b2fy;
```

**Configure PostgreSQL credentials** (required if your username/password are not `postgres`/`postgres`):

- **Option A – Local file (recommended):** In `b2fy-backend/src/main/resources/`, copy `application-local.example.yml` to `application-local.yml`, edit it with your Postgres user and password, then run with the `local` profile:
  ```cmd
  mvn spring-boot:run -Dspring-boot.run.profiles=local
  ```
- **Option B – Environment variables:** Before running Maven:
  ```cmd
  set DB_USERNAME=postgres
  set DB_PASSWORD=YOUR_PASSWORD_HERE
  mvn spring-boot:run
  ```

Other optional variables: `JWT_SECRET`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`.

Run (CMD or PowerShell with Maven on PATH):

If you created `application-local.yml` with your Postgres password (recommended), use the `local` profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Without the `local` profile, the app uses the default password `postgres` and authentication may fail.

If Maven is not on PATH, use the full path. In **PowerShell**:

```powershell
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

API base: `http://localhost:8080/api` (or `http://localhost:8081/api` if `SERVER_PORT` is overridden). Swagger UI: `http://localhost:8080/api/swagger-ui.html`.

## Frontend

```bash
cd b2fy-frontend
npm install
npm run dev
```

App URL: `http://localhost:5173`.

**Logo:** To show the B2FY logo on login and in the sidebar, copy the logo image into the frontend `public` folder as `logo.jpeg`:

- Source: `image/README/WhatsApp Image 2026-02-09 at 11.20.44.jpeg`
- Target: `b2fy-frontend/public/logo.jpeg`

If the file is missing, the UI falls back to the text "B2FY". Vite proxies `/api` to the backend (e.g. `http://localhost:8081` by default in `vite.config.ts`).

## Main flow

1. **Registration**: Company or supplier registers (CPF/CNPJ, email, niches, etc.).
2. **Login**: Login with CPF or CNPJ and password.
3. **Company**: Creates a tender (name, description, closing date min. 3 days, niches). Suppliers in those niches receive an email and an in-app notification.
4. **Supplier**: Sees tenders for their niches, submits a proposal (description + budget). A 10% platform fee is applied to the value.
5. **Company**: Views proposals, either selects the winner or advances to the second phase (selects suppliers).
6. **Second phase**: Selected suppliers receive an email and in-app notification and can submit a new proposal. The company selects the final winner; the supplier is notified by email and in-app.

---

## Technical decisions

### Backend

- **Java 17 + Spring Boot 3.x**: LTS Java and Spring’s ecosystem for REST APIs, security, and data access.
- **JWT authentication**: Stateless auth; token in `Authorization: Bearer …`. No server-side session storage.
- **PostgreSQL**: Relational DB for users, tenders, proposals, niches, and notifications. JPA/Hibernate with `ddl-auto: update` for schema evolution in development.
- **REST API under `/api`**: All endpoints under `context-path: /api` (e.g. `/api/auth/login`, `/api/licitacoes`). CORS allowed for the frontend origin.
- **Role-based access**: `@PreAuthorize("hasRole('EMPRESA')")` / `hasRole('FORNECEDOR')` so companies and suppliers only access allowed resources.
- **Email sending**: `EmailService` with `@Async` methods so HTTP responses are not blocked. Methods accept **plain values (strings, numbers)** instead of JPA entities to avoid lazy-loading and detached-entity issues in async threads.
- **In-app notifications**: `Notificacao` entity; notifications are created when a tender is opened (for suppliers in the niche), when a supplier is selected for the second phase, and when a supplier is chosen as winner. List and “mark as read” endpoints; frontend shows a bell and dropdown in the header.
- **Two-phase bidding**: First phase (`ABERTA`), optional second phase (`SEGUNDA_FASE`) with selected proposals, then `ENCERRADA` with a single winner. Proposals have `FaseProposta` (FASE_1 / FASE_2) and `StatusProposta` (ENVIADA, SELECIONADA_2FASE, GANHADORA).
- **Platform fee**: 10% over proposal value (`valorOrcamento`); stored as `valorComTaxa`. Configurable via `b2fy.taxa-plataforma`.

### Frontend

- **React 18 + TypeScript**: Type-safe UI and clear contracts with the API (e.g. `LicitacaoResponse`, `NotificacaoResponse`).
- **Vite**: Fast dev server and builds; proxy of `/api` to the backend to avoid CORS in development.
- **React Router**: Protected routes; redirect to login when unauthenticated; index route shows `HomeEmpresa` or `HomeFornecedor` by user type.
- **Auth**: JWT stored in `localStorage` (`b2fy_token`); `AuthContext` exposes user and logout; `api` helper attaches the token to requests.
- **Layout**: Fixed header + collapsible sidebar (“hamburger”). Sidebar opens/closes with animation; main content padding uses CSS variable `--sidebar-effective-width` so the content area resizes. On small screens, an overlay closes the sidebar when clicking outside.
- **Styling**: Tailwind CSS + CSS variables in `index.css` for theme (e.g. `--color-primary`, `--sidebar-width`, `--header-height`) and optional dark theme via `[data-theme="dark"]`.
- **Notifications**: Bell icon in the header; dropdown lists notifications and shows unread count. Clicking a notification navigates to the tender and marks it as read via `PATCH /notificacoes/:id/lida`.
- **UI components**: Small set of shared components (`Button`, `Card`, `Input`, `Modal`, `Dropdown`, `Avatar`). `Card` accepts `onClick` and other div attributes via `React.HTMLAttributes<HTMLDivElement>` for clickable cards (e.g. tender list).

### Integration

- **API base**: Frontend calls `/api`; Vite proxies to the backend (e.g. `http://localhost:8081`). Backend serves with `context-path: /api`, so full URL is e.g. `http://localhost:8081/api/licitacoes`.
- **Ports**: Backend default 8080 (or 8081 via `SERVER_PORT`); frontend dev server 5173. Ensure `vite.config.ts` proxy target matches the backend port.

## License

Internal / educational use.

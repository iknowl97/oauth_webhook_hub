# OAuth & Webhook Hub - Implementation Plan

This document outlines the step-by-step plan to implement the OAuth & Webhook Hub project, ensuring a robust, secure, and aesthetically pleasing application.

## Phase 1: Project Initialization & Infrastructure

- [ ] **1.1. Directory Structure Setup**
  - Create `backend`, `frontend`, and `nginx` directories.
  - Initialize `backend` as a Node.js project (`npm init -y`).
  - Initialize `frontend` as a React + Vite project.
- [ ] **1.2. Docker Environment**
  - Create `docker-compose.yml` defining `db` (Postgres), `backend`, `frontend`, and `nginx` services.
  - Create `backend/Dockerfile` and `frontend/Dockerfile`.
  - Create `nginx/nginx.conf`.
- [ ] **1.3. Configuration Management**
  - Create `.env.example` with all necessary environment variables (Database, App, Security).
  - Create `.env` (gitignored) for local development.

## Phase 2: Backend Core (Node.js + Fastify)

- [ ] **2.1. Server Setup**
  - Install dependencies: `fastify`, `fastify-cors`, `fastify-helmet`, `dotenv`, `pg`, `kysely` (or `knex`/`typeorm` as per spec, spec mentions `pg` + `kysely`).
  - generic error handling and logging configuration.
- [ ] **2.2. Database Connection**
  - Configure `pg` pool and `kysely` instance.
  - Implement health check endpoint (`/health`).
- [ ] **2.3. Migration System**
  - Set up a migration runner (using `kysely` or `node-pg-migrate`).
  - Create initial migration file based on `TechSpec.md` schema.

## Phase 3: Database Schema Implementation

- [ ] **3.1. Core Tables**
  - `oauth_providers`: Configuration for providers.
  - `oauth_sessions`: Temporary state for auth flows.
  - `oauth_tokens`: Encrypted storage for access/refresh tokens.
  - `webhooks`: Configuration for dynamic endpoints.
  - `webhook_requests`: Log of incoming requests.
- [ ] **3.2. Security & Indexes**
  - Ensure correct column types (UUID, JSONB, TIMESTAMP).
  - Create necessary indexes for performance.

## Phase 4: Backend Features & API

- [ ] **4.1. Security Services**
  - Implement `encryption.js` (AES-256-GCM) for secrets/tokens.
  - Implement `auth.js` middleware for Admin protection (Basic/JWT).
- [ ] **4.2. Provider Management**
  - CRUD endpoints for `oauth_providers`.
- [ ] **4.3. OAuth Implementation**
  - `GET /oauth/start/:providerId`: Generate PKCE, state, redirect.
  - `GET /oauth/callback`: Exchange code, features PKCE verification, store tokens.
  - Helper service for token refresh logic.
- [ ] **4.4. Webhook System**
  - CRUD endpoints for `webhooks`.
  - `ALL /hook/:id`: Dynamic handler to log request and forward if configured.
  - Request replay logic.

## Phase 5: Frontend Foundations (React + Vite + Tailwind)

- [ ] **5.1. Setup & Styling**
  - Install Tailwind CSS and configure `tailwind.config.js`.
  - **Aesthetics**: Define a premium color palette (dark mode focused), glassmorphism utilities, and modern typography (Inter/Outfit).
  - Setup routing (`react-router-dom`).
- [ ] **5.2. UI Components (Design System)**
  - Create reusable components: `Card`, `Button`, `Input`, `Table`, `Modal`, `Badge`.
  - Ensure all components have hover effects and micro-animations.

## Phase 6: Frontend Feature Development

- [ ] **6.1. Dashboard**
  - Overview metrics (Active Providers, Total Tokens, recent activity).
- [ ] **6.2. Providers Manager**
  - List view of configured providers.
  - "Add Provider" modal with encryption fields handled by backend.
  - "Start Auth" action.
- [ ] **6.3. Token Vault**
  - Secure display of stored tokens (masked by default).
  - Refresh and Delete actions.
- [ ] **6.4. Webhook Panel**
  - List of active webhooks.
  - Real-time request log viewer (using polling or SSE).
  - Request detail view with JSON pretty-printing.

## Phase 7: Polish, Testing & Deployment

- [ ] **7.1. End-to-End Testing**
  - Verify full OAuth flow with a real provider (e.g., GitHub/Google).
  - Test webhook forwarding and logging.
- [ ] **7.2. Production Build**
  - Optimize Docker images (multi-stage builds).
  - Verify Nginx SSL configuration.
- [ ] **7.3. Documentation**
  - Update `README.md` with final screenshots and setup guide.

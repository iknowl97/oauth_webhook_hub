# OAuth & Webhook Hub - Technical Specification

## 1. Project Overview

**Goal**: Self-hosted, Dockerized service providing a centralized OAuth hub and webhook testing panel for personal development workflows.

**Key Features**:

- Single stable redirect URI (`${APP_BASE_URL}/oauth/callback`) for all OAuth providers (Google, Spotify, GitHub, Generic OAuth2/OIDC).
- Developer console to manage OAuth provider configs, initiate auth flows, and store/retrieve tokens.
- Webhook testing panel with dynamic endpoints (`${APP_BASE_URL}/hook/{id}`), request logging, replay, and forwarding capabilities.

**Deployment**: Docker Compose with `.env` configuration, Postgres database, optional Nginx reverse proxy.

## 2. Infrastructure & Docker Setup

### 2.1. File Structure

```
oauth-webhook-hub/
├── docker-compose.yml
├── .env
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json (Node.js/Fastify)
│   └── src/
├── frontend/
│   ├── Dockerfile
│   └── src/
└── nginx/
    ├── nginx.conf
    └── certs/ (optional)
```

### 2.2. Environment Configuration (`.env`)

```env
# Application
APP_BASE_URL=https://auth.example.com
APP_ENV=production
APP_PORT=8080
TIMEZONE=Asia/Tbilisi

# Database
DB_HOST=db
DB_PORT=5432
DB_NAME=oauthhub
DB_USER=oauthhub
DB_PASSWORD=your_strong_db_password

# Security
JWT_SECRET=your_jwt_secret_32_chars_min
ENCRYPTION_KEY=your_encryption_key_32_chars_min
ADMIN_PASSWORD=your_admin_password
```

### 2.3. Docker Compose (`docker-compose.yml`)

```yaml
version: "3.9"

services:
  db:
    image: postgres:16-alpine
    container_name: oauthhub-db
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    networks:
      - internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    container_name: oauthhub-backend
    restart: always
    depends_on:
      db:
        condition: service_healthy
    environment:
      APP_ENV: ${APP_ENV}
      APP_BASE_URL: ${APP_BASE_URL}
      APP_PORT: ${APP_PORT}
      DB_HOST: ${DB_HOST}
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      ENCRYPTION_KEY: ${ENCRYPTION_KEY}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      TZ: ${TIMEZONE}
    volumes:
      - ./logs:/app/logs
    networks:
      - internal

  frontend:
    build: ./frontend
    container_name: oauthhub-frontend
    restart: always
    depends_on:
      - backend
    environment:
      REACT_APP_API_BASE: http://backend:${APP_PORT}
      REACT_APP_BASE_URL: ${APP_BASE_URL}
      TZ: ${TIMEZONE}
    networks:
      - internal

  nginx:
    image: nginx:stable-alpine
    container_name: oauthhub-nginx
    restart: always
    depends_on:
      - frontend
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    networks:
      - internal

volumes:
  db_data:

networks:
  internal:
    driver: bridge
```

## 3. Functional Requirements

### 3.1. OAuth Hub

**Provider Management API**:

```
POST /api/providers          # Create provider config
GET  /api/providers          # List providers
GET  /api/providers/:id      # Get provider
PUT  /api/providers/:id      # Update provider
DELETE /api/providers/:id    # Delete provider
```

**Provider Schema**:

```json
{
  "id": "uuid",
  "name": "Spotify API",
  "type": "oauth2|oidc",
  "auth_url": "https://accounts.spotify.com/authorize",
  "token_url": "https://accounts.spotify.com/api/token",
  "userinfo_url": null,
  "discovery_url": null,
  "client_id": "encrypted",
  "client_secret": "encrypted",
  "scopes": ["playlist-read-private", "user-read-email"],
  "extra_params": { "show_dialog": true },
  "created_at": "timestamp"
}
```

**OAuth Flows**:

- `GET /oauth/start/:providerId?label=MyApp&redirect_back=/success`
  - Generate `state`, `code_verifier` (PKCE)
  - Store session in DB
  - Redirect to provider auth URL
- `GET /oauth/callback?code=...&state=...`
  - Validate state, exchange code for tokens
  - Store tokens encrypted
  - Return success page (closes popup, posts result to parent)

**Token Management**:

```
GET  /api/tokens?providerId=&label=    # List tokens
GET  /api/tokens/:id                   # Get token details
POST /api/tokens/:id/refresh           # Refresh token
DELETE /api/tokens/:id                 # Delete token
```

### 3.2. Webhook Panel

**Webhook Management**:

```
POST /api/hooks              # Create webhook
GET  /api/hooks              # List webhooks
GET  /api/hooks/:id          # Get webhook
PUT  /api/hooks/:id          # Update webhook
DELETE /api/hooks/:id        # Delete webhook
```

**Webhook Schema**:

```json
{
  "id": "short-uuid",
  "path": "/hook/abc123",
  "description": "Test Stripe webhook",
  "expected_method": "POST",
  "response_status": 200,
  "response_headers": { "Content-Type": "application/json" },
  "response_body_template": "{\"status\": \"ok\"}",
  "response_delay_ms": 0,
  "forward_url": "http://localhost:3000/api/stripe",
  "expires_at": "timestamp",
  "created_at": "timestamp"
}
```

**Webhook Processing**:

- `ALL /hook/:id`
  - Log full request (method, headers, body, query, IP, timestamp)
  - Forward to `forward_url` if configured (async)
  - Respond per webhook config

**Request Logs**:

```
GET  /api/hooks/:id/requests?limit=50&offset=0    # List requests
GET  /api/hooks/:id/requests/:reqId              # Get request
POST /api/hooks/:id/requests/:reqId/replay       # Replay to new URL
```

## 4. Database Schema (Postgres)

```sql
-- OAuth Providers
CREATE TABLE oauth_providers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('oauth2', 'oidc')),
  auth_url TEXT,
  token_url TEXT,
  userinfo_url TEXT,
  discovery_url TEXT,
  client_id TEXT NOT NULL,
  client_secret TEXT, -- encrypted
  scopes TEXT[], -- JSON array as text
  extra_params JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Sessions (temporary)
CREATE TABLE oauth_sessions (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES oauth_providers(id),
  state VARCHAR(255) UNIQUE NOT NULL,
  code_verifier TEXT,
  redirect_back TEXT,
  label VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- OAuth Tokens
CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES oauth_providers(id),
  label VARCHAR(255),
  access_token TEXT NOT NULL, -- encrypted
  refresh_token TEXT, -- encrypted
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMP,
  scopes TEXT[],
  user_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks
CREATE TABLE webhooks (
  id VARCHAR(20) PRIMARY KEY, -- short ID
  path VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  expected_method VARCHAR(10),
  response_status INTEGER DEFAULT 200,
  response_headers JSONB,
  response_body_template TEXT,
  response_delay_ms INTEGER DEFAULT 0,
  forward_url TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Requests
CREATE TABLE webhook_requests (
  id UUID PRIMARY KEY,
  webhook_id VARCHAR(20) REFERENCES webhooks(id) ON DELETE CASCADE,
  method VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  query_params JSONB,
  headers JSONB NOT NULL,
  body_text TEXT,
  body_binary BYTEA,
  remote_ip INET,
  user_agent TEXT,
  response_status INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_oauth_sessions_state ON oauth_sessions(state);
CREATE INDEX idx_oauth_sessions_expires ON oauth_sessions(expires_at);
CREATE INDEX idx_webhook_requests_webhook ON webhook_requests(webhook_id);
CREATE INDEX idx_webhook_requests_created ON webhook_requests(created_at);
```

## 5. Authentication & Security

- **Admin Access**: HTTP Basic Auth with `${ADMIN_PASSWORD}` or JWT after initial login
- **Token Encryption**: AES-256-GCM using `${ENCRYPTION_KEY}`
- **PKCE**: Always enabled for OAuth flows
- **CSRF Protection**: State parameter validation
- **Rate Limiting**: 100 req/min per IP for webhook endpoints
- **HTTPS**: Enforced via Nginx/Cloudflare

## 6. Frontend Requirements

**Pages**:

1. **Dashboard**: Overview cards (active providers, tokens, webhooks)
2. **Providers**: List, create/edit forms, "Start Auth" buttons
3. **Tokens**: List with refresh/delete actions, filter by provider/label
4. **Webhooks**: List, create form, per-webhook logs page with real-time updates (SSE)

**Tech**: React/Vue + Tailwind CSS, static build in Docker

## 7. Deployment Instructions

1. `cp .env.example .env`
2. Edit `.env` with your `APP_BASE_URL` and secrets
3. `docker compose build`
4. `docker compose up -d`
5. Access `${APP_BASE_URL}`
6. Configure Nginx/Cloudflare for HTTPS
7. Use `${APP_BASE_URL}/oauth/callback` as redirect URI in all OAuth apps

## 8. Non-Functional Requirements

- **Performance**: Handle 500 webhook req/min, async logging
- **Storage**: Keep webhook logs 30 days, auto-purge expired
- **Logging**: JSON structured logs to stdout + file rotation
- **Monitoring**: Healthcheck endpoints, Postgres metrics
- **Backup**: `pg_dump` cronjob for DB

## 9. MVP Development Priority

1. Backend + DB schema + basic OAuth flow (1 provider)
2. Token storage + provider CRUD API
3. Basic webhook endpoint + logging
4. Frontend dashboard + providers page
5. Webhook UI + real-time logs
6. PKCE, refresh tokens, replay functionality
7. Docker deployment + Nginx TLS

**Estimated Timeline**: 2-3 weeks for MVP with 1 developer.

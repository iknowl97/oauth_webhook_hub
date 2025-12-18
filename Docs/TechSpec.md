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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('oauth2', 'oidc')),
  auth_url TEXT,
  token_url TEXT,
  userinfo_url TEXT,
  discovery_url TEXT,
  client_id TEXT NOT NULL,
  client_secret TEXT, -- encrypted
  scopes TEXT[],
  extra_params JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Sessions (temporary)
CREATE TABLE oauth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_oauth_tokens_provider ON oauth_tokens(provider_id);
CREATE INDEX idx_webhook_requests_webhook ON webhook_requests(webhook_id);
CREATE INDEX idx_webhook_requests_created ON webhook_requests(created_at DESC);
```

## 5. Authentication & Security

- **Admin Access**: HTTP Basic Auth with `${ADMIN_PASSWORD}` or JWT after initial login
- **Token Encryption**: AES-256-GCM using `${ENCRYPTION_KEY}` from environment
- **PKCE**: Always enabled for OAuth flows (code_challenge + code_verifier)
- **CSRF Protection**: State parameter validation with secure random generation
- **Rate Limiting**: 100 req/min per IP for webhook endpoints, 20 req/min for OAuth flows
- **HTTPS**: Enforced via Nginx/Cloudflare, HTTP→HTTPS redirect
- **Secret Storage**: All sensitive fields encrypted at rest in database

## 6. Frontend Requirements

**Technology Stack**: React + Vite + Tailwind CSS (or Vue/Svelte equivalent)

**Pages**:

1. **Dashboard**: Overview cards showing active providers count, total tokens, active webhooks, recent activity
2. **Providers**:
   - List view with provider name, type, scopes
   - Create/edit modal forms
   - "Start Auth" button triggering OAuth flow in popup window
3. **Tokens**:
   - List with masked tokens, expiry status
   - Actions: view details, refresh, delete
   - Filter by provider/label
4. **Webhooks**:
   - List view with webhook URL, description, request count
   - Create form with response configuration
   - Individual webhook detail page with request logs table
   - Real-time updates via Server-Sent Events (SSE)

**UI Components**:

- Copy-to-clipboard buttons for URLs and tokens
- Status indicators (expired/active/error)
- JSON viewer for request/response bodies
- Toast notifications for actions

## 7. Backend Implementation Details

**Technology Stack**: Node.js + Fastify (or Express/Hono)

**Required Libraries**:

- `fastify` - Web framework
- `pg` + `kysely` - Database access
- `crypto` - Token encryption (Node.js built-in)
- `axios` - HTTP client for OAuth token exchange
- `nanoid` - Short ID generation for webhooks
- `jsonwebtoken` - JWT handling
- `fastify-cors` - CORS support
- `fastify-helmet` - Security headers

**Directory Structure**:

```
backend/src/
├── index.js              # Entry point
├── config/               # Environment config
├── db/
│   ├── migrations/       # SQL migration files
│   └── connection.js     # DB pool setup
├── routes/
│   ├── providers.js      # Provider CRUD
│   ├── oauth.js          # OAuth flows
│   ├── tokens.js         # Token management
│   ├── hooks.js          # Webhook CRUD
│   └── webhook.js        # Webhook receiver
├── services/
│   ├── encryption.js     # AES encryption utilities
│   ├── oauth.js          # OAuth flow logic
│   └── webhook.js        # Webhook processing
└── middleware/
    ├── auth.js           # Admin authentication
    └── rateLimit.js      # Rate limiting
```

**Key Implementation Requirements**:

- Database migrations run automatically on startup
- Graceful shutdown handling
- Structured JSON logging (stdout)
- Environment variable validation on startup
- Async/await error handling with proper HTTP status codes
- Request ID tracking for debugging

## 8. Deployment Instructions

```bash
# 1. Clone/create project structure
mkdir oauth-webhook-hub && cd oauth-webhook-hub

# 2. Create .env from template
cp .env.example .env
# Edit .env with your APP_BASE_URL and generate secrets

# 3. Build and start services
docker compose build
docker compose up -d

# 4. Check logs
docker compose logs -f backend

# 5. Access application
# Navigate to ${APP_BASE_URL}

# 6. Configure DNS/Nginx for HTTPS
# Point your domain to server IP
# Ensure APP_BASE_URL matches your domain

# 7. Register OAuth applications
# Use ${APP_BASE_URL}/oauth/callback as redirect URI
# in Google/Spotify/GitHub developer consoles
```

## 9. Non-Functional Requirements

- **Performance**:
  - Handle 500 webhook requests/minute
  - Async logging with buffering
  - Database connection pooling (max 20 connections)
- **Storage**:
  - Webhook logs retained for 30 days
  - Auto-purge expired sessions every hour
  - Optional S3/file storage for large webhook bodies
- **Logging**:
  - JSON structured logs to stdout
  - Log rotation for file logs (50MB max, 7 files)
  - Include correlation IDs for tracing
- **Monitoring**:
  - `/health` endpoint returning DB connection status
  - `/metrics` endpoint (optional Prometheus format)
- **Backup**:
  - Daily `pg_dump` cron job recommended
  - Store backups outside container volumes

## 10. Implementation Priority

**Phase 1 - Core OAuth Hub**:

1. Database schema + migrations
2. Provider CRUD API
3. OAuth start flow + callback handler
4. Token storage with encryption
5. Basic admin authentication

**Phase 2 - Webhook Panel**:

1. Webhook CRUD API
2. Dynamic endpoint handler (`/hook/:id`)
3. Request logging to database
4. Webhook list + detail pages

**Phase 3 - Frontend**:

1. React app scaffolding + routing
2. Providers management page
3. Tokens list page
4. Webhooks dashboard with logs

**Phase 4 - Advanced Features**:

1. Token refresh mechanism
2. Request replay functionality
3. Webhook forwarding (async)
4. Real-time log updates (SSE)
5. PKCE implementation
6. Rate limiting

**Phase 5 - Production Ready**:

1. Docker optimization (multi-stage builds)
2. Nginx configuration + TLS
3. Error handling + validation
4. Documentation + README
5. Health checks + monitoring

## 11. Roadmap & Future Implementation

> **Note**: The detailed, phased execution strategy is now maintained in [`Docs/ROADMAP_EXTENDED.md`](./ROADMAP_EXTENDED.md). Please refer to that document for the authoritative source on upcoming features, including:

- **Phase 1**: Core Reliability (Migrations, Presets)
- **Phase 2**: Security (Token Lifecycle, Pre-checking)
- **Phase 3**: Analytics (Logs, Diff Viewer, Retention)
- **Phase 4**: Experience (Guides, Visualizer)

# Webhook Sub-Binding Implementation Plan

**Objective**: Enable dynamic creation of subdomains (e.g., `hook-123.oauthhub.work.gd`) that route to specific webhook endpoints, providing a dedicated, isolated URL for each integration.

---

## Phase 1: Architecture Design

### 1.1 Reverse Proxy Solution

- **Option A**: **Traefik** (Recommended for Docker). auto-discovers containers and manages Let's Encrypt for wildcards.
- **Option B**: **Nginx with Lua/OpenResty**. More complex configuration but highly customizable.
- **Selected**: **Traefik**.
  - **Configuration**: Dynamic configuration provider (Redis or File).
  - **Wildcard SSL**: Use DNS Challenge (Cloudflare/AWS Route53) via Traefik to issue `*.oauthhub.work.gd`.

### 1.2 Database Schema

New tables to map subdomains to internal webhook IDs.

```sql
CREATE TABLE subdomain_bindings (
  id TEXT PRIMARY KEY,
  subdomain TEXT NOT NULL UNIQUE, -- 'hook-123'
  webhook_id TEXT NOT NULL REFERENCES webhooks(id),
  owner_id TEXT NOT NULL, -- User ID
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);
```

### 1.3 URL Generation Algorithm

- **Format**: `{adjective}-{noun}-{token}.oauthhub.work.gd` (e.g., `rapid-falcon-x9z.oauthhub.work.gd`).
- **Collision Check**: DB unique constraint + retry logic.

---

## Phase 2: Core Functionality

### 2.1 API Endpoints

- `POST /api/subdomains`: Reserve a new subdomain.
- `DELETE /api/subdomains/:id`: Release a subdomain.
- `GET /api/subdomains/check`: Check availability.

### 2.2 SSL Provisioning (Automatic)

- **Mechanism**: Traefik "On Demand TLS" (Use with caution due to rate limits) OR **Wildcard Certificate** (Preferred).
- **Wildcard Strategy**:
  1. User sets A record `*.oauthhub.work.gd` -> Server IP.
  2. Traefik requests `*.oauthhub.work.gd` certificate using DNS Challenge.
  3. Any request to `xyz.oauthhub.work.gd` is SSL terminated by Traefik.

### 2.3 Middleware Routing

- Middleware intercepts requests to `*.oauthhub.work.gd`.
- Extracts subdomain from `Host` header.
- Queries Cache (Redis) or DB to find target `webhook_id`.
- Rewrites request to `/api/webhooks/:webhook_id`.

---

## Phase 3: User Interface

### 3.1 Web Interface

- **New Page**: "Custom Domains".
- **List View**: Active subdomains, mapped webhook, hits, status.
- **Action**: "Bind Subdomain" button on Webhook Details page.

### 3.2 Analytics

- Track "Last Used", "Total Requests" per subdomain.
- Display in Dashboard.

---

## Technical Requirements (Checklist)

- [ ] **Wildcard SSL**: Configure DNS provider (e.g., Namecheap/Cloudflare) for DNS-01 challenge.
- [ ] **Rate Limiting**: 60 req/min per subdomain to prevent abuse.
- [ ] **IP Whitelisting**: Allow users to restrict who can call their subdomain.
- [ ] **Audit Logs**: Log creation/deletion of bindings.

## Testing Requirements

- [ ] **Propagation**: Verify new subdomain works instantly (no DNS delay if wildcard is set).
- [ ] **Routing**: Verify `hook-1.domain.com` -> Webhook 1, `hook-2.domain.com` -> Webhook 2.
- [ ] **SSL**: Verify HTTPS works on new subdomains.
- [ ] **Failover**: Ensure 404 if subdomain is not bound.

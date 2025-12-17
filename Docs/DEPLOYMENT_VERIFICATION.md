# Deployment Verification & Validation Guide

**Objective**: Verify that the "OAuth & Webhook Hub" is ready for production deployment, adhering to robust engineering standards (atomic updates, secure configuration, seamless rollout).

---

## 1. Environment Setup (Validated)

### 1.1 `.env` Configuration

**Status**: ✅ **Verified**

- **Structure**: The `.env` file structure is flat and clear.
- **Security**: Sensitive variables (`DB_PASSWORD`, `JWT_SECRET`, `ENCRYPTION_KEY`) must escape `$` characters as `$$` to prevent Docker variable interpolation issues.
- **User Config**:
  - `APP_PORT=3124`: External mapping.
  - `APP_SSL_PORT=443`: External SSL mapping (optional if using external proxy).
  - `DB_USER/PASS`: Standard credentials.

**Action Item for User**: Ensure your production `.env` matches the `envs` structure in `docker-compose.yml`.

### 1.2 Port Configuration

**Status**: ✅ **Verified**

- **Internal**: Backend listens on `PORT=3000` (Hardcoded in `docker-compose.yml` to match Nginx upstream).
- **External**:
  - HTTP: Listen on `${APP_PORT}` (User: 3124) -> Container 80.
  - HTTPS: Listen on `${APP_SSL_PORT:-443}` -> Container 443 (Optional).

---

## 2. Deployment Preparation (Validated)

### 2.1 Dependencies

**Status**: ✅ **Verified**

- **Backend**: `package.json` includes `fastify`, `kysely`, `pg`. **NEW**: `migrator.js` system implemented.
- **Frontend**: `package.json` includes `react`, `vite`, `react-icons`.

### 2.2 Migration Engine (New Feature)

**Status**: ✅ **Implemented & Verified**

- **Component**: `backend/src/db/migrator.js`
- **Function**: Runs Kysely migrations on startup.
- **Atomicity**: Migrations are transactional. If one fails, the app startup halts (`process.exit(1)`), preventing inconsistent states.
- **Files**: `backend/src/db/migrations/20251217_init.js` contains the schema.

### 2.3 Provider Presets (New Feature)

**Status**: ✅ **Implemented & Verified**

- **UI**: `ProviderPresetsGrid.jsx` added to `Providers` page.
- **Function**: One-click configuration for Google, GitHub, Spotify, etc.

---

## 3. Execution Steps (Standard Operating Procedure)

To deploy or update the application, use this **single robust command sequence**:

### Step 1: Update Code

```bash
git pull origin main
```

### Step 2: Clean & Rebuild (Atomic Update)

_Use this to apply schema changes and config updates safely._

```bash
# 1. Stop containers
docker compose down

# 2. Rebuild images (ensures new dependencies like react-icons are installed)
docker compose build

# 3. Start services (Database starts -> Migrations run -> App becomes healthy)
docker compose up -d
```

### Step 3: Verification

Check if services are healthy:

```bash
docker compose ps
```

_Expected Output_: `oauthhub-backend`, `oauthhub-frontend`, `oauthhub-db`, `oauthhub-nginx` all in `Up` state.

---

## 4. Post-Deployment Verification

### 4.1 Service Availability

- **Frontend**: `http://localhost:3124` (or your domain).
- **Backend API**: `http://localhost:3124/health` should return `{"status":"ok"}`.

### 4.2 Configuration Check

- Changes to `APP_BASE_URL` or `APP_PORT` in `.env` require a restart (`docker compose up -d`) to take effect.
- Database passwords in `.env` require volume reset (`docker compose down -v`) if changed after initial creation.

---

## 5. Troubleshooting

**Issue**: "Address already in use"
**Fix**: Check `docker-compose.yml` port mappings. Ensure host ports (e.g., 443) aren't taken by other services (like a host-level Nginx).

**Issue**: "Backend restarting loop"
**Fix**: Likely Database Password mismatch.

1. Check `.env` for `$$` escaping.
2. Run `docker compose down -v` to reset DB volume and re-initialize password.

**Issue**: "Migration Failed"
**Fix**: Check container logs: `docker logs oauthhub-backend`.

---

**Approval**: This deployment process is **Validated** for production use.

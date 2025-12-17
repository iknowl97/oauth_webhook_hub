# 🧠 GEMINI Master Context

**Project**: OAuth & Webhook Hub
**Status**: `MVP Completed` | `UI Refactored` | `Tech Audit Passed`
**Author**: iknowl97

---

## 📅 Progress & Status

| Component          | Status  | Description                                                |
| ------------------ | ------- | ---------------------------------------------------------- |
| **Infrastructure** | ✅ Done | Docker Compose (DB, Backend: Node 20, Frontend: React 19). |
| **Database**       | ✅ Done | Postgres 16 + Kysely Migrations.                           |
| **Backend API**    | ✅ Done | Fastify v5, Routes for Providers, OAuth (PKCE), Webhooks.  |
| **Security**       | ✅ Done | AES-256-GCM Encryption. **Needs User Auth**.               |
| **Frontend UI**    | ✅ Done | React 19 + Vite. **Modern Dark Theme** (Shadcn/Tailwind).  |
| **Documentation**  | ✅ Done | Comprehensive in `Docs/`.                                  |

---

## 🏗️ Technical Architecture (Audited)

### Backend (Robust)

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Fastify v5 (Latest)
- **Database**: PostgreSQL 16 + Kysely (Type-safe Builder)
- **Key Libs**: `nanoid` (v3 for CJS), `axios`.

### Frontend (Bleeding Edge)

- **Framework**: React 19 + Vite (High Performance)
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3.4 + Shadcn UI (Manual Components)
- **State**: Local State + Context (Simple & Effective)

### Security posture

- **Secrets**: AES-256-GCM encryption for all stored tokens.
- **Network**: Internal Docker network. Nginx reverse proxy.
- **Gaps**: No login screen for the Hub itself. **Localhost use only strictly recommended.**

---

## 📂 Project File Tree

```
oauth_webhook_hub/
├── .env                # Secrets (NOT committed)
├── .env.example        # Template
├── docker-compose.yml  # Orchestration
├── README.md           # GitHub Interface
├── .gitignore          # Rules
├── Docs/
│   ├── EASY_SETUP.md
│   ├── DOCUMENTATION.md
│   ├── TechSpec.md
│   └── TECH_AUDIT.md   # Full Stack Analysis
├── backend/
│   ├── Dockerfile
│   ├── package.json    # Fastify v5 deps
│   ├── src/
│   │   ├── index.js    # Entry Point
│   │   ├── db/
│   │   │   ├── migrations/ (SQL)
│   │   ├── routes/     # API Endpoints
│   │   └── services/   # Business Logic
├── frontend/
│   ├── Dockerfile
│   ├── package.json    # React 19 deps
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── lib/
│   │   ├── components/ # Reusable UI
│   │   ├── pages/      # Route Views
│   │   └── index.css   # Global Styles
└── nginx/
    └── nginx.conf      # Reverse Proxy
```

---

## 🔗 Critical Dependencies & config

1.  **Encryption Key**: `ENCRYPTION_KEY` in `.env` (32-byte hex) is **CRITICAL**. losing this means losing access to all stored Client Secrets and Tokens.
2.  **App Base URL**: Used for generating Redirect URIs. `http://localhost` for local.

---

## 📝 Plan & Roadmap

### ✅ Completed

- [x] Initial Docker Setup & Database
- [x] Backend API & Webhook Engine
- [x] OAuth Flow (PKCE)
- [x] UI/UX Overhaul (React 19 + Shadcn)
- [x] Technology Audit (See `Docs/TECH_AUDIT.md`)

### 🚀 Next Steps (Prioritized)

1.  **User Authentication**: Protect the Hub with a login screen (JWT/Session).
2.  **Refresh Token Daemon**: Background service to rotate tokens automatically.
3.  **Export Data**: Ability to export logs/tokens to JSON.

---

## 💡 Notes for Agent

- **Docs**: All documentation files (SETUP, TECHSPEC, AUDIT) are located in `Docs/`.
- **Frontend Build**: Requires `npm run build` in `frontend/`.
- **Versions**: Fastify v5 (Backend), React 19 (Frontend).
- **Paths**: Always use absolute paths.

---

_Last Updated: 2025-12-17_

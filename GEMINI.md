# 🧠 GEMINI Master Context

**Project**: OAuth & Webhook Hub
**Status**: `MVP Completed` | `UI Refactored`
**Author**: iknowl97

---

## 📅 Progress & Status

| Component          | Status  | Description                                            |
| ------------------ | ------- | ------------------------------------------------------ |
| **Infrastructure** | ✅ Done | Docker Compose (DB, Backend, Frontend, Nginx).         |
| **Database**       | ✅ Done | Postgres 16 + Kysely Migrations.                       |
| **Backend API**    | ✅ Done | Fastify, Routes for Providers, OAuth (PKCE), Webhooks. |
| **Security**       | ✅ Done | AES-256-GCM Encryption for secrets.                    |
| **Frontend UI**    | ✅ Done | React + Vite. **Modern Dark Theme** (Shadcn/Tailwind). |
| **Documentation**  | ✅ Done | README, EASY_SETUP, TechSpec (Moved to `Docs/`).       |

---

## 🎨 Frontend Design System

The UI has been completely refactored to a custom implementation of the **Shadcn** aesthetic using **Tailwind CSS**.

- **Theme**: Dark Mode (`class="dark"`).
- **Colors**:
  - Background: `Zinc 950` (#09090b)
  - Primary: `Violet 600` (#7c3aed)
  - Card: `Zinc 950` with `Zinc 800` borders.
- **Components** (`/src/components/ui`):
  - `button.jsx`: Variants (default, outline, ghost, destructive).
  - `card.jsx`: Compositional card components.
  - `input.jsx`: Styled input fields.
  - `table.jsx`: Data display.
  - `badge.jsx`: Status indicators.
- **Layout**:
  - `Layout.jsx`: Responsive Sidebar + Header + Breadcrumb area.

---

## 📂 Project File Tree

```
oauth_webhook_hub/
├── .env                # Secrets (NOT committed)
├── .env.example        # Template
├── docker-compose.yml  # Orchestration
├── README.md           # GitHub Entry
├── Docs/
│   ├── EASY_SETUP.md
│   ├── DOCUMENTATION.md
│   └── TechSpec.md
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── index.js    # Entry Point (Fastify)
│   │   ├── db/
│   │   │   ├── connection.js
│   │   │   ├── migrate.js
│   │   │   └── migrations/ (SQL files)
│   │   ├── routes/
│   │   │   ├── hooks.js
│   │   │   ├── oauth.js
│   │   │   ├── providers.js
│   │   │   └── webhook.js (Receiver)
│   │   └── services/
│   │       ├── encryption.js (AES-256)
│   │       └── oauth.js (PKCE/State)
├── frontend/
│   ├── Dockerfile
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── src/
│   │   ├── index.css   # Global styles & Variables
│   │   ├── App.jsx     # Routes
│   │   ├── main.jsx
│   │   ├── lib/
│   │   │   ├── api.js  # Axios Client
│   │   │   └── utils.js (cn helper)
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Modal.jsx (Dialog)
│   │   │   └── ui/ (Shadcn components)
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Providers.jsx
│   │       ├── Tokens.jsx
│   │       └── Webhooks.jsx
└── nginx/
    └── nginx.conf      # Reverse Proxy
```

---

## 🔗 Critical Dependencies & config

1.  **Encryption Key**: `ENCRYPTION_KEY` in `.env` (32-byte hex) is **CRITICAL**. losing this means losing access to all stored Client Secrets and Tokens.
2.  **Database URL**: Connection string for Postgres.
3.  **App Base URL**: Used for generating Redirect URIs.

---

## 📝 Plan & Roadmap

### ✅ Completed

- [x] Initial Docker Setup
- [x] Database Schema & Migrations
- [x] Backend CRUD (Providers, Webhooks)
- [x] Webhook Ingestion Engine
- [x] OAuth Flow (Redirect > Token Exchange > Storage)
- [x] UI/UX Overhaul (Shadcn + Dark Theme)
- [x] Documentation & Reorganization

### ⏳ Pending / Future Considerations

- [ ] **Token Refresh Daemon**: Automatically refresh expiring tokens.
- [ ] **Request Replay**: Button to resend a captured webhook to a local target.
- [ ] **Filtering**: Search/Filter logs in the Webhook Inspector.
- [ ] **Export**: JSON export of captured logs.
- [ ] **User Auth**: Protect the Hub itself with a login (currently open network).

---

## 💡 Notes for Agent

- **Docs**: All documentation files (SETUP, TECHSPEC, etc.) are located in `Docs/`.
- **Frontend Build**: Requires `npm run build` in `frontend/`. Watch out for Tailwind version mismatch (Use v3.4.17).
- **Database**: If DB isn't healthy, Backend will fail startup. Docker Compose healthchecks handle this usually.
- **Imports**: Frontend uses `import { cn } from '../lib/utils'`, be careful with relative paths when moving files.

---

_Last Updated: 2025-12-17_

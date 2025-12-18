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
- [x] **Webhook Sub-Binding System** (Wildcard Subdomains)
- [x] **User Authentication** (JWT + Single Admin)

### 🚀 Next Steps (Prioritized)

1.  **Remote Proxy Config**: Configure remote Nginx/Traefik to handle `*.oauthhub.work.gd` and forward to local instance.
2.  **Refresh Token Daemon**: Background service to rotate tokens automatically.
3.  **Data Export**: JSON export for logs and tokens.

---

## 💡 Notes for Agent

- **Docs**: All documentation files (SETUP, TECHSPEC, AUDIT, **DESIGN_GUIDELINES**) are located in `Docs/`.
- **Design Standard**: Strictly follow `Docs/DESIGN_GUIDELINES.md` ("Floating Glass" aesthetic).
- **Frontend Build**: Requires `npm run build` in `frontend/`.
- **Versions**: Fastify v5 (Backend), React 19 (Frontend).
- **Paths**: Always use absolute paths.

---

_Last Updated: 2025-12-18 02:20_

## **Custom rules by Author do not edit them**

# Zero Tolerance rules and instructions

1. Strictly confine all work operations to the Project directory structure. Never create, modify, or access files outside the designated project boundaries.

2. Utilize Context7 as the primary knowledge base for retrieving comprehensive documentation about:

   - Component APIs
   - Technology specifications
   - Framework documentation
   - Project-specific implementation details

3. Maintain thorough documentation updates across all relevant files including:

   - GEMINI.md (project specifications)
   - readme.md (project overview)
   - ./Docs/ directory files (detailed documentation)
     Ensure all modifications are synchronized across these documentation sources

4. Implement task management through structured updates:

   - Format all updates as detailed task lists
   - Clearly mark task status (Done/In Progress/Pending)
   - Include timestamped progress comments for each task
   - Maintain comprehensive change logs with rationale for modifications

5. Follow strict version control protocols using Git:
   - Use the built-in /git-commiter workflow exclusively
   - Commit after each logical unit of work completion
   - Craft commit messages that include:
     - Human-readable change descriptions
     - Technical implementation details
     - Context for future reference (both human and AI)
   - Maintain atomic commits representing single logical changes
   - Never force push or rewrite published history
   6. Always specify "\_Last Updated:" in GEMINI.md in top of file including hour+minute
   7. always create neccessary variables in .env file for autonomous testing. Including example generated passwords and example users
   8. Run test on local pc after UI and curl tests i will deploy to remote server and run tests there manually.

### Note to aknowledge environment

This is my local pc running on windows (i cannot redirect any ports here so i use localhost here and you also act regarding thsi information). so i have a remote server running on ubuntu where i can redirect ports and use it as a reverse proxy. how i did already and our build (3adcc6ad2e2920cda843aa0a1a293ff56ef2dfc7) is deployed already on that server under http://oauthhub.work.gd/. You cna browse it using Browser Agent.
Use this browser to perform Automated Tests (Manual Run) after implementing each feature.

ALso i'll specify here remote serer structure for testing:

```bash
Last login: Thu Dec 18 00:05:31 2025 from 127.0.0.1
-bash: /www/server/panel/pyenv/bin/python: Permission denied
gioam@gioam:~$ sudo -s
[sudo] password for gioam:
root@gioam:/home/gioam# cd dockerS/
root@gioam:/home/gioam/dockerS# git clone https://github.com/iknowl97/oauth_webhook_hub.git
Cloning into 'oauth_webhook_hub'...
remote: Enumerating objects: 4045, done.
remote: Counting objects: 100% (4045/4045), done.
remote: Compressing objects: 100% (3006/3006), done.
remote: Total 4045 (delta 922), reused 4019 (delta 896), pack-reused 0 (from 0)
Receiving objects: 100% (4045/4045), 3.08 MiB | 2.27 MiB/s, done.
Resolving deltas: 100% (922/922), done.
root@gioam:/home/gioam/dockerS# cd oauth_webhook_hub/
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose up -d
[+] Running 4/4
 ✔ Container oauthhub-db        Healthy                                                                                    1.2s
 ✔ Container oauthhub-backend   Running                                                                                    0.0s
 ✔ Container oauthhub-frontend  Started                                                                                    0.9s
 ✔ Container oauthhub-nginx     Running                                                                                    0.0s
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose down  -d
unknown shorthand flag: 'd' in -d
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose down  -v
[+] Running 6/6
 ✔ Container oauthhub-nginx            Removed                                                                             0.4s
 ✔ Container oauthhub-frontend         Removed                                                                             0.3s
 ✔ Container oauthhub-backend          Removed                                                                             0.8s
 ✔ Container oauthhub-db               Removed                                                                             0.3s
 ✔ Volume oauth_webhook_hub_db_data    Removed                                                                             0.1s
 ✔ Network oauth_webhook_hub_internal  Removed                                                                             0.2s
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose up -d
[+] Running 6/6
 ✔ Network oauth_webhook_hub_internal  Created                                                                             0.1s
 ✔ Volume "oauth_webhook_hub_db_data"  Created                                                                             0.0s
 ✔ Container oauthhub-db               Healthy                                                                            11.0s
 ✔ Container oauthhub-frontend         Started                                                                             0.5s
 ✔ Container oauthhub-backend          Started                                                                            11.2s
 ✔ Container oauthhub-nginx            Started                                                                            11.5s
root@gioam:/home/gioam/dockerS/oauth_webhook_hub#
```

# Note to understand project

The main idea behind webhook and oauth project is to offer a simple, no-setup solution for developers who need to test webhook integrations without running their own servers or setting up complex local environments. By sending webhooks to the provided URL, users can instantly see the request details—including headers, payload, and metadata—helping them troubleshoot and understand how webhooks work in practice.​

What webhook and oauth project Does
Generates a unique webhook URL for each session.​

Allows developers to send webhooks from various services and inspect the received data in real time.​

Is free to use and does not require account creation.​

Webhooks will have ability to be deleted after scheduled days in GUI when adding or editing webhook settings.

Similar autonomous automation for OAUTH flow. I want it to be as simple as possible. I want it to be able to handle all the steps of the OAUTH flow. Regarding most popular OAUTH providers (like Google, Facebook, Shopify, Slack, Mailchimp, Trello, GitHub, PayPal, Discord, and Jira. etc.) I want it to be able to handle them without any additional configuration.

### 🔮 Roadmap V2: Enhanced Analysis & Automation

Detailed technical plans available in [`Docs/ROADMAP_EXTENDED.md`](file:///c:/Users/gioam/Desktop/oauth_webhook_hub/Docs/ROADMAP_EXTENDED.md).

4.  **OAuth Token Storage (GUI)**: Manage, refresh, and revoke credentials.
5.  **Webhook Log Viewer (GUI)**: Advanced filtering and deep history.
6.  **Payload Difference Viewer (GUI)**: Visual JSON diffs for schema debugging.
7.  **Interactive Integration Guides**: Wizard-style setup for popular providers.
8.  **OAuth Flow Visualizer (GUI)**: Educational step-by-step flow diagrams.
9.  **Pre-checking Mechanism**: Scope validation and "Dry Run" auth tests.

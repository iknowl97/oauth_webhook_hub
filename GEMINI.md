# 🧠 GEMINI Master Context

**Project**: OAuth & Webhook Hub
**Version**: `v1.0.0 (Released)`
**Status**: `🟢 Production Ready` | `stable`
**Author**: iknowl97

---

## 📅 Progress & Status

| Component          | Status  | Description                                                |
| ------------------ | ------- | ---------------------------------------------------------- |
| **Infrastructure** | ✅ Done | Docker Compose (DB, Backend: Node 20, Frontend: React 19). |
| **Database**       | ✅ Done | Postgres 16 + Kysely Migrations (Robust Schema).           |
| **Backend API**    | ✅ Done | Fastify v5, Routes for Providers, OAuth (PKCE), Webhooks.  |
| **Security**       | ✅ Done | AES-256-GCM Encryption + **JWT User Auth**.                |
| **Frontend UI**    | ✅ Done | React 19 + Vite. **Modern Dark Theme** + Presets.          |
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
- **Authentication**: JWT-based Admin Access enabled.

---

## 📂 Project File Tree (Current State)

```
oauth_webhook_hub/
├── .env                # Secrets (NOT committed)
├── .env.example        # Template
├── docker-compose.yml  # Orchestration
├── README.md           # GitHub Interface
├── .gitignore          # Rules
├── Source/             # 📥 PRIMARY INPUT: Raw resources waiting for processing
├── Processed/          # 📤 OUTPUT: Validated and normalized resources
├── tools/
│   └── process_resources.js # ⚙️ AUTOMATION: Naming & Validation script
├── Docs/
│   ├── EASY_SETUP.md
│   ├── DOCUMENTATION.md
│   ├── TechSpec.md
│   ├── TECH_AUDIT.md
│   └── ROADMAP_EXTENDED.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── index.js
│   │   ├── db/
│   │   ├── routes/
│   │   └── services/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── lib/
│   │   ├── components/
│   │   └── pages/
└── nginx/
    └── nginx.conf
```

---

## � Resource Processing Workflow

### 1. Purpose & Access

The **Source** folder serves as the single point of entry for all project assets (images, logos, data files).

- **Location**: Root directory `/Source`
- **Supported Types**: `.png`, `.jpg`, `.json`, `.csv`, `.md`
- **Max Size**: 50MB per file

### 2. Processing Steps

1.  **Input**: Place raw files into the `Source/` folder.
2.  **Execution**: Run the automated pipeline:
    ```bash
    node tools/process_resources.js
    ```
3.  **Output**: Validated files are copied to `Processed/`.
4.  **Logs**: Operations are recorded in `resource_processing.log`.

---

## 🏷️ Naming Conventions

All resources must adhere to the following **Strict Naming Schema**:

**Pattern**: `[ProjectID]_[ResourceType]_[YYYYMMDD]_[Version].ext`

- **Constraint**: All lowercase, underscore separators.
- **Length**: Maximum 64 characters.
- **Format**:
  - `ProjectID`: `oauthhub`
  - `ResourceType`: e.g., `logo`, `config`, `dump`
  - `Date`: `YYYYMMDD` (Year Month Day)
  - `Version`: `v` + Integer (e.g., `v1`)

### Examples

| Status         | Filename                            | Reason                           |
| :------------- | :---------------------------------- | :------------------------------- |
| ✅ **Valid**   | `oauthhub_logo_20251219_v1.png`     | Follows all rules.               |
| ✅ **Valid**   | `oauthhub_config_20250101_v20.json` | Valid versioning.                |
| ❌ **Invalid** | `Logo_Final.png`                    | Uppercase, missing date/version. |
| ❌ **Invalid** | `oauthhub-data-2025.csv`            | Wrong separator (hyphen).        |

---

## ✅ Validation Procedures

The `tools/process_resources.js` system enforces:

1.  **Naming Compliance**: Regex check `^[a-z0-9]+_[a-z0-9]+_\d{8}_v\d+\.[a-z]+$`
2.  **Integrity**:
    - **Count**: Ensures matched `Source` files exist in `Processed`.
    - **Metadata**: Preserves `mtime` (Modification Time) during copy.
3.  **Audit**: Invalid files are flagged in the console and log file; they are **NOT** copied.

---

## 📜 Version Control & Changelog

| Date       | Author   | Modification                                                                     |
| :--------- | :------- | :------------------------------------------------------------------------------- |
| 2025-12-19 | iknowl97 | **v1.1 Structure Update**: Added Source/Processed folders and validation script. |
| 2025-12-18 | iknowl97 | **v1.0 Release**: Completed OAuth Presets & Security Token Lifecycle.            |

---

_Last Updated: 2025-12-19 00:45_

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

# Important

If you achieve step where it's neccessary for real deployement after running all local tests i will deploy to remote server output me commands to deploy to remote server. Then I will confirm deployment and You will run tests "https://oauthhub.work.gd/" there with this actuial domain.

ALso i'll specify here remote serer structure for testing:

```bash


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
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose up -d0.0s
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose down  -d
unknown shorthand flag: 'd' in -d
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose down  -v
[+] Running 6/6
0.2s
root@gioam:/home/gioam/dockerS/oauth_webhook_hub# docker-compose up -d
[+] Running 6/6
 ✔ Network oauth_webhook_hub_internal  Created0.1s
 ✔ Volume "oauth_webhook_hub_db_data"  Created0.0s
 ✔ Container oauthhub-db               Healthy            11.0s
 ✔ Container oauthhub-frontend         Started0.5s
 ✔ Container oauthhub-backend          Started            11.2s
 ✔ Container oauthhub-nginx            Started            11.5s
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

### 🔮 Roadmap V2 & Master Plan

Detailed execution strategy is consolidated in [`Docs/ROADMAP_EXTENDED.md`](Docs/ROADMAP_EXTENDED.md).

**Key Phases:**

1.  **Core Reliability**: Robust Kysely Migrations, Provider Presets.
2.  **Security**: Token Lifecycle (Refresh/Revoke), Pre-checking.
3.  **Visibility**: Log Analytics, Payload Diff, Retention Settings.
4.  **Experience**: Flow Visualizer, Interactive Guides.

# Spotify API for tests

```markdown
Client ID
also1it2was3sssscha4in4ged202020
App Status
Development mode
Client secret
1it2was3cha4in4ged202020
App name
oauth_hub_tests
App description
This APP is for testing OAUTH
Website
Redirect URIs
https://oauthhub.work.gd/tokens
Bundle IDs
Android packages
APIs used
Web API
iOS
Android
```

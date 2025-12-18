# 🗺️ Master Implementation Plan (Roadmap V2 & Beyond)

This document is the **Single Source of Truth** for all upcoming features, system improvements, and technical goals. It consolidates previous roadmaps, task lists, and technical specifications into one execution strategy.

## 📅 Execution Phases

| Phase       | Focus                     | Key Features                                         | Status         |
| :---------- | :------------------------ | :--------------------------------------------------- | :------------- |
| **Phase 1** | **Core Reliability**      | Kysely Migrations, Custom Paths, Presets             | 🟡 In Progress |
| **Phase 2** | **Security & Management** | OAuth Token Storage, Refresh/Revoke, Pre-checking    | 🔴 Pending     |
| **Phase 3** | **Data Visibility**       | Webhook Log Viewer, Payload Diff, Retention Settings | 🔴 Pending     |
| **Phase 4** | **Developer Experience**  | Integration Guides, Flow Visualizer                  | 🔴 Pending     |

---

## 🛠️ Phase 1: Core Reliability & Foundation

### 1.1. Robust Migration Engine (Backend) ✅ Done

**Goal:** Move from raw SQL files to a robust, rollback-capable migration system using Kysely.

- **Status**: Implemented via `migrator.js` + `index.js` auto-run.
- **Strategy**:
  - Replicated SQL schema into JS migration files (`20251217_init.js`).
  - Added `path` migration (`20251218_add_path_to_webhooks.js`).

### 1.3. Custom Webhook Paths (Frontend/Backend) ✅ Done

**Goal:** Allow users to define semantic URL slugs (e.g., `/hook/stripe-payment`).

- **Features**:
  - **UI**: Path input with base URL preview (n8n style).
  - **Backend**: Validation and Unique Constraint.
  - **Schema**: Added `path` column.

### 1.2. Provider Presets & Quirks (Frontend/Backend)

**Goal:** "Zero-config" OAuth for popular providers.

- **Support**: Google, Facebook, Shopify, Slack, Mailchimp, GitHub, PayPal, Discord, Jira.
- **Strategy**:
  - **Frontend**: `ProviderPresetsGrid` component with brand logos (`simple-icons`).
  - **Config**: JSON-based preset definitions (auth URL, token URL, default scopes).
  - **Backend**: Handling for provider quirks (e.g., non-standard header requirements).

---

## 🔐 Phase 2: Security & Token Lifecycle

### 2.1. OAuth Token Storage & Management (GUI)

**Goal:** Securely manage the complete lifecycle of obtained credentials.

- **Frontend**:
  - Enhance `/tokens` page.
  - Show "Expires In" countdown (calculated from `expires_at`).
  - **Actions**:
    - **Refresh**: Manually trigger `refresh_token` flow.
    - **Revoke**: Call provider revocation endpoint.
    - **Reveal**: decryption on-demand for "Click to Copy".
- **Backend**:
  - `POST /api/tokens/:id/refresh`: Handle refresh logic.
  - `POST /api/tokens/:id/revoke`: Best-effort revocation.

### 2.2. Pre-checking Mechanism

**Goal:** Reduce failure rates by validating inputs before the flow starts.

- **Strategy**:
  - **Scope Validation**: Regex check of requested scopes.
  - **Dry Run**: "Test Auth URL" button (opens popup to provider consent screen to verify Client ID/Secret).

---

## 📊 Phase 3: Data Visibility & Analytics

### 3.1. Webhook Log Viewer (Advanced)

**Goal:** Deep historical analysis of webhook traffic.

- **Frontend**:
  - Dedicated `/webhooks/logs` page.
  - **Filters**: Method, Source IP, Date Range, JSON Content matching.
  - **Architecture**: `tanstack/react-table` with server-side pagination.
- **Backend**: Optimize `GET /api/webhooks` with advanced query params and DB indexes.

### 3.2. Payload Difference Viewer

**Goal:** Debug schema changes or data drift.

- **UI**: "Compare Mode" in Webhook Details.
- **Tech**: `jsondiffpatch` or `react-diff-viewer` (split view).
- **Features**: Highlight added/removed keys between any two selected requests.

### 3.3. Webhook Retention Settings

**Goal:** Manage storage growth and privacy.

- **UI**: "Settings" tab in Webhook Details.
- **Feature**: Configurable expiration (1, 7, 30 days or "Forever").
- **Backend**: Background cron job to purge expired `webhook_requests`.

---

## 🧠 Phase 4: Developer Experience & Education

### 4.1. Interactive Integration Guides

**Goal:** In-app wizard for setting up providers.

- **Content**: JSON schema for "Provider Guides" (`guides/slack.json`).
- **UI**: Split-screen "Wizard Mode" (Guide on Left, Form on Right).
- **Assets**: Screenshots of provider developer consoles.

### 4.2. OAuth Flow Visualizer

**Goal:** Demystify the OAuth process for learners.

- **Tech**: `reactflow` or CSS animations.
- **Visualization**: Steps: Browser ➡️ Provider ➡️ Callback ➡️ Backend ➡️ Token.
- **Real-time**: Highlight active step during the actual flow (using SSE/Sockets).

---

## 📝 Success Metrics

- **Zero Config**: Users can add Google/GitHub without looking up URLs.
- **Reliability**: Migrations never fail; Token refreshes work 100%.
- **Clarity**: Users understand exactly _what_ data they received and _how_ the flow worked.

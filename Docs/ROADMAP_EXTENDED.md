# 🗺️ Roadmap: Enhanced Analysis & Automation

This document outlines the detailed implementation strategy for the upcoming features defined in `GEMINI.md`.

## 1. Payload Difference Viewer (GUI)

**Goal:** Visualize differences between two webhook payloads to debug schema changes or data drift.

- **Frontend**: Add "Compare Mode" to Webhook Details. Select Baseline vs. Target. Use `react-diff-viewer`.
- **Backend**: No changes required.

## 2. Webhook Log Viewer (GUI)

**Goal:** Advanced filtering and history management.

- **Frontend**: New `/webhooks/logs` page with filters (Method, IP, Date, JSON Content). Use `tanstack/react-table`.
- **Backend**: Optimize `GET /api/webhooks` with query params. Add DB indexes.

## 3. OAuth Flow Visualizer (GUI)

**Goal:** Demystify the OAuth process.

- **Frontend**: Visual diagram (User -> Provider -> Backend -> Token) using `reactflow` or CSS animations. Real-time status steps.
- **Backend**: Expose fine-grained status events (if needed) or distinct logs for each step.

## 4. OAuth Token Storage (GUI)

**Goal:** Secure management of credentials.

- **Frontend**: Enhance `/tokens`. Show expiry. Actions: Refresh, Revoke, Delete, Copy.
- **Backend**: New endpoints: `POST /api/tokens/:id/refresh`, `POST /api/tokens/:id/revoke`. Use AES-256 (existing).

## 5. Pre-checking Mechanism

**Goal:** Verify scope validity.

- **Strategy**: Regex header checks for scopes. "Dry Run" Auth button (open popup, stop at consent).
- **UI**: Health check badges on provider cards.

## 6. Interactive Integration Guides

**Goal:** Step-by-step wizards.

- **Strategy**: JSON schema for guides (`guides/slack.json`). "Wizard Mode" in UI with split screen (Guide + Form).

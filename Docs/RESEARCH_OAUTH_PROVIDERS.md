# 🕵️ Research: Top OAuth Integrations for Automation

**Date**: 2025-12-17
**Objective**: Identify top 3rd party APIs for the "Provider Presets" feature to simplify setup for automation enthusiasts (n8n, Make, generic scripts).

## 🏆 Top Requested Integrations

Based on 2024 automation trends (n8n, Zapier ecosystem), these are the high-priority targets:

| Priority | Provider           | Category      | Primary Use Case                                    |
| :------- | :----------------- | :------------ | :-------------------------------------------------- |
| **P0**   | **Google**         | Productivity  | Gmail, Sheets, Calendar, Drive. (Complex scopes).   |
| **P0**   | **Spotify**        | Entertainment | Now Playing, Playlist automation. (Standard OAuth). |
| **P1**   | **GitHub**         | Developer     | Repos, Issues, CI/CD triggering.                    |
| **P1**   | **Discord**        | Social/Bot    | Chat bots, server management.                       |
| **P1**   | **Slack**          | Business      | Notifications, internal tools.                      |
| **P2**   | **Notion**         | Productivity  | Knowledge base automation.                          |
| **P2**   | **Linear**         | Project Mgmt  | Issue tracking.                                     |
| **P3**   | **Meta (Threads)** | Social        | Posting updates from automation.                    |

---

## 🛠️ Provider Technical Specs (Presets)

### 1. Google

- **Auth URL**: `https://accounts.google.com/o/oauth2/v2/auth`
- **Token URL**: `https://oauth2.googleapis.com/token`
- **Quirks**: requires `access_type=offline` for refresh tokens. Needs strict Redirect URI matching.
- **Popular Scopes**: `https://www.googleapis.com/auth/spreadsheets`, `https://www.googleapis.com/auth/calendar`

### 2. Spotify

- **Auth URL**: `https://accounts.spotify.com/authorize`
- **Token URL**: `https://accounts.spotify.com/api/token`
- **Quirks**: Supports PKCE perfectly.
- **Popular Scopes**: `user-read-currently-playing`, `playlist-modify-public`

### 3. GitHub

- **Auth URL**: `https://github.com/login/oauth/authorize`
- **Token URL**: `https://github.com/login/oauth/access_token`
- **Quirks**: Returns standard JSON, but sometimes XML if header not set (Axios handles this).
- **Popular Scopes**: `repo`, `user`

### 4. Discord

- **Auth URL**: `https://discord.com/oauth2/authorize`
- **Token URL**: `https://discord.com/api/oauth2/token`
- **Popular Scopes**: `identify`, `bot`

### 5. Meta (Threads)

- **Auth URL**: `https://threads.net/oauth/authorize`
- **Token URL**: `https://graph.threads.net/oauth/access_token`
- **Quirks**: Short-lived tokens by default. Requires "Exchange" step for long-lived tokens (Action Item: Add "Token Exchange" logic to Backend?).

---

## 🚀 Proposed Feature: "Provider Presets"

**Problem**: Users hate looking up "Authorize URL" and "Token URL" every time.
**Solution**: A dropdown in the "Add Provider" modal.

### Implementation Plan

1.  **Frontend**:
    - Add `SelectPreset` component in `Providers` modal.
    - On selection, auto-fill `Auth URL`, `Token URL`, and suggest `Scopes`.
    - Display provider logo (SVG/Icon) if preset is used.
2.  **Backend**:
    - No schema change needed (data is stored as strings).
    - (Optional) Add specific "Token Exchange" logic for Meta/Instagram long-lived tokens if needed later.

### "Automation Ready"

For n8n/Make users, we can also provide a **"Copy Config JSON"** button to easily paste these credentials into their external tools.

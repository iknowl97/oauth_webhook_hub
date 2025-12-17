# OAuth & Webhook Hub

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)
![Node.js](https://img.shields.io/badge/backend-Fastify-black?logo=nodedotjs)
![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/style-Tailwind-38B2AC?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?logo=postgresql)

> **A self-hosted, centralized Swiss Army Knife for managing OAuth 2.0 flows and inspecting Webhooks.**

---

## 🚀 Motivation

Many enthusiasts are starting to enter the world of automation, and I am no exception. Recently, I have become fascinated with integrations, especially those related to AI. This has led to the need to frequently deal with OAuth and similar connections that require callback links, client secrets, and token management, as well as testing webhooks from various services.

Based on this, I got down to business and decided to implement a project that would make it easy to create and manage OAuth Apps and Webhooks in one place.

Whether you are building an **n8n workflow**, a custom automation script, or just testing a new API integration, **OAuth & Webhook Hub** serves as your centralized authentication vault and inspection deck. No more spinning up temporary servers or wrestling with redirect URIs for every little experiment.

---

## ✨ Features

### 🛡️ OAuth Hub

- **Universal Redirect URI**: Use a single callback URL (`/oauth/callback`) for all your apps (Google, GitHub, Spotify, etc.).
- **Token Vault**: Securely store Access and Refresh tokens encrypted with AES-256.
- **PKCE Support**: Industry-standard security for your auth flows.
- **Refresh Logic**: (Coming soon) Auto-refresh capabilities for long-running automations.

### 🪝 Webhook Inspector

- **Instant Endpoints**: Generate unique webhook URLs (`/hook/xyz`) on the fly.
- **Real-time Logging**: Inspect headers, body, and query parameters of incoming requests.
- **Forwarding**: Automatically forward incoming webhooks to your local dev environment or other services (like n8n).

### 🖥️ Modern UI

- **Dashboard**: At-a-glance health metrics and quick actions.
- **Dark Mode**: sleek, glassmorphism-inspired "Zn/Slate" aesthetic.
- **Responsive**: Fully mobile-compatible sidebar layout.

---

## 🛠️ Tech Stack

- **Infrastructure**: Docker Compose (PostgreSQL, Nginx, Node.js)
- **Backend**: Node.js, Fastify, Kysely (SQL Builder), AES-256 Encryption
- **Frontend**: React (Vite), Tailwind CSS (Shadcn-like components), Axios
- **Database**: PostgreSQL 16

---

## ⚙️ Configuration

The project is configured using a `.env` file. You must copy `.env.example` to `.env` and adjust the values.

### 🔐 Environment Variables Explained

| Variable           | Description                                                                                                                                                       | Example / Default          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **APP_BASE_URL**   | The public URL of your Hub. Used for generating redirect URIs. For local dev, this matches Nginx.                                                                 | `http://localhost`         |
| **APP_ENV**        | Environment mode (`development` or `production`).                                                                                                                 | `production`               |
| **APP_PORT**       | Internal backend port (mapped in Docker).                                                                                                                         | `3000`                     |
| **DB\_...**        | Database credentials. `DB_HOST` must be `db` inside Docker.                                                                                                       | `db` / `oauthhub`          |
| **ENCRYPTION_KEY** | **CRITICAL**. A master password used to encrypt stored Client Secrets and Tokens. **If you lose this, you lose your data.** It is hashed to create a 32-byte key. | `my-super-secret-key-1234` |
| **JWT_SECRET**     | Secret used for signing session tokens (future user auth).                                                                                                        | `random-string`            |

---

## 🏁 Getting Started

We have designed this project to be "zero-config" for local usage.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/iknowl97/oauth-webhook-hub.git
   cd oauth-webhook-hub
   ```

2. **Setup Environment**

   ```bash
   cp .env.example .env
   ```

   _Note: Open `.env` and set your own secure `ENCRYPTION_KEY`._

3. **Run with Docker**

   ```bash
   docker compose up -d
   ```

4. **Access the Hub**
   Open **[http://localhost](http://localhost)** in your browser.

For a detailed step-by-step guide, see **[EASY_SETUP.md](./Docs/EASY_SETUP.md)**.

For comprehensive documentation on features, see **[DOCUMENTATION.md](./Docs/DOCUMENTATION.md)**.

---

## 5. Troubleshooting

**Issue**: "Address already in use"
**Fix**: Check `docker-compose.yml` port mappings. Ensure host ports (e.g., 443) aren't taken by other services (like a host-level Nginx).

**Issue**: "Backend restarting loop"
**Fix**: Likely Database Password mismatch.

1. Check `.env` for `$$` escaping.
2. Run `docker compose down -v` to reset DB volume and re-initialize password.

**Issue**: "DNS/SSL errors with sub-sub-domains"
**Description**: Using deep subdomains (e.g., `app.dev.example.com`) can cause SSL issuance failures or DNS propagation delays.
**Fix**: Simplify to a single-level subdomain (e.g., `app.example.com`).

1. Update `APP_BASE_URL` in `.env`.
2. Update your host Nginx config.
3. Restart: `docker compose up -d`.

---

## 📸 Screenshots

_(Add your screenshots here)_

---

## 👤 Author

**iknowl97**

Built with ❤️ for the Automation & AI Community.

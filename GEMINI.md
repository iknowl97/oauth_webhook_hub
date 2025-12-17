# Project: OAuth & Webhook Hub

## Project Overview

This project is a self-hosted, Dockerized service that provides a centralized hub for managing OAuth 2.0 flows and a testing panel for webhooks. It is designed to streamline development workflows by offering a single, stable redirect URI for various OAuth providers and a comprehensive interface for inspecting, replaying, and forwarding webhook requests.

**Key Features:**

*   **OAuth Hub:**
    *   Provides a single redirect URI (`/oauth/callback`) for all configured providers (e.g., Google, GitHub, Spotify).
    *   A UI for managing OAuth provider configurations (client ID, secret, scopes).
    *   Securely stores and manages access and refresh tokens.
    *   Supports PKCE for enhanced security.
*   **Webhook Panel:**
    *   Generates dynamic webhook endpoints (`/hook/{id}`).
    *   Logs incoming webhook requests, including headers, body, and query parameters.
    *   Allows for replaying requests to different URLs for testing.
    *   Can automatically forward incoming webhooks to another URL.

**Architecture & Technologies:**

*   **Backend:** Node.js with Fastify
*   **Frontend:** React (or a similar framework like Vue/Svelte) with Tailwind CSS
*   **Database:** PostgreSQL for storing provider configurations, tokens, and webhook logs.
*   **Deployment:** The entire application is containerized using Docker and orchestrated with Docker Compose. An Nginx container is included for acting as a reverse proxy and handling SSL/TLS.

## Building and Running

The application is designed to be run with Docker Compose.

**Prerequisites:**

*   Docker
*   Docker Compose

**Setup and Execution:**

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd oauth-webhook-hub
    ```

2.  **Configure Environment:**
    *   Create a `.env` file from the example template:
        ```bash
        cp .env.example .env
        ```
    *   Edit the `.env` file to set the `APP_BASE_URL`, database credentials, and security secrets (`JWT_SECRET`, `ENCRYPTION_KEY`, `ADMIN_PASSWORD`).

3.  **Build and Run the Application:**
    ```bash
    docker compose build
    docker compose up -d
    ```

4.  **Accessing the Application:**
    *   The application will be available at the `APP_BASE_URL` specified in your `.env` file.
    *   The primary redirect URI for all OAuth applications will be `${APP_BASE_URL}/oauth/callback`.

5.  **Stopping the Application:**
    ```bash
    docker compose down
    ```

## Development Conventions

*   **Code Structure:** The project is organized into three main directories:
    *   `backend/`: Contains the Node.js/Fastify API.
    *   `frontend/`: Contains the React/Vue frontend application.
    *   `nginx/`: Contains the Nginx configuration.
*   **Database:** The database schema is managed via SQL migration files located in `backend/src/db/migrations/`. Migrations are expected to run automatically on backend startup.
*   **Security:**
    *   Sensitive data (like client secrets and tokens) is encrypted at rest in the database using AES-256-GCM.
    *   Secrets and configuration are managed via the `.env` file and should not be committed to version control.
*   **API:** The backend exposes a RESTful API for managing providers, tokens, and webhooks. Refer to the `TechSpec.md` for detailed API endpoint specifications.
*   **Logging:** The backend application is configured to output structured JSON logs to `stdout` and rotate log files.

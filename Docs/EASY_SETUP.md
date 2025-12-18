# 🚀 Easy Setup Guide

This guide will help you get the **OAuth & Webhook Hub** running on your computer in less than 5 minutes.

## Prerequisites

You need to have **Docker** installed.

- **Windows/Mac**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- **Linux**: Install Docker Engine and Docker Compose.

_Verify installation:_
Open your terminal (Command Prompt, PowerShell, or Terminal) and type:

```bash
docker --version
```

If you see a version number, you are ready!

---

## Step-by-Step Installation

### 1. Download the Project

Download the project files to a folder on your computer.

```bash
git clone https://github.com/iknowl97/oauth-webhook-hub.git
cd oauth-webhook-hub
```

### 2. Configure Settings

We have provided a default configuration file. You just need to activate it and set your secrets.

**Windows (PowerShell):**

```powershell
copy .env.example .env
```

**Mac/Linux:**

```bash
cp .env.example .env
```

**⚠️ IMPORTANT CONFIGURATION:**
Open the newly created `.env` file in a text editor (Notepad, VS Code, etc.).
Find the line `ENCRYPTION_KEY`.
Change the default value to a unique, secure password.

- **Why?** This key encrypts your OAuth tokens and client secrets in the database.
- **Warning:** If you change this key later, all previously stored tokens will become unreadable. **Do not lose this key.**

### 3. Start the Engines

Run this command to build and start the application. This might take a few minutes the first time as it downloads the necessary parts.

```bash
docker compose up -d --build
```

### 4. Verify It's Running

Once the command finishes, open your web browser and go to:
👉 **[http://localhost](http://localhost)**

You should see the Dashboard!

---

## 🛑 How to Stop

To stop the application and free up your computer's resources:

```bash
docker compose down
```

## ❓ Troubleshooting

**"Port is already allocated"**
If you see an error saying Port 80 or 3000 is needed, you might have another web server running.

1. Open `.env` file.
2. Change `PORT=3000` to `PORT=3001` or similar.
3. Note: If you change Nginx ports in `docker-compose.yml`, you will access the site at that new port (e.g., `http://localhost:8080`).

**"Database connection failed"**
Wait a few seconds. Sometimes the database takes a moment to wake up. Refresh the page.

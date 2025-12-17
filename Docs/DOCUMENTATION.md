# 📖 User Documentation

## Introduction

The **OAuth & Webhook Hub** is a tool designed to sit between your third-party services (like Google, Stripe, Notion) and your automation tools (like n8n, Python scripts, or local apps). It simplifies the authentication process and debugging.

---

## 🛡️ OAuth Hub Guide

### What is it?

When you want to access user data from a service like Google, you need to "Log in with Google". This requires setting up a "Redirect URI" in the Google Developer Console. Instead of setting up a new server for every script you write, you use this Hub.

### 1. Configure a Provider

1. Go to the **Providers** page.
2. Click **+ Add Provider**.
3. Fill in the details from your external service (e.g., GitHub):
   - **Name**: "My GitHub App"
   - **Type**: OAuth 2.0
   - **Client ID**: (From GitHub)
   - **Client Secret**: (From GitHub)
   - **Auth URL**: `https://github.com/login/oauth/authorize`
   - **Token URL**: `https://github.com/login/oauth/access_token`
   - **Scopes**: `user:email, repo` (comma separated)
4. **Crucial Step**: In your external service (e.g., GitHub), set the **Callback URL** to:
   ```
   http://localhost/oauth/callback
   ```

### 2. Start Authentication

1. On the Provider card, click **Start Auth Flow**.
2. A popup will appear asking you to log in to the service.
3. Once approved, the popup closes, and your Tokens are saved securely.

### 3. Manage Tokens

1. Go to the **Tokens** page.
2. You will see your new Access Token and Refresh Token.
3. You can copy these tokens to use in your scripts or automation tools.
4. If a token is compromised or no longer needed, click the **Trash** icon to revoke/delete it.

---

## 🪝 Webhook Inspector Guide

### What is it?

A webhook is a way for an app to send automated messages or information to another app. This Inspector lets you see exactly what those messages look like before you process them.

### 1. Create a Listener

1. Go to the **Webhooks** page.
2. Click the **+** button in the sidebar.
3. **Description**: Give it a name (e.g., "Stripe Payments").
4. **Response Status**: Default is `200` (OK). You can change this to `400` or `500` to test how your sender handles errors.
5. **Forward URL** (Optional): If you want to forward the data to another tool (like n8n running on port 5678), enter that URL here.
6. Click **Generate Endpoint**.

### 2. Send Data

1. You will see a URL like `http://localhost/hook/abcd-1234`.
2. Send a POST request to this URL using Postman, curl, or your external service.
   ```bash
   curl -X POST http://localhost/hook/abcd-1234 -d '{"hello": "world"}'
   ```

### 3. Inspect Requests

1. The request will appear instantly in the main view.
2. Click on the request log to see the **Headers**, **Body**, and **Metadata**.
3. Use this info to debug your integrations.

### 4. Custom Domains (Sub-Bindings)

1. Go to the **Custom Domains** page (Sidebar).
2. Click **New Binding**.
3. Choose a **Subdomain Prefix** (e.g., `stripe`) and select a target Webhook.
4. Your webhook is now accessible at `http://stripe.oauthhub.work.gd` (or your configured domain).
5. All requests to this subdomain are logged under the selected Webhook.

---

## ⚙️ System Architecture

- **Frontend**: Runs in your browser, communicates with the Backend API.
- **Backend API**: Handles the logic, encryption, and database storage.
- **Database**: Stores your secrets encrypted (`AES-256-GCM`).
- **Nginx**: Handles routing, making sure `http://localhost` works smoothly for both the UI and the API.

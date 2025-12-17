# Remote Server Configuration for Subdomains

To make the new **Webhook Sub-Binding** feature work on your remote server (`oauthhub.work.gd`), you need to update your **Remote Reverse Proxy** (Nginx, Traefik, or Caddy) to handle wildcard subdomains.

## 1. DNS Configuration

Ensure you have a **Wildcard A Record** pointing to your server IP:

- Type: `A`
- Name: `*` (or `*.oauthhub`)
- Value: `<YOUR_SERVER_IP>`

## 2. Remote Nginx Configuration

Update your remote Nginx config to forward the `Host` header for all subdomains.

```nginx
server {
    listen 80;
    server_name oauthhub.work.gd *.oauthhub.work.gd;

    location / {
        # Forward to your local tunnel or Docker port
        proxy_pass http://localhost:YOUR_LOCAL_PORT;

        # CRITICAL: Preserve the Host header so the Backend knows which subdomain was called
        proxy_set_header Host $host;

        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 3. SSL (Certbot)

If using Certbot, request a wildcard certificate (requires DNS challenge) or multiple certificates.

```bash
certbot -d oauthhub.work.gd -d *.oauthhub.work.gd --manual --preferred-challenges dns certonly
```

_Note: HTTP-01 challenge does not work for wildcards._

## 4. Verification

1. Create a subdomain binding in the UI (e.g., `test`).
2. Visit `http://test.oauthhub.work.gd`.
3. It should hit your backend.

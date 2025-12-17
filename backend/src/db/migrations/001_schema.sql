-- OAuth Providers
CREATE TABLE IF NOT EXISTS oauth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('oauth2', 'oidc')),
  auth_url TEXT,
  token_url TEXT,
  userinfo_url TEXT,
  discovery_url TEXT,
  client_id TEXT NOT NULL,
  client_secret TEXT, -- encrypted
  scopes TEXT[],
  extra_params JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth Sessions (temporary)
CREATE TABLE IF NOT EXISTS oauth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES oauth_providers(id),
  state VARCHAR(255) UNIQUE NOT NULL,
  code_verifier TEXT,
  redirect_back TEXT,
  label VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- OAuth Tokens
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES oauth_providers(id),
  label VARCHAR(255),
  access_token TEXT NOT NULL, -- encrypted
  refresh_token TEXT, -- encrypted
  token_type VARCHAR(50) DEFAULT 'Bearer',
  expires_at TIMESTAMP,
  scopes TEXT[],
  user_info JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id VARCHAR(20) PRIMARY KEY, -- short ID
  path VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  expected_method VARCHAR(10),
  response_status INTEGER DEFAULT 200,
  response_headers JSONB,
  response_body_template TEXT,
  response_delay_ms INTEGER DEFAULT 0,
  forward_url TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Requests
CREATE TABLE IF NOT EXISTS webhook_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id VARCHAR(20) REFERENCES webhooks(id) ON DELETE CASCADE,
  method VARCHAR(10) NOT NULL,
  url TEXT NOT NULL,
  query_params JSONB,
  headers JSONB NOT NULL,
  body_text TEXT,
  body_binary BYTEA,
  remote_ip INET,
  user_agent TEXT,
  response_status INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_state ON oauth_sessions(state);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_expires ON oauth_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_oauth_tokens_provider ON oauth_tokens(provider_id);
CREATE INDEX IF NOT EXISTS idx_webhook_requests_webhook ON webhook_requests(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_requests_created ON webhook_requests(created_at DESC);

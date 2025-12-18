const { sql } = require('kysely');

async function up(db) {
  // 1. OAuth Providers
  await db.schema
    .createTable('oauth_providers')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('auth_url', 'text')
    .addColumn('token_url', 'text')
    .addColumn('userinfo_url', 'text')
    .addColumn('discovery_url', 'text')
    .addColumn('client_id', 'text', (col) => col.notNull())
    .addColumn('client_secret', 'text')
    .addColumn('scopes', sql`text[]`)
    .addColumn('extra_params', 'jsonb')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();

  // 2. OAuth Sessions
  await db.schema
    .createTable('oauth_sessions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('provider_id', 'uuid', (col) => col.references('oauth_providers.id').onDelete('cascade'))
    .addColumn('state', 'text', (col) => col.notNull().unique())
    .addColumn('code_verifier', 'text')
    .addColumn('redirect_back', 'text')
    .addColumn('label', 'text')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('expires_at', 'timestamp')
    .execute();

  // 3. OAuth Tokens
  await db.schema
    .createTable('oauth_tokens')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('provider_id', 'uuid', (col) => col.references('oauth_providers.id').onDelete('cascade'))
    .addColumn('label', 'text')
    .addColumn('access_token', 'text', (col) => col.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('token_type', 'text', (col) => col.defaultTo('Bearer'))
    .addColumn('expires_at', 'timestamp')
    .addColumn('scopes', sql`text[]`)
    .addColumn('user_info', 'jsonb')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();

  // 4. Webhooks
  await db.schema
    .createTable('webhooks')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey()) // nanoid
    .addColumn('path', 'text', (col) => col.unique().notNull())
    .addColumn('description', 'text')
    .addColumn('expected_method', 'text')
    .addColumn('response_status', 'integer', (col) => col.defaultTo(200))
    .addColumn('response_headers', 'jsonb')
    .addColumn('response_body_template', 'text')
    .addColumn('response_delay_ms', 'integer', (col) => col.defaultTo(0))
    .addColumn('forward_url', 'text')
    .addColumn('expires_at', 'timestamp')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();

  // 5. Webhook Requests
  await db.schema
      .createTable('webhook_requests')
      .ifNotExists()
      .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
      .addColumn('webhook_id', 'text', (col) => col.notNull().references('webhooks.id').onDelete('cascade'))
      .addColumn('method', 'text', (col) => col.notNull())
      .addColumn('url', 'text', (col) => col.notNull())
      .addColumn('query_params', 'jsonb')
      .addColumn('headers', 'jsonb', (col) => col.notNull())
      .addColumn('body_text', 'text')
      .addColumn('body_binary', 'bytea')
      .addColumn('remote_ip', 'text')
      .addColumn('user_agent', 'text')
      .addColumn('response_status', 'integer')
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
      .execute();

  // Indexes
  await db.schema.createIndex('idx_oauth_sessions_state').on('oauth_sessions').column('state').execute();
  await db.schema.createIndex('idx_oauth_tokens_provider').on('oauth_tokens').column('provider_id').execute();
  await db.schema.createIndex('idx_webhook_requests_webhook').on('webhook_requests').column('webhook_id').execute();
}

async function down(db) {
  await db.schema.dropTable('webhook_requests').ifExists().execute();
  await db.schema.dropTable('webhooks').ifExists().execute();
  await db.schema.dropTable('oauth_tokens').ifExists().execute();
  await db.schema.dropTable('oauth_sessions').ifExists().execute();
  await db.schema.dropTable('oauth_providers').ifExists().execute();
}

module.exports = { up, down };

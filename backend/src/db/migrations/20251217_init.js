const { sql } = require('kysely');

async function up(db) {
  // Providers Table
  await db.schema
    .createTable('providers')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('authorization_url', 'text', (col) => col.notNull())
    .addColumn('token_url', 'text', (col) => col.notNull())
    .addColumn('client_id', 'text', (col) => col.notNull())
    .addColumn('client_secret', 'text', (col) => col.notNull()) // Encrypted
    .addColumn('scope', 'text')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();

  // Tokens Table
  await db.schema
    .createTable('tokens')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('provider_id', 'text', (col) => col.notNull().references('providers.id').onDelete('cascade'))
    .addColumn('access_token', 'text', (col) => col.notNull()) // Encrypted
    .addColumn('refresh_token', 'text') // Encrypted
    .addColumn('expires_at', 'timestamp')
    .addColumn('metadata', 'jsonb')
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();
    
    // Webhooks Table
    await db.schema
      .createTable('webhooks')
      .ifNotExists()
      .addColumn('id', 'text', (col) => col.primaryKey())
      .addColumn('name', 'text')
      .addColumn('provider', 'text')
      .addColumn('forward_url', 'text')
      .addColumn('response_status', 'integer', (col) => col.defaultTo(200))
      .addColumn('response_headers', 'jsonb')
      .addColumn('response_body_template', 'text')
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
      .execute();
}

async function down(db) {
  await db.schema.dropTable('webhooks').ifExists().execute();
  await db.schema.dropTable('tokens').ifExists().execute();
  await db.schema.dropTable('providers').ifExists().execute();
}

module.exports = { up, down };

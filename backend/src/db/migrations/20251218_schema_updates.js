const { sql } = require('kysely');

async function up(db) {
  // Add 'type' to providers
  await db.schema
    .alterTable('providers')
    .addColumn('type', 'text', (col) => col.defaultTo('oauth2'))
    .execute();

  // Create Webhook Requests Table (Logs)
  await db.schema
      .createTable('webhook_requests')
      .ifNotExists()
      .addColumn('id', 'serial', (col) => col.primaryKey())
      .addColumn('webhook_id', 'text', (col) => col.notNull().references('webhooks.id').onDelete('cascade'))
      .addColumn('method', 'text')
      .addColumn('url', 'text')
      .addColumn('query_params', 'jsonb')
      .addColumn('headers', 'jsonb')
      .addColumn('body_text', 'text')
      .addColumn('remote_ip', 'text')
      .addColumn('user_agent', 'text')
      .addColumn('response_status', 'integer')
      .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
      .execute();
}

async function down(db) {
  await db.schema.dropTable('webhook_requests').ifExists().execute();
  await db.schema.alterTable('providers').dropColumn('type').execute();
}

module.exports = { up, down };

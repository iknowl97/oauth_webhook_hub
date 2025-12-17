const { sql } = require('kysely');

async function up(db) {
  await db.schema
    .createTable('subdomain_bindings')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('subdomain', 'text', (col) => col.notNull().unique())
    .addColumn('webhook_id', 'text', (col) => col.notNull().references('webhooks.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .addColumn('active', 'boolean', (col) => col.defaultTo(true))
    .execute();
    
  // Index for fast lookup by subdomain
  await db.schema
    .createIndex('idx_subdomain_bindings_subdomain')
    .on('subdomain_bindings')
    .column('subdomain')
    .execute();
}

async function down(db) {
  await db.schema.dropTable('subdomain_bindings').ifExists().execute();
}

module.exports = { up, down };

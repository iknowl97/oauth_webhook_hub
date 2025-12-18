const { sql } = require("kysely");

async function up(db) {
  // 1. Add 'path' column to webhooks if it doesn't exist
  // We check via "ifNotExists" logic or just try catch in raw SQL,
  // but Kysely doesn't strictly support "add column if not exists" in all drivers easily.
  // However, since we know 20251217_init.js didn't have it, we can safely add it.
  // We'll add it as nullable first to support backfill.

  await db.schema.alterTable("webhooks").addColumn("path", "text").execute();

  // 2. Backfill existing rows: path = '/hook/' + id
  // using raw sql for update with concatenation
  await sql`UPDATE webhooks SET path = '/hook/' || id WHERE path IS NULL`.execute(
    db
  );

  // 3. Add Unique Constraint and Not Null
  await db.schema
    .alterTable("webhooks")
    .alterColumn("path", (col) => col.setNotNull())
    .addUniqueConstraint("webhooks_path_unique", ["path"])
    .execute();

  // 4. Index on path for faster lookups
  await db.schema
    .createIndex("idx_webhooks_path")
    .on("webhooks")
    .column("path")
    .execute();
}

async function down(db) {
  await db.schema.alterTable("webhooks").dropColumn("path").execute();
}

module.exports = { up, down };

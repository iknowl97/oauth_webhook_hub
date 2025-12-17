const { db } = require('../db/connection');
const { nanoid } = require('nanoid');

async function subdomainRoutes(fastify, options) {
  
  // GET /api/subdomains (List all)
  fastify.get('/', async (request, reply) => {
    const list = await db
        .selectFrom('subdomain_bindings')
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();
    return list;
  });

  // POST /api/subdomains (Create binding)
  fastify.post('/', async (request, reply) => {
    const { subdomain, webhook_id } = request.body;

    if (!subdomain || !webhook_id) {
        return reply.code(400).send({ error: 'subdomain and webhook_id are required' });
    }

    // Check availability
    const existing = await db
        .selectFrom('subdomain_bindings')
        .where('subdomain', '=', subdomain)
        .executeTakeFirst();
        
    if (existing) {
        return reply.code(409).send({ error: 'Subdomain already taken' });
    }

    const id = nanoid();
    await db.insertInto('subdomain_bindings')
        .values({
            id,
            subdomain,
            webhook_id,
            active: true,
            created_at: new Date() // Kysely might handle default, but explicit is safe
            // owner_id: 'system' // Skipped for MVP
        })
        .execute();
        
    return { status: 'created', id, subdomain, full_url: `http://${subdomain}.${process.env.APP_BASE_URL ? new URL(process.env.APP_BASE_URL).hostname : 'oauthhub.work.gd'}` };
  });

  // DELETE /api/subdomains/:id
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params;
    await db.deleteFrom('subdomain_bindings').where('id', '=', id).execute();
    return { status: 'deleted' };
  });
}

module.exports = subdomainRoutes;

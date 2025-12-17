const { nanoid } = require('nanoid');

async function hookRoutes(fastify, options) {
  const { db } = require('../db/connection');

  // List Webhooks
  fastify.get('/api/hooks', async (request, reply) => {
    const hooks = await db.selectFrom('webhooks')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    return hooks;
  });

  // Create Webhook
  fastify.post('/api/hooks', async (request, reply) => {
    const { description, response_body_template, response_status, response_headers, forward_url } = request.body;
    
    const id = nanoid(10); // Short ID
    const path = `/hook/${id}`;

    const result = await db.insertInto('webhooks')
      .values({
        id,
        path,
        description,
        response_status: response_status || 200,
        response_headers: response_headers || {},
        response_body_template: response_body_template || '{"status":"ok"}',
        forward_url,
        created_at: new Date()
      })
      .returningAll()
      .executeTakeFirst();

    return result;
  });

  // Get Webhook
  fastify.get('/api/hooks/:id', async (request, reply) => {
      const { id } = request.params;
      const hook = await db.selectFrom('webhooks')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst();
      if (!hook) return reply.code(404).send({ error: 'Not found' });
      return hook;
  });

  // Delete Webhook
  fastify.delete('/api/hooks/:id', async (request, reply) => {
      const { id } = request.params;
      await db.deleteFrom('webhooks').where('id', '=', id).execute();
      return { success: true };
  });

  // Get Webhook Requests (Logs)
  fastify.get('/api/hooks/:id/requests', async (request, reply) => {
    const { id } = request.params;
    const { limit, offset } = request.query;
    
    const requests = await db.selectFrom('webhook_requests')
      .selectAll()
      .where('webhook_id', '=', id)
      .orderBy('created_at', 'desc')
      .limit(limit || 50)
      .offset(offset || 0)
      .execute();
      
    return requests;
  });
}

module.exports = hookRoutes;

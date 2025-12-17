const { encryption } = require('../services/encryption'); // Assuming we use it later

async function providerRoutes(fastify, options) {
  const { db } = require('../db/connection');
  const { encrypt, decrypt } = require('../services/encryption');

  // List Providers
  fastify.get('/api/providers', async (request, reply) => {
    const providers = await db.selectFrom('oauth_providers')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    
    // Do not return secret
    return providers.map(p => ({
      ...p,
      client_secret: p.client_secret ? '***' : null
    }));
  });

  // Create Provider
  fastify.post('/api/providers', async (request, reply) => {
    const { name, type, client_id, client_secret, scopes, auth_url, token_url, discovery_url } = request.body;
    
    // Basic validation
    if (!name || !client_id) {
        return reply.code(400).send({ error: 'Name and Client ID are required' });
    }

    const encryptedSecret = client_secret ? encrypt(client_secret) : null;

    const result = await db.insertInto('oauth_providers')
      .values({
        name,
        type,
        client_id,
        client_secret: encryptedSecret,
        scopes: scopes || [], // Array
        auth_url,
        token_url,
        discovery_url,
      })
      .returningAll()
      .executeTakeFirst();

    return result;
  });

  // Get Provider
  fastify.get('/api/providers/:id', async (request, reply) => {
     const { id } = request.params;
     const provider = await db.selectFrom('oauth_providers')
       .selectAll()
       .where('id', '=', id)
       .executeTakeFirst();
     
     if (!provider) return reply.code(404).send({ error: 'Not found' });
     return { ...provider, client_secret: '***' };
  });

  // Delete Provider
  fastify.delete('/api/providers/:id', async (request, reply) => {
    const { id } = request.params;
    await db.deleteFrom('oauth_providers').where('id', '=', id).execute();
    return { success: true };
  });
}

module.exports = providerRoutes;

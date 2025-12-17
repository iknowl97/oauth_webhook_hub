const axios = require('axios');

async function webhookReceiver(fastify, options) {
  const { db } = require('../db/connection');

  fastify.all('/hook/:id', async (request, reply) => {
    const { id } = request.params;
    const { method, query, headers, body, ip } = request;

    // 1. Find Webhook
    const hook = await db.selectFrom('webhooks')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!hook) {
      return reply.code(404).send({ error: 'Webhook not found' });
    }

    // 2. Prepare Log Data
    let bodyText = null;
    let bodyJson = null;

    if (body) {
      if (typeof body === 'object') {
        bodyJson = body;
        bodyText = JSON.stringify(body);
      } else {
        bodyText = String(body);
      }
    }

    // 3. Log Request (Async - don't await if performance critical, but for data safety we await)
    // We treat logging as critical here.
    try {
        await db.insertInto('webhook_requests')
          .values({
            webhook_id: id,
            method,
            url: request.url,
            query_params: query, // kysely handles JSON conversion
            headers: headers,
            body_text: bodyText,
            // body_binary: ... // skipped for now
            remote_ip: ip,
            user_agent: headers['user-agent'],
            response_status: hook.response_status || 200,
            created_at: new Date()
          })
          .execute();
    } catch (err) {
        request.log.error(err, 'Failed to log webhook request');
    }

    // 4. Forwarding (Async - fire and forget)
    if (hook.forward_url) {
      // Don't await forwarding
      axios({
        method: method,
        url: hook.forward_url,
        headers: headers,
        params: query,
        data: body
      }).catch(err => {
        request.log.error({ err: err.message, url: hook.forward_url }, 'Webhook forwarding failed');
      });
    }

    // 5. Respond
    const responseStatus = hook.response_status || 200;
    const responseHeaders = hook.response_headers || {};
    let responseBody = hook.response_body_template || '{"status":"ok"}';

    // Parse Response Body if it's JSON
    try {
        const parsed = JSON.parse(responseBody);
        responseBody = parsed;
    } catch (e) {
        // keep as string
    }

    return reply
      .code(responseStatus)
      .headers(responseHeaders)
      .send(responseBody);
  });
}

module.exports = webhookReceiver;

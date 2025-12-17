const { db } = require('../db/connection');
const axios = require('axios');

async function dispatcherRoutes(fastify, options) {
  // Handler for all paths
  const handleRequest = async (request, reply) => {
    // Strip port if present (e.g. localhost:3000 -> localhost)
    const rawHost = request.headers['x-forwarded-host'] || request.hostname;
    const host = rawHost.split(':')[0];
    
    const baseDomain = process.env.APP_BASE_URL ? new URL(process.env.APP_BASE_URL).hostname : 'oauthhub.work.gd';

    // 1. Check if this is a subdomain request
    if (host === baseDomain || host === 'localhost' || host === '127.0.0.1') {
       // If main domain and no other route matched (since this is catch-all), send 404
       reply.code(404);
       return { error: 'Not Found', message: 'Route not found on main domain' };
    }

    const parts = host.split('.');
    if (parts.length < 3) {
        return { status: 'ignoring' };
    }
    const subdomain = parts[0];

    // 2. Lookup Binding
    const binding = await db
        .selectFrom('subdomain_bindings')
        .innerJoin('webhooks', 'subdomain_bindings.webhook_id', 'webhooks.id')
        .select([
            'webhooks.id', 
            'webhooks.response_status', 
            'webhooks.response_headers', 
            'webhooks.response_body_template', 
            'webhooks.forward_url'
        ])
        .where('subdomain_bindings.subdomain', '=', subdomain)
        .where('subdomain_bindings.active', '=', true)
        .executeTakeFirst();

    if (!binding) {
        reply.code(404);
        return { error: `Subdomain '${subdomain}' not found or inactive.` };
    }

    // 3. Process Webhook (Logic duplicated from webhookReceiver)
    const { method, query, headers, body, ip } = request;
    
    let bodyText = null;
    if (body) {
      if (typeof body === 'object') {
        bodyText = JSON.stringify(body);
      } else {
        bodyText = String(body);
      }
    }

    // Log Request
    try {
        await db.insertInto('webhook_requests')
          .values({
            webhook_id: binding.id,
            method,
            url: request.url,
            query_params: query,
            headers: headers,
            body_text: bodyText,
            remote_ip: ip,
            user_agent: headers['user-agent'],
            response_status: binding.response_status || 200,
            created_at: new Date()
          })
          .execute();
    } catch (err) {
        request.log.error(err, 'Failed to log webhook request');
    }

    // Forwarding
    if (binding.forward_url) {
      axios({
        method: method,
        url: binding.forward_url,
        headers: headers,
        params: query,
        data: body
      }).catch(err => {
        request.log.error({ err: err.message, url: binding.forward_url }, 'Webhook forwarding failed');
      });
    }

    // Respond
    const responseStatus = binding.response_status || 200;
    const responseHeaders = binding.response_headers || {};
    let responseBody = binding.response_body_template || '{"status":"ok"}';

    try {
        const parsed = JSON.parse(responseBody);
        responseBody = parsed;
    } catch (e) {}

    return reply
      .code(responseStatus)
      .headers(responseHeaders)
      .send(responseBody);
  };

  // Register for root and wildcard paths
  fastify.all('/', handleRequest);
  fastify.all('/*', handleRequest);
}

module.exports = dispatcherRoutes;

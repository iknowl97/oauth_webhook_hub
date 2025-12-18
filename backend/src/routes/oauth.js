const { generateState, generatePKCE, exchangeToken } = require('../services/oauth');
const { encrypt, decrypt } = require('../services/encryption');
const { sql } = require('kysely'); // Added for sql`gen_random_uuid()`

async function oauthRoutes(fastify, options) {
    const { db } = require('../db/connection');
    const APP_BASE_URL = process.env.APP_BASE_URL;

    // Start OAuth Flow
    // GET /api/oauth/start/:id?redirect_back=URL
    fastify.get('/api/oauth/start/:providerId', async (request, reply) => {
        const { providerId } = request.params;
        const { redirect_back, preview } = request.query;

        const provider = await db.selectFrom('oauth_providers')
            .selectAll()
            .where('id', '=', providerId)
            .executeTakeFirst();
        
        if (!provider) return reply.code(404).send({ error: 'Provider not found' });

        const state = generateState();
        const { verifier, challenge } = generatePKCE();
        const callbackUrl = `${APP_BASE_URL}/api/oauth/callback`;

        // Store session
        // Previous migration fix ensures oauth_sessions has all columns
        await db.insertInto('oauth_sessions')
            .values({
                id: sql`gen_random_uuid()`, // Allow explicit ID if needed, or default
                provider_id: provider.id,
                state: state,
                code_verifier: verifier,
                redirect_back: redirect_back || null,
                created_at: new Date(),
                expires_at: new Date(Date.now() + 1000 * 60 * 10) // 10 mins
            })
            .execute();

        // Build URL
        const url = new URL(provider.auth_url);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('client_id', provider.client_id);
        url.searchParams.append('redirect_uri', callbackUrl);
        url.searchParams.append('state', state);
        
        // Scope handling
        let scopeStr = '';
        if (Array.isArray(provider.scopes)) scopeStr = provider.scopes.join(' ');
        else if (typeof provider.scopes === 'string') scopeStr = provider.scopes;
        
        if (scopeStr) url.searchParams.append('scope', scopeStr);

        // PKCE
        url.searchParams.append('code_challenge', challenge);
        url.searchParams.append('code_challenge_method', 'S256');

        // Extra params
        if (provider.extra_params) {
            Object.entries(provider.extra_params).forEach(([k, v]) => {
                url.searchParams.append(k, v);
            });
        }

        // 5. Redirect
        return reply.redirect(authUrl.toString());
    });

    // Callback Handler
    fastify.get('/oauth/callback', async (request, reply) => {
        const { code, state, error } = request.query;

        if (error) {
            return reply.send(`OAuth Error: ${error}`);
        }
        if (!code || !state) {
            return reply.code(400).send('Missing code or state');
        }

        // 1. Find Session
        const session = await db.selectFrom('oauth_sessions')
            .selectAll()
            .where('state', '=', state)
            .executeTakeFirst();

        if (!session) {
            return reply.code(400).send('Invalid state or session expired');
        }

        // 2. Get Provider
        const provider = await db.selectFrom('oauth_providers')
            .selectAll()
            .where('id', '=', session.provider_id)
            .executeTakeFirst();

        // 3. Exchange Token
        try {
            const clientSecret = provider.client_secret ? decrypt(provider.client_secret) : null;
            const callbackUrl = `${APP_BASE_URL}/oauth/callback`;
            
            const tokenData = await exchangeToken(
                provider.token_url,
                code,
                provider.client_id,
                clientSecret,
                callbackUrl,
                session.code_verifier
            );

            // 4. Store Token
            const encryptedAccess = encrypt(tokenData.access_token);
            const encryptedRefresh = tokenData.refresh_token ? encrypt(tokenData.refresh_token) : null;

            await db.insertInto('oauth_tokens')
                .values({
                    provider_id: provider.id,
                    label: session.label,
                    access_token: encryptedAccess,
                    refresh_token: encryptedRefresh,
                    token_type: tokenData.token_type || 'Bearer',
                    expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
                    scopes: tokenData.scope ? tokenData.scope.split(' ') : provider.scopes,
                    user_info: tokenData, // Store full response just in case
                    created_at: new Date()
                })
                .execute();

            // 5. Cleanup Session
            await db.deleteFrom('oauth_sessions').where('id', '=', session.id).execute();

            // 6. Success! Post message to parent window (if popup) or redirect
            const html = `
            <html>
                <body>
                    <h1>Authentication Successful</h1>
                    <script>
                        if (window.opener) {
                            window.opener.postMessage({ type: 'oauth-success', providerId: '${provider.id}' }, '*');
                            window.close();
                        } else {
                            window.location.href = '${session.redirect_back || '/'}';
                        }
                    </script>
                </body>
            </html>
            `;
            return reply.type('text/html').send(html);

        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send(`Token Exchange Failed: ${err.message}`);
        }
    });

    // List Tokens
    fastify.get('/api/tokens', async (request, reply) => {
        const tokens = await db.selectFrom('oauth_tokens')
            .innerJoin('oauth_providers', 'oauth_tokens.provider_id', 'oauth_providers.id')
            .select(['oauth_tokens.id', 'oauth_tokens.label', 'oauth_tokens.created_at', 'oauth_tokens.expires_at', 'oauth_providers.name as provider_name'])
            .orderBy('oauth_tokens.created_at', 'desc')
            .execute();
        return tokens;
    });

    // Reveal Token (DECRYPT)
    fastify.get('/api/tokens/:id/reveal', async (request, reply) => {
        const { id } = request.params;
        const token = await db.selectFrom('oauth_tokens')
            .select(['access_token', 'refresh_token'])
            .where('id', '=', id)
            .executeTakeFirst();
        
        if (!token) return reply.code(404).send({ error: 'Token not found' });
        
        return {
            access_token: decrypt(token.access_token),
            refresh_token: token.refresh_token ? decrypt(token.refresh_token) : null
        };
    });

    // Refresh Token
    fastify.post('/api/tokens/:id/refresh', async (request, reply) => {
        const { id } = request.params;
        const { refreshTokenExchange } = require('../services/oauth');

        const token = await db.selectFrom('oauth_tokens')
            .innerJoin('oauth_providers', 'oauth_tokens.provider_id', 'oauth_providers.id')
            .select([
                'oauth_tokens.id', 
                'oauth_tokens.refresh_token', 
                'oauth_providers.token_url', 
                'oauth_providers.client_id', 
                'oauth_providers.client_secret'
            ])
            .where('oauth_tokens.id', '=', id)
            .executeTakeFirst();

        if (!token || !token.refresh_token) {
            return reply.code(400).send({ error: 'Token not found or no refresh token available' });
        }

        try {
            const decRefresh = decrypt(token.refresh_token);
            const decSecret = token.client_secret ? decrypt(token.client_secret) : null;
            
            const newData = await refreshTokenExchange(
                token.token_url,
                decRefresh,
                token.client_id,
                decSecret
            );

            // Update DB
            const encAccess = encrypt(newData.access_token);
            const encRefresh = newData.refresh_token ? encrypt(newData.refresh_token) : null; // Some rotate, some don't
            
            const updateData = {
                access_token: encAccess,
                expires_at: newData.expires_in ? new Date(Date.now() + newData.expires_in * 1000) : null,
                created_at: new Date() // Treat as new?
            };
            if (encRefresh) updateData.refresh_token = encRefresh;

            await db.updateTable('oauth_tokens')
                .set(updateData)
                .where('id', '=', id)
                .execute();

            return { success: true, expires_in: newData.expires_in };

        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ error: 'Refresh failed: ' + (err.response?.data?.error || err.message) });
        }
    });

    // Revoke Token (Local Delete for now, scalable to Upstream Revoke later)
    fastify.post('/api/tokens/:id/revoke', async (request, reply) => {
        const { id } = request.params;
        // Ideally call provider revoke endpoint if known.
        // For MVP, deleting it is 'revoking access' for the Hub.
        await db.deleteFrom('oauth_tokens').where('id', '=', id).execute();
        return { success: true };
    });
    
    // Delete Token
    fastify.delete('/api/tokens/:id', async (request, reply) => {
        const { id } = request.params;
        await db.deleteFrom('oauth_tokens').where('id', '=', id).execute();
        return { success: true };
    });
}

module.exports = oauthRoutes;

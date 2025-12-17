const { generateState, generatePKCE, exchangeToken } = require('../services/oauth');
const { encrypt, decrypt } = require('../services/encryption');

async function oauthRoutes(fastify, options) {
    const { db } = require('../db/connection');
    const APP_BASE_URL = process.env.APP_BASE_URL;

    // Start OAuth Flow
    fastify.get('/oauth/start/:providerId', async (request, reply) => {
        const { providerId } = request.params;
        const { label, redirect_back } = request.query;

        // 1. Get Provider
        const provider = await db.selectFrom('oauth_providers')
            .selectAll()
            .where('id', '=', providerId)
            .executeTakeFirst();
        
        if (!provider) return reply.code(404).send({ error: 'Provider not found' });

        // 2. Generate State & PKCE
        const state = generateState();
        const { verifier, challenge } = generatePKCE();
        const callbackUrl = `${APP_BASE_URL}/oauth/callback`;

        // 3. Store Session
        await db.insertInto('oauth_sessions')
            .values({
                provider_id: provider.id,
                state: state,
                code_verifier: verifier,
                redirect_back: redirect_back || '/',
                label: label || 'Default',
                created_at: new Date(),
                expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
            })
            .execute();

        // 4. Construct Auth URL
        const authUrl = new URL(provider.auth_url);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', provider.client_id);
        authUrl.searchParams.append('redirect_uri', callbackUrl);
        authUrl.searchParams.append('state', state);
        
        // PKCE
        authUrl.searchParams.append('code_challenge', challenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');

        if (provider.scopes && provider.scopes.length > 0) {
            authUrl.searchParams.append('scope', provider.scopes.join(' '));
        }

        if (provider.extra_params) {
            Object.entries(provider.extra_params).forEach(([k, v]) => {
                authUrl.searchParams.append(k, v);
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
    
    // Delete Token
    fastify.delete('/api/tokens/:id', async (request, reply) => {
        const { id } = request.params;
        await db.deleteFrom('oauth_tokens').where('id', '=', id).execute();
        return { success: true };
    });
}

module.exports = oauthRoutes;

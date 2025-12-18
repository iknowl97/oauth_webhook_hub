const jwt = require('jsonwebtoken');

const publicPaths = [
    '/api/auth/login',
    '/api/health',
];

// Prefixes that are always public
const publicPrefixes = [
    '/hook/', // Public webhook ingestion
    '/api/oauth/start/', // Must be public for browser navigation/popup
    '/api/oauth/callback', // OAuth Redirect (contains query params)
];

async function requireAuth(request, reply) {
    // 1. Skip checks for OPTIONS requests (CORS preflight)
    if (request.method === 'OPTIONS') {
        return;
    }

    const { url } = request;

    // 2. Check strict matches
    if (publicPaths.includes(url)) {
        return;
    }

    // 3. Check prefixes
    for (const prefix of publicPrefixes) {
        if (url.startsWith(prefix)) {
            return;
        }
    }

    // 4. Verify Token
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Missing or invalid Authorization header');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to request
        request.user = decoded;
    } catch (err) {
        return reply.code(401).send({ error: 'Unauthorized', message: err.message });
    }
}

module.exports = requireAuth;

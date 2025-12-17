const jwt = require('jsonwebtoken');

async function authRoutes(fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { password } = request.body;

    // Use environment variable for the admin password
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
        request.log.error('ADMIN_PASSWORD not set in environment variables');
        return reply.code(500).send({ error: 'Server misconfiguration' });
    }

    if (password === adminPassword) {
      // Create JWT
      const token = jwt.sign(
        { role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } // Long-lived token for convenience
      );

      return { token };
    } else {
      return reply.code(401).send({ error: 'Invalid password' });
    }
  });

  // Simple verification endpoint
  fastify.get('/verify', async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) throw new Error('No header');
        
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true };
    } catch (e) {
        return reply.code(401).send({ valid: false });
    }
  });
}

module.exports = authRoutes;

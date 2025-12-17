const fastify = require('fastify')({ logger: true });
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const PORT = process.env.APP_PORT || 3000;
const HOST = '0.0.0.0'; // Docker requires 0.0.0.0

// Health Check
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

const { migrateToLatest } = require('./db/migrator');
const providerRoutes = require('./routes/providers');

const start = async () => {
  try {
    // Wait for DB to be ready and run migrations
    await migrateToLatest();

    // Register Routes
    fastify.register(providerRoutes);
    fastify.register(require('./routes/hooks'));
    fastify.register(require('./routes/webhook'));
    fastify.register(require('./routes/oauth'));

    await fastify.listen({ port: PORT, host: HOST });
    console.log(`Server listening on ${HOST}:${PORT}`);

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

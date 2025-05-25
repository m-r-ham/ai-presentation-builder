const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const fastify = require('fastify')({ logger: true });

// Register CORS
fastify.register(require('@fastify/cors'), {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
});

// Register routes
fastify.register(require('./routes/chat'), { prefix: '/api' });
fastify.register(require('./routes/outline'), { prefix: '/api/outline' });
fastify.register(require('./routes/slideTraining'), { prefix: '/api' });

// Health check
fastify.get('/api/health', async (request, reply) => {
  return { status: 'ok', message: 'AI Presentation Builder API' };
});

const start = async () => {
  try {
    // Check if OpenAI key is loaded
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      process.exit(1);
    }
    
    await fastify.listen({ port: process.env.PORT || 3001 });
    console.log('🚀 Backend server running on port', process.env.PORT || 3001);
    console.log('🤖 AI service ready');
    console.log('📝 Enhanced outline system ready');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

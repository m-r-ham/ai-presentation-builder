const chatController = require('../controllers/chatController');

async function chatRoutes(fastify, options) {
  // Chat endpoint
  fastify.post('/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
          sessionId: { type: 'string' },
          messages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string' },
                content: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, chatController.handleChat);

}

module.exports = chatRoutes;

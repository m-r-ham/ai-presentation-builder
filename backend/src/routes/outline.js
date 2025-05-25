const aiService = require('../services/aiService');

async function outlineRoutes(fastify, options) {
  // Update outline field
  fastify.post('/update', {
    schema: {
      body: {
        type: 'object',
        required: ['sessionId', 'field', 'value'],
        properties: {
          sessionId: { type: 'string' },
          field: { type: 'string' },
          value: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { sessionId, field, value } = request.body;
      
      // Get the outline and update the field - create if doesn't exist
      let outline = aiService.userOutlines.get(sessionId);
      if (!outline) {
        // Create new outline if it doesn't exist
        const PresentationOutline = require('../models/outline');
        outline = new PresentationOutline();
        aiService.userOutlines.set(sessionId, outline);
      }
      
      outline.updateMetadata(field, value);
      
      return reply.send({
        outline: outline.toJSON(),
        sessionId
      });
    } catch (error) {
      console.error('Update outline error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  // Get current outline
  fastify.get('/:sessionId?', async (request, reply) => {
    try {
      const { sessionId = 'default' } = request.params;
      let outline = aiService.userOutlines.get(sessionId);
      
      if (!outline) {
        // Create new outline if it doesn't exist
        const PresentationOutline = require('../models/outline');
        outline = new PresentationOutline();
        aiService.userOutlines.set(sessionId, outline);
      }
      
      return reply.send({
        outline: outline.toJSON(),
        sessionId
      });
    } catch (error) {
      console.error('Get outline error:', error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}

module.exports = outlineRoutes;

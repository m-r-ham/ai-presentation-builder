const aiService = require('../services/aiService');

class ChatController {
  async handleChat(request, reply) {
    try {
      const { message, messages = [], sessionId = 'default' } = request.body;

      if (!message || typeof message !== 'string') {
        return reply.status(400).send({ 
          error: 'Message is required and must be a string' 
        });
      }

      // Process with AI
      const result = await aiService.processMessage(message, messages, sessionId);

      return reply.send({
        response: result.response,
        outline: result.outline,
        sessionId: result.sessionId,
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('Chat error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }

  async getOutline(request, reply) {
    try {
      const { sessionId = 'default' } = request.params;
      const outline = aiService.getOutline(sessionId);
      
      return reply.send({
        outline,
        sessionId
      });
    } catch (error) {
      console.error('Get outline error:', error);
      return reply.status(500).send({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new ChatController();

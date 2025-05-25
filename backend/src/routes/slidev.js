const SlidevService = require('../services/slidevService');
const AIService = require('../services/aiService');

const slidevService = new SlidevService();

async function slidevRoutes(fastify, options) {
  // Generate Slidev presentation from outline
  fastify.post('/slidev/generate', async (request, reply) => {
    try {
      const { sessionId, presentationTitle } = request.body;
      
      // Get the current outline with slides
      const outline = AIService.getOutline(sessionId);
      if (!outline) {
        return reply.status(404).send({ error: 'No presentation outline found for session' });
      }

      if (!outline.slides || outline.slides.length === 0) {
        return reply.status(400).send({ error: 'No slides found in outline. Please generate slides first.' });
      }

      // Generate Slidev presentation
      const presentation = await slidevService.generatePresentation({
        title: presentationTitle || outline.metadata.title || 'AI Generated Presentation',
        slides: outline.slides,
        metadata: outline.metadata
      });

      // Save presentation
      const presentationId = `pres_${Date.now()}`;
      const savedFile = await slidevService.savePresentation(presentationId, presentation.markdown);

      return {
        success: true,
        presentationId,
        markdown: presentation.markdown,
        slideCount: presentation.slideCount,
        file: savedFile,
        previewUrl: `http://localhost:3002`,
        message: 'Slidev presentation generated successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate Slidev presentation' });
    }
  });

  // Preview presentation in Slidev
  fastify.post('/slidev/preview/:presentationId', async (request, reply) => {
    try {
      const { presentationId } = request.params;
      
      const result = await slidevService.previewPresentation(presentationId);
      
      return result;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to preview presentation' });
    }
  });

  // Export presentation to PDF/PNG/PPTX
  fastify.post('/slidev/export/:presentationId', async (request, reply) => {
    try {
      const { presentationId } = request.params;
      const { format = 'pdf' } = request.body;

      if (!['pdf', 'png', 'pptx'].includes(format)) {
        return reply.status(400).send({ error: 'Invalid export format. Use: pdf, png, or pptx' });
      }

      const result = await slidevService.exportPresentation(presentationId, format);
      
      return result;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: `Failed to export presentation as ${format}` });
    }
  });

  // Get list of saved presentations
  fastify.get('/slidev/presentations', async (request, reply) => {
    try {
      const presentations = await slidevService.listPresentations();
      
      return {
        presentations,
        total: presentations.length
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to list presentations' });
    }
  });

  // Get presentation markdown
  fastify.get('/slidev/presentations/:presentationId', async (request, reply) => {
    try {
      const { presentationId } = request.params;
      const fs = require('fs').promises;
      const path = require('path');
      
      const filepath = path.join(__dirname, '../../presentations', `${presentationId}.md`);
      const markdown = await fs.readFile(filepath, 'utf8');
      
      return {
        presentationId,
        markdown,
        previewUrl: `http://localhost:3002`
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(404).send({ error: 'Presentation not found' });
    }
  });

  // Update presentation markdown
  fastify.put('/slidev/presentations/:presentationId', async (request, reply) => {
    try {
      const { presentationId } = request.params;
      const { markdown } = request.body;
      
      if (!markdown) {
        return reply.status(400).send({ error: 'Markdown content is required' });
      }

      const savedFile = await slidevService.savePresentation(presentationId, markdown);
      
      return {
        success: true,
        presentationId,
        file: savedFile,
        message: 'Presentation updated successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update presentation' });
    }
  });

  // Delete presentation
  fastify.delete('/slidev/presentations/:presentationId', async (request, reply) => {
    try {
      const { presentationId } = request.params;
      const fs = require('fs').promises;
      const path = require('path');
      
      const filepath = path.join(__dirname, '../../presentations', `${presentationId}.md`);
      await fs.unlink(filepath);
      
      return {
        success: true,
        message: 'Presentation deleted successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete presentation' });
    }
  });

  // Generate single slide with Slidev
  fastify.post('/slidev/generate-slide', async (request, reply) => {
    try {
      const { content, slideType = 'general' } = request.body;
      
      if (!content) {
        return reply.status(400).send({ error: 'Content is required' });
      }

      // Use AI service to generate single Slidev slide
      const slideData = {
        title: content.title || 'Slide Title',
        description: content.description || '',
        keyPoints: content.keyPoints || [],
        type: slideType
      };

      console.log('Generating slide with content:', slideData);
      const enhancedSlide = await AIService.slideDesignAI.generateSlidevSlideWithTraining(
        `${slideData.title}: ${slideData.description} ${slideData.keyPoints.join(', ')}`,
        slideType
      );
      console.log('Generated slide:', enhancedSlide);

      return {
        success: true,
        slide: enhancedSlide,
        message: 'Slidev slide generated successfully'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate Slidev slide' });
    }
  });
}

module.exports = slidevRoutes;
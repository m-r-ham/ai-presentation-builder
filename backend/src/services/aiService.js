const OpenAI = require('openai');
const PresentationOutline = require('../models/outline');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  constructor() {
    this.userOutlines = new Map();
  }

  async processMessage(userMessage, conversationHistory = [], sessionId = 'default') {
    try {
      let outline = this.userOutlines.get(sessionId);
      if (!outline) {
        outline = new PresentationOutline();
        this.userOutlines.set(sessionId, outline);
      }

      // Check for slide creation trigger words
      const buildTriggers = ['start building', 'build', 'create slides', 'make slides', 'generate slides', 'start', 'go ahead', 'proceed'];
      const userRequestsBuild = buildTriggers.some(trigger => 
        userMessage.toLowerCase().includes(trigger.toLowerCase())
      );

      // Determine what phase we're in - be more proactive
      const hasBasicInfo = outline.completionStatus.metadataComplete;
      const hasSlideOutline = outline.completionStatus.hasSlideOutline;
      const hasMinimalInfo = outline.metadata.title || outline.metadata.purpose || outline.metadata.audience;
      const hasDecentInfo = (outline.metadata.title && outline.metadata.purpose) || 
                           (outline.metadata.title && outline.metadata.audience) ||
                           outline.completionStatus.percentage >= 50;
      const userExplicitlyAsksForSlides = userRequestsBuild;
      const needsSlideOutline = (userExplicitlyAsksForSlides || hasDecentInfo) && !hasSlideOutline;
      const readyForSlideDetails = hasBasicInfo && hasSlideOutline;

      const messages = [
        {
          role: 'system',
          content: `You are an AI presentation coach who helps create compelling presentations through natural conversation. You have the ability to both collaborate on presentation strategy and build actual slides.

Current presentation outline:
${outline.getCurrentState()}

Your approach is to engage in natural conversation while quietly capturing useful information about their presentation. When you learn something about their topic, audience, or goals, you can update the presentation outline using outline blocks.

For example, if someone mentions "I need to present our Q3 results to the board," you might extract:
\`\`\`outline
{
  "action": "update_metadata",
  "data": {
    "title": "Q3 Results Presentation",
    "audience": "board members", 
    "goal": "Inform"
  }
}
\`\`\`

When you have enough context and the user is ready to build slides, you create them using:
\`\`\`outline
{
  "action": "add_slide",
  "data": {
    "title": "Slide Title",
    "type": "title|content|data|summary",
    "description": "What this slide covers",
    "keyPoints": ["Point 1", "Point 2", "Point 3"]
  }
}
\`\`\`

${needsSlideOutline ? `
The user is ready for you to create slides. Build a complete slide deck by creating multiple slides with outline blocks. Each slide should have a clear purpose and specific content.
` : readyForSlideDetails ? `
The presentation slides are ready. Focus on helping refine content and improve the presentation.
` : `
Focus on learning about their presentation through natural conversation. As you discover details about their topic, audience, or goals, capture them in the outline.
`}

Conversation style:
- Be natural and engaging, like a thoughtful colleague
- Ask follow-up questions that show genuine interest
- Share relevant insights when helpful
- Build understanding through dialogue
- You can create slides and build presentations - lean into this capability when appropriate

Remember: When you learn something about their presentation, you can capture it using outline blocks. This helps build their presentation outline as you talk.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'ai' ? 'assistant' : msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000, // Increased for slide generation
        temperature: 0.4,
      });

      const response = completion.choices[0].message.content;

      // Parse and apply outline updates
      const outlineUpdates = this.parseOutlineUpdates(response);
      console.log(`Found ${outlineUpdates.length} outline updates in AI response`);
      for (const update of outlineUpdates) {
        console.log('Applying outline update:', update);
        this.applyOutlineUpdate(outline, update);
      }

      // Clean response
      const cleanResponse = response
        .replace(/```outline[\s\S]*?```/g, '')
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
        .replace(/\n\s*$/g, '');

      return {
        response: cleanResponse,
        outline: outline.toJSON(),
        sessionId
      };

    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  parseOutlineUpdates(response) {
    const updates = [];
    const outlineRegex = /```outline\s*([\s\S]*?)\s*```/g;
    let match;

    while ((match = outlineRegex.exec(response)) !== null) {
      try {
        const update = JSON.parse(match[1]);
        updates.push(update);
      } catch (e) {
        console.error('Failed to parse outline update:', match[1]);
      }
    }

    return updates;
  }

  applyOutlineUpdate(outline, update) {
    try {
      outline.addToChangelog(update);
      
      switch (update.action) {
        case 'update_metadata':
          Object.keys(update.data).forEach(key => {
            const value = update.data[key];
            if (value && 
                typeof value === 'string' && 
                value.trim() && 
                value.trim().length > 0) {
              
              // Only update if we don't have this data OR if new value is more specific
              const currentValue = outline.metadata[key];
              const shouldUpdate = !currentValue || 
                                 currentValue.trim() === '' || 
                                 value.trim().length > currentValue.trim().length;
              
              if (shouldUpdate) {
                outline.updateMetadata(key, value.trim());
              }
            }
          });
          break;
        
        case 'add_topic':
          if (update.data.topic && update.data.topic.trim()) {
            outline.addTopic(update.data.topic.trim());
          }
          break;
        
        case 'infer_context':
          // Allow AI to make intelligent inferences about missing data
          if (update.data) {
            Object.keys(update.data).forEach(key => {
              const value = update.data[key];
              if (value && typeof value === 'string' && value.trim()) {
                const currentValue = outline.metadata[key];
                if (!currentValue || currentValue.trim() === '') {
                  outline.updateMetadata(key, value.trim());
                }
              }
            });
          }
          break;
        
        case 'add_slide':
          outline.addSlide(update.data);
          break;
        
        case 'update_slide':
          const slideIndex = outline.slides.findIndex(s => s.id === update.data.id);
          if (slideIndex !== -1) {
            outline.slides[slideIndex] = { ...outline.slides[slideIndex], ...update.data };
          }
          break;
      }
    } catch (error) {
      console.error('Failed to apply outline update:', error);
    }
  }

  getOutline(sessionId) {
    const outline = this.userOutlines.get(sessionId);
    return outline ? outline.toJSON() : null;
  }
}

module.exports = new AIService();

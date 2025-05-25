const OpenAI = require('openai');
const PresentationOutline = require('../models/outline');
const SlideDesignAI = require('./slideDesignAI');
const SlideTrainingData = require('../models/slideTraining');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  constructor() {
    this.userOutlines = new Map();
    this.slideDesignAI = new SlideDesignAI();
    this.trainingStore = new SlideTrainingData();
    this.initializeDesignAI();
  }

  async initializeDesignAI() {
    // Load training data to inform slide generation
    try {
      const trainingDataset = await this.trainingStore.getTrainingDataset();
      await this.slideDesignAI.loadTrainingData(trainingDataset);
      console.log('Slide design AI initialized with training data');
    } catch (error) {
      console.log('Slide design AI initialized without training data:', error.message);
    }
  }

  async processMessage(userMessage, conversationHistory = [], sessionId = 'default') {
    try {
      let outline = this.userOutlines.get(sessionId);
      if (!outline) {
        outline = new PresentationOutline();
        this.userOutlines.set(sessionId, outline);
      }

      // Check for slide creation trigger words (expanded list)
      const buildTriggers = [
        'start building', 'build', 'create slides', 'make slides', 'generate slides', 
        'start', 'go ahead', 'proceed', 'slides', 'build slides', 'show me slides',
        'let\'s build', 'create presentation', 'make presentation', 'build presentation',
        'generate', 'create', 'ready', 'build it', 'let\'s go', 'time to build'
      ];
      const userRequestsBuild = buildTriggers.some(trigger => 
        userMessage.toLowerCase().includes(trigger.toLowerCase())
      );

      // Determine what phase we're in - be much more proactive
      const hasBasicInfo = outline.completionStatus.metadataComplete;
      const hasSlideOutline = outline.completionStatus.hasSlideOutline;
      const hasMinimalInfo = outline.metadata.title || outline.metadata.purpose || outline.metadata.audience;
      const hasAnyInfo = outline.metadata.title || outline.metadata.purpose || outline.metadata.audience || outline.topics.length > 0;
      const hasDecentInfo = hasMinimalInfo; // Lowered threshold - just need basic info
      const userExplicitlyAsksForSlides = userRequestsBuild;
      const shouldBuildSlides = userExplicitlyAsksForSlides || 
                               (hasAnyInfo && !hasSlideOutline && conversationHistory.length >= 2) ||
                               (outline.completionStatus.percentage >= 30);
      const readyForSlideDetails = hasBasicInfo && hasSlideOutline;

      const messages = [
        {
          role: 'system',
          content: `You are an AI presentation coach who helps create compelling presentations through natural conversation. You have the ability to both collaborate on presentation strategy and build actual slides with advanced design intelligence.

IMPORTANT: You are equipped with a sophisticated slide design AI that has been trained on real user feedback across 6 design quality dimensions:
- Information Hierarchy
- Visual Balance  
- Readability
- Content Density
- Design Consistency
- Visual Appeal

When you create slides, they are automatically enhanced with proven design patterns learned from training data. You don't need to ask users about design preferences - the AI proactively applies best practices.

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

${shouldBuildSlides ? `
🎯 TIME TO BUILD SLIDES! The user has provided enough information to start creating a presentation. 

IMPORTANT: Start generating actual slides now using outline blocks with "add_slide" action. Create a complete slide deck with:
- Title slide
- Content slides for each main topic/point
- Summary/conclusion slide

Be proactive - don't ask permission, just start building the slides they need!
` : readyForSlideDetails ? `
The presentation slides are ready. Focus on helping refine content and improve the presentation.
` : `
Focus on learning about their presentation through natural conversation. As you discover details about their topic, audience, or goals, capture them in the outline. Once you have basic information, proactively offer to build slides.
`}

Conversation style:
- Be natural and engaging, like a thoughtful colleague
- Ask follow-up questions that show genuine interest
- Share relevant insights when helpful
- Build understanding through dialogue
- **BE PROACTIVE ABOUT BUILDING SLIDES** - when you have enough info, start creating slides immediately

KEY BEHAVIORS:
- If user says anything like "build", "create", "slides", "generate" - START BUILDING SLIDES
- If you have a topic + audience OR topic + purpose - START BUILDING SLIDES  
- If conversation has gone 3+ exchanges and you have basic info - OFFER TO BUILD SLIDES
- Don't ask "would you like me to..." - just start building and explain what you're doing

Remember: When you learn something about their presentation, capture it using outline blocks. When you have enough info, immediately start adding slides with "add_slide" actions.`
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

  async enhanceSlideWithTraining(slideData) {
    try {
      // Use design AI to enhance slide based on training data
      const slideContent = `${slideData.title}: ${slideData.description || ''} ${slideData.keyPoints ? slideData.keyPoints.join(', ') : ''}`;
      const enhancedDesign = await this.slideDesignAI.generateSlideWithTraining(slideContent, slideData.type);
      
      // Merge AI enhancements with original slide data
      return {
        ...slideData,
        designEnhancements: {
          optimizedTitle: enhancedDesign.title,
          optimizedContent: enhancedDesign.content,
          recommendedLayout: enhancedDesign.layout,
          visualElements: enhancedDesign.visualElements,
          designPrinciples: enhancedDesign.designPrinciples,
          automaticOptimizations: enhancedDesign.automaticOptimizations,
          aiConfidence: enhancedDesign.aiConfidence
        },
        metadata: {
          ...slideData.metadata,
          designOptimized: true,
          optimizationTimestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.log('Could not enhance slide with training data:', error.message);
      // Return original slide if enhancement fails
      return slideData;
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
          // Enhance slide with design AI before adding to outline
          const enhancedSlide = await this.enhanceSlideWithTraining(update.data);
          outline.addSlide(enhancedSlide);
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

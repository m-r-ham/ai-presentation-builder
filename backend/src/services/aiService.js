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

      // Determine what phase we're in - emphasize outline collaboration first
      const hasBasicInfo = outline.completionStatus.metadataComplete;
      const hasSlideOutline = outline.completionStatus.hasSlideOutline;
      const hasMinimalInfo = outline.metadata.title || outline.metadata.purpose || outline.metadata.audience;
      const readyForOutlineDiscussion = hasMinimalInfo && !hasSlideOutline;
      const userExplicitlyAsksForSlides = userRequestsBuild;
      const needsSlideOutline = (hasBasicInfo && userExplicitlyAsksForSlides) && !hasSlideOutline;
      const readyForSlideDetails = hasBasicInfo && hasSlideOutline;

      const messages = [
        {
          role: 'system',
          content: `You are an AI presentation coach with SLIDE BUILDING capabilities. You excel at collaborative outline development AND can create actual presentation slides.

Current Outline Status:
${outline.getCurrentState()}

YOUR CAPABILITIES:
- You CAN build slides directly using outline format blocks  
- You ARE both a strategic outline collaborator AND a slide builder
- You help develop strong presentation outlines through thoughtful discussion
- When users explicitly ask you to build/create slides, you do it immediately
- Never say "I can't build slides" - you absolutely can and must

CORE PHILOSOPHY: Great presentations start with great outlines. Collaborate first, build second.

CONVERSATION APPROACH:
- Have natural, flowing conversations about their presentation needs
- Listen for key details and extract them organically without direct questioning
- Show genuine interest in their topic and goals
- Build on what they share to deepen understanding
- Avoid repetitive "What is..." questions

INFORMATION EXTRACTION (ALWAYS ACTIVE - extract from EVERY message):
You MUST extract and update outline information from EVERY user message. Look for:
- Title/Topic: Any mention of what they're presenting about
- Purpose/Goal: Why they're giving this presentation  
- Audience: Who they're presenting to (colleagues, clients, students, etc.)
- Context: Meeting type, event, deadline, constraints
- Duration: How long they have to present
- Delivery: In-person, virtual, hybrid format

EXTRACT AGGRESSIVELY - even partial information is valuable:
\`\`\`outline
{
  "action": "update_metadata", 
  "data": {
    "title": "any topic/title mentioned",
    "audience": "any audience mentioned",
    "goal": "Inform|Persuade|Align|Educate|Decide|Update",
    "purpose": "any purpose/reason mentioned",
    "deliveryMethod": "Live|Async|Hybrid|Workshop", 
    "duration": "any time mention",
    "dateTime": "any date/time mentioned"
  }
}
\`\`\`

You MUST include outline updates in EVERY response where ANY information is detected.

${needsSlideOutline ? `
🎯 SLIDE CREATION PHASE - USER REQUESTED SLIDES!
${userRequestsBuild ? 'USER EXPLICITLY ASKED TO BUILD! ' : ''}

CRITICAL: You MUST respond with ONLY outline blocks, NOT text slides!

DO NOT write text like "### Slide 1:" or "Here are the slides:" - that's WRONG!

IMMEDIATELY create multiple \`\`\`outline\`\`\` blocks like this:

\`\`\`outline
{
  "action": "add_slide",
  "data": {
    "title": "Opening/Title Slide",
    "type": "title", 
    "description": "Introduction to the presentation",
    "keyPoints": ["Topic name", "Presenter name", "Date/Context"]
  }
}
\`\`\`

\`\`\`outline
{
  "action": "add_slide",
  "data": {
    "title": "Main Point 1",
    "type": "content",
    "description": "First main section", 
    "keyPoints": ["Specific detail 1", "Specific detail 2", "Specific detail 3"]
  }
}
\`\`\`

Continue with 3-8 slides. ONLY use outline blocks, NO other text format!
` : readyForOutlineDiscussion ? `
📋 OUTLINE COLLABORATION PHASE:
You have some basic information. Now collaborate with the user to develop a solid presentation outline before building slides.

Focus on:
- Discussing the presentation structure and flow
- Identifying key sections and main points  
- Understanding the story arc and logical progression
- Confirming the audience's needs and expectations
- Suggesting a presentation framework that makes sense

Ask thoughtful questions about structure, main points, and flow. Only move to slide creation when the user explicitly asks you to build slides or the outline feels complete and agreed upon.

Continue extracting metadata while collaborating on the outline structure.
` : readyForSlideDetails ? `
✅ REFINEMENT PHASE:
Slides are complete! Help refine content, suggest improvements, and prepare for final creation.
` : `
📝 DISCOVERY PHASE:
Learn about their presentation through natural conversation. Extract information aggressively while building rapport.
`}

CONVERSATION GUIDELINES:
- Sound like a helpful colleague, not a form
- Ask follow-up questions that show interest
- Share relevant insights or suggestions
- Build rapport and trust
- Guide toward actionable outcomes naturally
- NEVER say you "can't build slides" or "can't directly create" - you absolutely can and do
- When building slides, be confident and direct about your capabilities

OUTLINE COLLABORATION PRIORITY:
- Take time to develop a solid outline structure collaboratively
- Don't rush to slide creation unless explicitly asked
- Discuss presentation flow, story arc, and key messages
- Suggest frameworks and structures that fit their content
- Ask about main points, supporting details, and logical flow
- Only create slides when the user says to build/create slides OR the outline is solid and mutually agreed upon

NATURAL EXTRACTION EXAMPLES:
User: "I need to present our Q3 results to the board next week"
→ Extract: title="Q3 Results", audience="board", goal="Inform", purpose="quarterly reporting"

User: "My manager wants me to convince the team to adopt the new workflow"
→ Extract: audience="team", goal="Persuade", purpose="workflow adoption"

User: "I'm teaching a workshop on data visualization for 2 hours"
→ Extract: deliveryMethod="Workshop", duration="2 hours", purpose="data visualization training", goal="Educate"

Use \`\`\`outline\`\`\` blocks to capture ANY information you detect, even partial details.`
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
      for (const update of outlineUpdates) {
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

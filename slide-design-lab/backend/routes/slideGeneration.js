const express = require('express');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const Database = require('../database/init');

const router = express.Router();
const db = new Database();
// OpenAI instance will be created per request with user's API key

// Enhanced slide categories for AI classification
const SLIDE_CATEGORIES = {
  'title-cover': 'Title slides, covers, and section dividers',
  'data-visualization': 'Charts, graphs, and data-driven visuals',
  'text-content': 'Text-heavy content and bullet points',
  'comparison-analysis': 'Comparison tables, pros/cons, versus slides',
  'process-timeline': 'Workflows, timelines, and step-by-step processes',
  'conclusion-summary': 'Key takeaways, conclusions, and next steps',
  'team-organizational': 'Team introductions, org charts, and people-focused slides',
  'financial-metrics': 'Financial data, KPIs, and performance metrics',
  'product-showcase': 'Product demos, features, and showcases',
  'strategy-planning': 'Strategic frameworks, roadmaps, and planning slides',
  'educational-training': 'How-to guides, tutorials, and educational content',
  'marketing-sales': 'Marketing materials, sales pitches, and promotional content'
};

// Generate 3 slide versions from user prompt
// SECURITY: API keys are passed in request body and NEVER stored server-side
router.post('/slide-versions', async (req, res) => {
  try {
    const { prompt, userContext = '', apiKey } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    if (!apiKey) {
      return res.status(400).json({ error: 'OpenAI API key is required' });
    }
    
    // Basic API key validation - support both old (sk-) and new (sk-proj-) formats
    if ((!apiKey.startsWith('sk-') && !apiKey.startsWith('sk-proj-')) || apiKey.length < 20) {
      return res.status(400).json({ error: 'Invalid OpenAI API key format' });
    }
    
    // Debug: Log key info (without revealing the key)
    console.log(`API Key length: ${apiKey.length}, starts with: ${apiKey.substring(0, 10)}..., ends with: ...${apiKey.slice(-4)}`)
    
    // Create OpenAI instance with user's API key (session-only, never stored)
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    // Clear API key from memory immediately after creating client
    const userApiKey = apiKey;
    // Don't store the API key anywhere - it exists only for this request

    // AI-based slide classification
    let category = 'general';
    try {
      const classificationPrompt = `Classify this slide request into one of these categories:
${Object.entries(SLIDE_CATEGORIES).map(([key, desc]) => `- ${key}: ${desc}`).join('\n')}

Slide request: "${prompt}"

Return only the category key (e.g., "title-cover", "data-visualization", etc.):`;

      const classificationResponse = await openai.chat.completions.create({
        model: 'gpt-4-0613',
        messages: [{ role: 'user', content: classificationPrompt }],
        temperature: 0.1,
        max_tokens: 50
      });

      const classifiedCategory = classificationResponse.choices[0].message.content.trim();
      if (SLIDE_CATEGORIES[classifiedCategory]) {
        category = classifiedCategory;
      }
    } catch (error) {
      console.log('Classification failed, using general category:', error.message);
    }

    // Create session
    const sessionId = uuidv4();
    
    db.db.run(
      'INSERT INTO slide_sessions (id, prompt, category, user_context) VALUES (?, ?, ?, ?)',
      [sessionId, prompt, category, userContext]
    );

    // Generate 3 different versions
    const versions = [];
    
    for (let i = 1; i <= 3; i++) {
      const versionId = uuidv4();
      
      const systemPrompt = `You are an expert slide designer creating professional Slidev presentations.

CRITICAL REQUIREMENTS:
1. ALWAYS use 16:9 aspect ratio (class: "aspect-ratio-16-9")
2. Use emojis instead of placeholder text for icons (📊 📈 💼 🎯 ⚡ 🚀 etc.)
3. Create visually stunning, professional designs
4. Ensure proper Slidev syntax and layouts
5. Make version ${i} distinctly different from others

SLIDEV LAYOUTS TO USE:
- default: Standard content with title
- center: Centered content (good for titles)
- two-cols: Two column layout
- image-right: Content left, image placeholder right
- cover: Full cover slide
- section: Section divider
- quote: For quotes or testimonials

DESIGN STANDARDS:
- Professional typography and spacing
- Proper color schemes (#2563eb for primary, #64748b for secondary)
- Clear hierarchy with proper heading sizes
- Use CSS classes for styling (text-6xl, text-3xl, text-xl, etc.)
- Include background colors or gradients where appropriate

CONTENT TYPE: ${category}
USER REQUEST: ${prompt}
VERSION: ${i}/3

Create a ${getVersionApproach(i)} for this request.

Return ONLY valid Slidev markdown with proper frontmatter and styling.`;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-0613',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8, // Higher creativity for different versions
          max_tokens: 1000
        });

        const slidevMarkdown = response.choices[0].message.content;
        const aiRationale = `Version ${i}: ${getVersionApproach(i)}`;

        // Store version
        db.db.run(
          'INSERT INTO slide_versions (id, session_id, version_number, slidev_markdown, ai_rationale) VALUES (?, ?, ?, ?, ?)',
          [versionId, sessionId, i, slidevMarkdown, aiRationale]
        );

        versions.push({
          id: versionId,
          versionNumber: i,
          slidevMarkdown,
          aiRationale
        });

      } catch (error) {
        console.error(`Error generating version ${i}:`, error);
        
        // Handle API key authentication errors specifically
        if (error.status === 401 || error.message.includes('API key')) {
          return res.status(401).json({ 
            error: 'Invalid OpenAI API key. Please check your API key and try again.',
            details: 'Authentication failed with OpenAI API'
          });
        }
        
        versions.push({
          id: versionId,
          versionNumber: i,
          slidevMarkdown: `---\nlayout: default\n---\n\n# Error\n\nFailed to generate version ${i}`,
          aiRationale: `Error in generation: ${error.message}`
        });
      }
    }

    res.json({
      success: true,
      sessionId,
      prompt,
      category,
      versions,
      message: '3 slide versions generated successfully'
    });

  } catch (error) {
    console.error('Slide generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate slide versions',
      details: error.message 
    });
  }
});

// Get slide categories
router.get('/categories', (req, res) => {
  res.json({
    categories: SLIDE_CATEGORIES,
    default: 'general'
  });
});

// Helper function to define version approaches
function getVersionApproach(versionNumber) {
  const approaches = {
    1: 'clean, minimal design with elegant typography and plenty of white space',
    2: 'visual-heavy approach with bold colors, emojis, and dynamic layouts', 
    3: 'structured, professional style with clear hierarchy and business aesthetics'
  };
  return approaches[versionNumber] || 'alternative design approach';
}

module.exports = router;
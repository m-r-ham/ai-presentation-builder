const express = require('express');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const Database = require('../database/init');

const router = express.Router();
const db = new Database();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Slide categories for focused training
const SLIDE_CATEGORIES = {
  'title': 'Title slides and covers',
  'data-viz': 'Data visualization and charts',
  'text-heavy': 'Text-heavy content slides',
  'comparison': 'Comparison and versus slides',
  'timeline': 'Process and timeline slides',
  'conclusion': 'Summary and conclusion slides'
};

// Generate 3 slide versions from user prompt
router.post('/slide-versions', async (req, res) => {
  try {
    const { prompt, category = 'general', userContext = '' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
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
      
      const systemPrompt = `You are an expert slide designer creating Slidev presentations. 
Generate a complete slide in Slidev markdown format.

DESIGN PRINCIPLES:
- Use appropriate Slidev layouts (default, two-cols, image-right, center, cover, etc.)
- Focus on ${category} slide requirements
- Create visually appealing and professional designs
- Ensure content hierarchy and readability
- Make each version distinctly different in approach

USER REQUEST: ${prompt}
CATEGORY: ${category}
VERSION: ${i}/3 (make this version unique)

Return ONLY the Slidev markdown, including frontmatter with layout and styling.`;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
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
    1: 'Clean and minimal design with focus on typography',
    2: 'Visual-heavy approach with graphics and layouts', 
    3: 'Structured and data-focused presentation style'
  };
  return approaches[versionNumber] || 'Alternative design approach';
}

module.exports = router;
const { v4: uuidv4 } = require('uuid');
const Database = require('../../backend/database/init');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      versionId, 
      sessionId, 
      decision, 
      ratings = {},
      feedback = '',
      improvements = []
    } = req.body;
    
    if (!versionId || !sessionId || !decision) {
      return res.status(400).json({ 
        error: 'versionId, sessionId, and decision are required' 
      });
    }

    const db = new Database();
    const ratingId = uuidv4();

    // Store rating in database
    await new Promise((resolve, reject) => {
      db.db.run(`
        INSERT INTO slide_ratings (
          id, version_id, session_id, decision, 
          overall_rating, visual_hierarchy, information_density, 
          readability, visual_appeal, layout_balance, content_clarity,
          feedback_text, improvement_suggestions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        ratingId,
        versionId,
        sessionId, 
        decision,
        ratings.overall || null,
        ratings.visualHierarchy || null,
        ratings.informationDensity || null,
        ratings.readability || null,
        ratings.visualAppeal || null,
        ratings.layoutBalance || null,
        ratings.contentClarity || null,
        feedback,
        JSON.stringify(improvements)
      ], function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });

    res.json({
      success: true,
      decision,
      ratingId,
      message: `Rating submitted successfully. Decision: ${decision}`
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ 
      error: 'Failed to submit rating',
      details: error.message 
    });
  }
}
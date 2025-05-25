const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Database = require('../database/init');

const router = express.Router();
const db = new Database();

// Submit rating for a slide version
router.post('/rate-slide', async (req, res) => {
  try {
    const {
      versionId,
      sessionId,
      ratings, // { visual_hierarchy: 4, information_density: 3, ... }
      decision, // 'keep', 'kill', 'revise'
      feedbackText = ''
    } = req.body;

    if (!versionId || !sessionId || !ratings || !decision) {
      return res.status(400).json({ 
        error: 'versionId, sessionId, ratings, and decision are required' 
      });
    }

    // Validate decision
    if (!['keep', 'kill', 'revise'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be keep, kill, or revise' });
    }

    // Validate ratings (1-5 scale)
    const requiredDimensions = [
      'visual_hierarchy', 'information_density', 'readability',
      'visual_appeal', 'layout_balance', 'content_clarity'
    ];

    for (const dimension of requiredDimensions) {
      if (!ratings[dimension] || ratings[dimension] < 1 || ratings[dimension] > 5) {
        return res.status(400).json({ 
          error: `${dimension} rating must be between 1 and 5` 
        });
      }
    }

    const ratingId = uuidv4();

    // Store rating
    db.db.run(`
      INSERT INTO slide_ratings (
        id, version_id, session_id,
        visual_hierarchy, information_density, readability,
        visual_appeal, layout_balance, content_clarity,
        decision, feedback_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      ratingId, versionId, sessionId,
      ratings.visual_hierarchy, ratings.information_density, ratings.readability,
      ratings.visual_appeal, ratings.layout_balance, ratings.content_clarity,
      decision, feedbackText
    ], function(err) {
      if (err) {
        console.error('Error saving rating:', err);
        return res.status(500).json({ error: 'Failed to save rating' });
      }

      // Update design patterns if this is a 'keep' decision
      if (decision === 'keep') {
        updateDesignPatterns(versionId, ratings);
      }

      res.json({
        success: true,
        ratingId,
        message: 'Rating saved successfully',
        decision,
        nextAction: getNextAction(decision)
      });
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Get training statistics
router.get('/stats', (req, res) => {
  db.db.all(`
    SELECT 
      COUNT(*) as total_sessions,
      COUNT(DISTINCT version_id) as total_versions,
      AVG(visual_hierarchy) as avg_visual_hierarchy,
      AVG(information_density) as avg_information_density,
      AVG(readability) as avg_readability,
      AVG(visual_appeal) as avg_visual_appeal,
      AVG(layout_balance) as avg_layout_balance,
      AVG(content_clarity) as avg_content_clarity,
      SUM(CASE WHEN decision = 'keep' THEN 1 ELSE 0 END) as kept_slides,
      SUM(CASE WHEN decision = 'kill' THEN 1 ELSE 0 END) as killed_slides,
      SUM(CASE WHEN decision = 'revise' THEN 1 ELSE 0 END) as revised_slides
    FROM slide_ratings
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get statistics' });
    }

    const stats = rows[0] || {};
    
    res.json({
      trainingProgress: {
        totalSessions: stats.total_sessions || 0,
        totalVersions: stats.total_versions || 0,
        keepRate: stats.total_versions ? (stats.kept_slides / stats.total_versions * 100).toFixed(1) : 0,
        avgRatings: {
          visualHierarchy: parseFloat((stats.avg_visual_hierarchy || 0).toFixed(2)),
          informationDensity: parseFloat((stats.avg_information_density || 0).toFixed(2)),
          readability: parseFloat((stats.avg_readability || 0).toFixed(2)),
          visualAppeal: parseFloat((stats.avg_visual_appeal || 0).toFixed(2)),
          layoutBalance: parseFloat((stats.avg_layout_balance || 0).toFixed(2)),
          contentClarity: parseFloat((stats.avg_content_clarity || 0).toFixed(2))
        },
        decisions: {
          keep: stats.kept_slides || 0,
          kill: stats.killed_slides || 0,
          revise: stats.revised_slides || 0
        }
      }
    });
  });
});

// Get recent training sessions
router.get('/recent-sessions', (req, res) => {
  const limit = req.query.limit || 10;
  
  db.db.all(`
    SELECT 
      s.id,
      s.prompt,
      s.category,
      s.created_at,
      COUNT(r.id) as rating_count,
      AVG(
        (r.visual_hierarchy + r.information_density + r.readability + 
         r.visual_appeal + r.layout_balance + r.content_clarity) / 6.0
      ) as avg_overall_rating
    FROM slide_sessions s
    LEFT JOIN slide_ratings r ON s.id = r.session_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
    LIMIT ?
  `, [limit], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to get recent sessions' });
    }

    res.json({
      recentSessions: rows.map(row => ({
        id: row.id,
        prompt: row.prompt,
        category: row.category,
        createdAt: row.created_at,
        ratingCount: row.rating_count,
        avgRating: row.avg_overall_rating ? parseFloat(row.avg_overall_rating.toFixed(2)) : null
      }))
    });
  });
});

// Helper functions
function updateDesignPatterns(versionId, ratings) {
  // TODO: Implement pattern recognition logic
  // This will analyze successful slides and extract patterns
  // for integration with the main app
  console.log(`📈 Updating design patterns from successful slide ${versionId}`);
}

function getNextAction(decision) {
  switch (decision) {
    case 'keep':
      return 'Slide added to pattern library. Ready for next prompt.';
    case 'kill':
      return 'Slide discarded. Ready for next prompt.';
    case 'revise':
      return 'Click revise to generate new versions of the same concept.';
    default:
      return 'Ready for next action.';
  }
}

module.exports = router;
const express = require('express');
const Database = require('../database/init');

const router = express.Router();
const db = new Database();

// Export training insights for main app integration
router.get('/export-for-main-app', (req, res) => {
  // This endpoint will be called by the main ai-presentation-builder
  // to import learned design patterns and insights
  
  db.db.all(`
    SELECT 
      sv.slidev_markdown,
      sr.visual_hierarchy,
      sr.information_density, 
      sr.readability,
      sr.visual_appeal,
      sr.layout_balance,
      sr.content_clarity,
      sr.decision,
      sr.feedback_text,
      ss.category,
      ss.prompt,
      sr.rating_time
    FROM slide_ratings sr
    JOIN slide_versions sv ON sr.version_id = sv.id
    JOIN slide_sessions ss ON sr.session_id = ss.id
    WHERE sr.decision = 'keep'
    ORDER BY sr.rating_time DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to export training data' });
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      totalKeepDecisions: rows.length,
      integrationFormat: 'ai-presentation-builder-sdf',
      goodSlides: rows.map(row => ({
        slidevMarkdown: row.slidev_markdown,
        category: row.category,
        prompt: row.prompt,
        feedback: {
          dimensional_ratings: {
            visual_hierarchy: row.visual_hierarchy,
            information_density: row.information_density,
            readability: row.readability,
            visual_appeal: row.visual_appeal,
            layout_balance: row.layout_balance,
            content_clarity: row.content_clarity
          },
          overall_rating: (
            row.visual_hierarchy + row.information_density + row.readability +
            row.visual_appeal + row.layout_balance + row.content_clarity
          ) / 6.0,
          text_feedback: row.feedback_text,
          rating_timestamp: row.rating_time
        }
      })),
      designPatterns: generateDesignPatterns(rows),
      integrationInstructions: {
        usage: 'Import this data into ai-presentation-builder/backend/src/services/slideDesignAI.js',
        method: 'Call loadTrainingData() with this.goodSlides array',
        note: 'This replaces mock training data with real user-validated slides'
      }
    };

    res.json(exportData);
  });
});

// Get pattern analysis
router.get('/patterns', (req, res) => {
  db.db.all(`
    SELECT 
      ss.category,
      COUNT(*) as total_slides,
      AVG(sr.visual_hierarchy) as avg_visual_hierarchy,
      AVG(sr.information_density) as avg_information_density,
      AVG(sr.readability) as avg_readability,
      AVG(sr.visual_appeal) as avg_visual_appeal,
      AVG(sr.layout_balance) as avg_layout_balance,
      AVG(sr.content_clarity) as avg_content_clarity,
      AVG(
        (sr.visual_hierarchy + sr.information_density + sr.readability + 
         sr.visual_appeal + sr.layout_balance + sr.content_clarity) / 6.0
      ) as avg_overall_rating,
      SUM(CASE WHEN sr.decision = 'keep' THEN 1 ELSE 0 END) as keep_count
    FROM slide_sessions ss
    JOIN slide_ratings sr ON ss.id = sr.session_id
    GROUP BY ss.category
    ORDER BY avg_overall_rating DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to analyze patterns' });
    }

    res.json({
      categoryAnalysis: rows.map(row => ({
        category: row.category,
        totalSlides: row.total_slides,
        keepRate: (row.keep_count / row.total_slides * 100).toFixed(1),
        avgRatings: {
          overall: parseFloat(row.avg_overall_rating.toFixed(2)),
          visualHierarchy: parseFloat(row.avg_visual_hierarchy.toFixed(2)),
          informationDensity: parseFloat(row.avg_information_density.toFixed(2)),
          readability: parseFloat(row.avg_readability.toFixed(2)),
          visualAppeal: parseFloat(row.avg_visual_appeal.toFixed(2)),
          layoutBalance: parseFloat(row.avg_layout_balance.toFixed(2)),
          contentClarity: parseFloat(row.avg_content_clarity.toFixed(2))
        }
      }))
    });
  });
});

// Get insights for improving slide generation
router.get('/insights', (req, res) => {
  // Analyze what makes slides successful
  db.db.all(`
    SELECT 
      CASE 
        WHEN sr.decision = 'keep' THEN 'successful'
        WHEN sr.decision = 'kill' THEN 'failed'
        ELSE 'needs_work'
      END as outcome,
      AVG(sr.visual_hierarchy) as avg_visual_hierarchy,
      AVG(sr.information_density) as avg_information_density,
      AVG(sr.readability) as avg_readability,
      AVG(sr.visual_appeal) as avg_visual_appeal,
      AVG(sr.layout_balance) as avg_layout_balance,
      AVG(sr.content_clarity) as avg_content_clarity,
      COUNT(*) as sample_size
    FROM slide_ratings sr
    GROUP BY sr.decision
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate insights' });
    }

    const insights = {};
    rows.forEach(row => {
      insights[row.outcome] = {
        sampleSize: row.sample_size,
        avgRatings: {
          visualHierarchy: parseFloat(row.avg_visual_hierarchy.toFixed(2)),
          informationDensity: parseFloat(row.avg_information_density.toFixed(2)),
          readability: parseFloat(row.avg_readability.toFixed(2)),
          visualAppeal: parseFloat(row.avg_visual_appeal.toFixed(2)),
          layoutBalance: parseFloat(row.avg_layout_balance.toFixed(2)),
          contentClarity: parseFloat(row.avg_content_clarity.toFixed(2))
        }
      };
    });

    res.json({
      insights,
      recommendations: generateRecommendations(insights)
    });
  });
});

// Helper function to extract design patterns from successful slides
function generateDesignPatterns(goodSlides) {
  // Analyze slidev markdown patterns from successful slides
  const patterns = {};
  
  goodSlides.forEach(slide => {
    // Extract layout type from slidev markdown
    const layoutMatch = slide.slidev_markdown.match(/layout:\s*(\w+)/);
    const layout = layoutMatch ? layoutMatch[1] : 'default';
    
    if (!patterns[layout]) {
      patterns[layout] = {
        usage_count: 0,
        avg_ratings: {
          visual_hierarchy: 0,
          information_density: 0,
          readability: 0,
          visual_appeal: 0,
          layout_balance: 0,
          content_clarity: 0
        },
        examples: []
      };
    }
    
    patterns[layout].usage_count++;
    patterns[layout].avg_ratings.visual_hierarchy += slide.feedback.dimensional_ratings.visual_hierarchy;
    patterns[layout].avg_ratings.information_density += slide.feedback.dimensional_ratings.information_density;
    patterns[layout].avg_ratings.readability += slide.feedback.dimensional_ratings.readability;
    patterns[layout].avg_ratings.visual_appeal += slide.feedback.dimensional_ratings.visual_appeal;
    patterns[layout].avg_ratings.layout_balance += slide.feedback.dimensional_ratings.layout_balance;
    patterns[layout].avg_ratings.content_clarity += slide.feedback.dimensional_ratings.content_clarity;
    
    if (patterns[layout].examples.length < 3) {
      patterns[layout].examples.push(slide.slidev_markdown);
    }
  });

  // Calculate averages
  Object.keys(patterns).forEach(layout => {
    const count = patterns[layout].usage_count;
    Object.keys(patterns[layout].avg_ratings).forEach(dimension => {
      patterns[layout].avg_ratings[dimension] = 
        parseFloat((patterns[layout].avg_ratings[dimension] / count).toFixed(2));
    });
  });

  return patterns;
}

// Generate actionable recommendations
function generateRecommendations(insights) {
  const recommendations = [];
  
  if (insights.successful && insights.failed) {
    const successful = insights.successful.avgRatings;
    const failed = insights.failed.avgRatings;
    
    // Compare dimensions to find what makes slides successful
    Object.keys(successful).forEach(dimension => {
      const diff = successful[dimension] - failed[dimension];
      if (diff > 0.5) {
        recommendations.push({
          dimension,
          recommendation: `Focus on improving ${dimension.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          impact: 'high',
          evidence: `Successful slides score ${diff.toFixed(1)} points higher`
        });
      }
    });
  }
  
  return recommendations;
}

module.exports = router;
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = new Database();
    const limit = parseInt(req.query.limit) || 5;
    
    // Get recent sessions with rating stats
    const sessions = await new Promise((resolve, reject) => {
      db.db.all(`
        SELECT 
          ss.id,
          ss.prompt,
          ss.category,
          ss.created_at,
          COUNT(sr.id) as ratingCount,
          AVG(sr.overall_rating) as avgRating
        FROM slide_sessions ss
        LEFT JOIN slide_ratings sr ON ss.id = sr.session_id
        GROUP BY ss.id, ss.prompt, ss.category, ss.created_at
        ORDER BY ss.created_at DESC
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      recentSessions: sessions.map(session => ({
        id: session.id,
        prompt: session.prompt,
        category: session.category,
        createdAt: session.created_at,
        ratingCount: session.ratingCount,
        avgRating: session.avgRating ? parseFloat(session.avgRating) : null
      }))
    });

  } catch (error) {
    console.error('Recent sessions error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent sessions',
      details: error.message 
    });
  }
}
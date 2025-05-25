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
    
    // Get training progress stats
    const stats = await new Promise((resolve, reject) => {
      db.db.all(`
        SELECT 
          COUNT(DISTINCT ss.id) as totalSessions,
          COUNT(sr.id) as totalRatings,
          AVG(sr.overall_rating) as avgRating,
          (COUNT(CASE WHEN sr.decision = 'keep' THEN 1 END) * 100.0 / COUNT(sr.id)) as keepRate
        FROM slide_sessions ss
        LEFT JOIN slide_ratings sr ON ss.id = sr.session_id
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows[0]);
      });
    });

    res.json({
      trainingProgress: {
        totalSessions: stats.totalSessions || 0,
        totalRatings: stats.totalRatings || 0,
        avgRating: parseFloat(stats.avgRating || 0).toFixed(1),
        keepRate: parseFloat(stats.keepRate || 0).toFixed(1)
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch training stats',
      details: error.message 
    });
  }
}
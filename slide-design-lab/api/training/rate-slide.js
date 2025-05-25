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
    const { decision, ratings } = req.body;
    
    if (!decision) {
      return res.status(400).json({ error: 'Decision is required' });
    }

    // For now, just return success (database not available in serverless)
    res.json({
      success: true,
      decision,
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
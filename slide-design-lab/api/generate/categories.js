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

  res.json({
    categories: SLIDE_CATEGORIES,
    default: 'general'
  });
}
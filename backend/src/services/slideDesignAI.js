const OpenAI = require('openai');

class SlideDesignAI {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    this.effectivenessRules = [];
    this.trainingData = null;
  }

  // Load training data to inform AI decisions
  async loadTrainingData(trainingData) {
    this.trainingData = trainingData;
    this.effectivenessRules = trainingData.effectivenessRules || [];
  }

  // Generate slides using training data insights
  async generateSlideWithTraining(content, slideType = 'general') {
    try {
      // Build context from training data
      const trainingContext = this.buildTrainingContext(slideType);
      
      const prompt = `You are an expert slide designer trained on thousands of effective presentations.

TRAINING INSIGHTS:
${trainingContext}

EFFECTIVENESS RULES (learned from user feedback):
${this.effectivenessRules.map(rule => `- ${rule.rule}: ${rule.recommendation}`).join('\n')}

Create a slide for: "${content}"

Return a JSON object with:
{
  "title": "Clear, concise slide title",
  "content": "Main slide content (follow length guidelines from training)",
  "layout": "recommended layout type",
  "visualElements": ["list", "of", "recommended", "visual", "elements"],
  "designPrinciples": ["principles", "applied", "from", "training"],
  "aiConfidence": 0.85
}

Apply the learned effectiveness patterns and avoid common failure patterns identified in training.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a slide design AI trained on real presentation data and user feedback."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const slideDesign = JSON.parse(response.choices[0].message.content);
      
      // Apply post-processing based on training rules
      return this.applyTrainingRules(slideDesign);
      
    } catch (error) {
      console.error('Error generating slide with training:', error);
      throw error;
    }
  }

  // Build context from training data for specific slide types
  buildTrainingContext(slideType) {
    if (!this.trainingData) return "No training data available.";
    
    const { goodSlides, badSlides, patterns } = this.trainingData;
    
    return `
GOOD SLIDE PATTERNS (Rating 4-5 stars):
- Average text length: ${Math.round(patterns.goodPatterns.averageTextLength)} characters
- Top categories: ${Object.entries(patterns.goodPatterns.commonCategories)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([cat, count]) => `${cat} (${count})`)
  .join(', ')}
- Success factors: ${Object.entries(patterns.commonFactors.goodFactors)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([factor, count]) => `${factor} (${count})`)
  .join(', ')}

BAD SLIDE PATTERNS (Rating 1-2 stars):
- Average text length: ${Math.round(patterns.badPatterns.averageTextLength)} characters  
- Problematic factors: ${Object.entries(patterns.commonFactors.badFactors)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 3)
  .map(([factor, count]) => `${factor} (${count})`)
  .join(', ')}

TRAINING SAMPLE SIZE: ${goodSlides.length} good slides, ${badSlides.length} bad slides analyzed.`;
  }

  // Apply training rules to generated slides
  applyTrainingRules(slideDesign) {
    let adjustedDesign = { ...slideDesign };
    
    // Apply text length rules
    const textLengthRule = this.effectivenessRules.find(rule => rule.type === 'text-length');
    if (textLengthRule && adjustedDesign.content.length > 200) {
      adjustedDesign.designNotes = adjustedDesign.designNotes || [];
      adjustedDesign.designNotes.push('Content may be too long based on training data');
      adjustedDesign.aiConfidence *= 0.9;
    }
    
    // Apply clarity rules
    const clarityRule = this.effectivenessRules.find(rule => rule.type === 'clarity');
    if (clarityRule) {
      adjustedDesign.visualElements.push('high-contrast-text', 'clear-hierarchy');
    }
    
    return adjustedDesign;
  }

  // Analyze slide against training data
  async analyzeSlideEffectiveness(slideData) {
    if (!this.trainingData) {
      return { score: 0.5, message: "No training data available for analysis" };
    }

    const analysis = {
      textLength: this.analyzeTextLength(slideData.content),
      clarity: this.analyzeClarity(slideData),
      visualAppeal: this.analyzeVisualElements(slideData),
      overallScore: 0
    };

    // Calculate weighted score
    analysis.overallScore = (
      analysis.textLength.score * 0.3 +
      analysis.clarity.score * 0.4 +
      analysis.visualAppeal.score * 0.3
    );

    return analysis;
  }

  analyzeTextLength(content) {
    const { goodPatterns } = this.trainingData.patterns;
    const idealLength = goodPatterns.averageTextLength;
    const currentLength = content.length;
    
    let score = 1.0;
    if (currentLength > idealLength * 1.5) {
      score = 0.6;
    } else if (currentLength > idealLength * 1.2) {
      score = 0.8;
    }
    
    return {
      score,
      message: `Content length: ${currentLength} chars (ideal: ~${Math.round(idealLength)})`
    };
  }

  analyzeClarity(slideData) {
    // Simple heuristics based on training patterns
    let score = 0.7; // baseline
    
    if (slideData.title && slideData.title.length > 0) score += 0.1;
    if (slideData.content.split(' ').length < 30) score += 0.1;
    if (!slideData.content.includes('very') || !slideData.content.includes('really')) score += 0.1;
    
    return {
      score: Math.min(score, 1.0),
      message: "Clarity analysis based on training patterns"
    };
  }

  analyzeVisualElements(slideData) {
    let score = 0.5; // baseline
    
    if (slideData.visualElements && slideData.visualElements.length > 0) {
      score += slideData.visualElements.length * 0.1;
    }
    
    return {
      score: Math.min(score, 1.0), 
      message: "Visual elements analysis"
    };
  }
}

module.exports = SlideDesignAI;
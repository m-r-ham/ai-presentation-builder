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

  // Generate Slidev markdown using training data insights
  async generateSlidevSlideWithTraining(content, slideType = 'general') {
    try {
      // Build context from training data
      const trainingContext = this.buildTrainingContext(slideType);
      
      const prompt = `You are an expert slide designer that creates Slidev markdown. You have deep knowledge of visual design principles learned from real user feedback.

AUTOMATICALLY APPLY THESE PROVEN DESIGN PATTERNS:
${trainingContext}

For the content: "${content}"

DESIGN REQUIREMENTS (automatically apply without user asking):
1. INFORMATION HIERARCHY: Choose appropriate Slidev layout for clear visual priority
2. VISUAL BALANCE: Select layouts that balance text/visuals optimally
3. READABILITY: Optimize content length and structure for comprehension
4. CONTENT DENSITY: Use 7±2 rule for bullet points and information chunks
5. DESIGN CONSISTENCY: Use consistent Slidev layout patterns
6. VISUAL APPEAL: Choose engaging layouts that enhance understanding

AVAILABLE SLIDEV LAYOUTS:
- default: Standard layout with title and content
- two-cols: Left text, right content (split-left-text-right-visual pattern)
- image-right: Right image, left text (split-right-text-left-visual pattern)
- center: Center-focused minimal layout
- quote: For impactful statements
- cover: Title slides
- end: Conclusion slides

Return a JSON object with:
{
  "slidevMarkdown": "Complete Slidev slide markdown including frontmatter and content",
  "layout": "chosen slidev layout",
  "designRationale": "why this layout was chosen based on training data",
  "optimizations": ["specific", "design", "optimizations", "applied"],
  "automaticOptimizations": ["list", "of", "training-based", "improvements", "applied"],
  "aiConfidence": 0.85
}

CRITICAL: Proactively apply all dimensional design insights without waiting for user prompts. Create slides that automatically excel in all 6 design quality dimensions based on training data patterns.`;

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

  // Build context from training data with dimensional insights
  buildTrainingContext(slideType) {
    if (!this.trainingData) return "No training data available.";
    
    const { goodSlides, badSlides, patterns } = this.trainingData;
    const dimensionalInsights = this.analyzeDimensionalPatterns(goodSlides, badSlides);
    
    return `
PROVEN DESIGN QUALITY PATTERNS (from user training):

INFORMATION HIERARCHY (${dimensionalInsights.hierarchy.confidence}% confidence):
${dimensionalInsights.hierarchy.guidelines.map(g => `- ${g}`).join('\n')}

VISUAL BALANCE (${dimensionalInsights.balance.confidence}% confidence):
${dimensionalInsights.balance.guidelines.map(g => `- ${g}`).join('\n')}

READABILITY (${dimensionalInsights.readability.confidence}% confidence):
${dimensionalInsights.readability.guidelines.map(g => `- ${g}`).join('\n')}

CONTENT DENSITY (${dimensionalInsights.density.confidence}% confidence):
${dimensionalInsights.density.guidelines.map(g => `- ${g}`).join('\n')}

DESIGN CONSISTENCY (${dimensionalInsights.consistency.confidence}% confidence):
${dimensionalInsights.consistency.guidelines.map(g => `- ${g}`).join('\n')}

VISUAL APPEAL (${dimensionalInsights.appeal.confidence}% confidence):
${dimensionalInsights.appeal.guidelines.map(g => `- ${g}`).join('\n')}

LAYOUT EFFECTIVENESS:
${dimensionalInsights.layoutPatterns.map(p => `- ${p}`).join('\n')}

TRAINING SAMPLE: ${goodSlides.length} high-rated slides, ${badSlides.length} low-rated slides analyzed.`;
  }

  // Analyze dimensional rating patterns to extract actionable guidelines
  analyzeDimensionalPatterns(goodSlides, badSlides) {
    const insights = {
      hierarchy: { guidelines: [], confidence: 0 },
      balance: { guidelines: [], confidence: 0 },
      readability: { guidelines: [], confidence: 0 },
      density: { guidelines: [], confidence: 0 },
      consistency: { guidelines: [], confidence: 0 },
      appeal: { guidelines: [], confidence: 0 },
      layoutPatterns: []
    };

    if (goodSlides.length === 0) return insights;

    // Analyze high-scoring patterns for each dimension
    const highHierarchy = goodSlides.filter(s => s.feedback.dimensional_ratings?.information_hierarchy >= 4);
    const highBalance = goodSlides.filter(s => s.feedback.dimensional_ratings?.visual_balance >= 4);
    const highReadability = goodSlides.filter(s => s.feedback.dimensional_ratings?.readability >= 4);
    const highDensity = goodSlides.filter(s => s.feedback.dimensional_ratings?.content_density >= 4);
    const highConsistency = goodSlides.filter(s => s.feedback.dimensional_ratings?.design_consistency >= 4);
    const highAppeal = goodSlides.filter(s => s.feedback.dimensional_ratings?.visual_appeal >= 4);

    // Information Hierarchy insights
    if (highHierarchy.length > 0) {
      insights.hierarchy.confidence = Math.round((highHierarchy.length / goodSlides.length) * 100);
      insights.hierarchy.guidelines = [
        `Use clear title prominence (${highHierarchy.filter(s => s.slide.title.length < 60).length}/${highHierarchy.length} effective slides have concise titles)`,
        `Structure content hierarchically (${highHierarchy.filter(s => s.slide.content.includes('•') || s.slide.content.includes('-')).length}/${highHierarchy.length} use bullet structure)`,
        `Maintain visual flow from top to bottom, left to right`
      ];
    }

    // Visual Balance insights  
    if (highBalance.length > 0) {
      insights.balance.confidence = Math.round((highBalance.length / goodSlides.length) * 100);
      const chartsWithText = highBalance.filter(s => s.slide.visualElements?.includes('charts') && s.slide.content.length > 50);
      insights.balance.guidelines = [
        `Balance text and visual elements (${chartsWithText.length}/${highBalance.length} successful slides combine charts with supporting text)`,
        `Use whitespace strategically to create breathing room`,
        `Distribute visual weight evenly across slide quadrants`
      ];
    }

    // Readability insights
    if (highReadability.length > 0) {
      insights.readability.confidence = Math.round((highReadability.length / goodSlides.length) * 100);
      const avgLength = Math.round(highReadability.reduce((sum, s) => sum + s.slide.content.length, 0) / highReadability.length);
      insights.readability.guidelines = [
        `Optimize text length for comprehension (high-rated slides average ${avgLength} characters)`,
        `Use high contrast between text and background`,
        `Choose legible font sizes and clear typography hierarchy`
      ];
    }

    // Content Density insights
    if (highDensity.length > 0) {
      insights.density.confidence = Math.round((highDensity.length / goodSlides.length) * 100);
      const avgBullets = Math.round(highDensity.reduce((sum, s) => sum + (s.slide.visualElements?.length || 0), 0) / highDensity.length);
      insights.density.guidelines = [
        `Follow 7±2 rule for information chunks (effective slides average ${avgBullets} main elements)`,
        `Use progressive disclosure for complex information`,
        `Balance information load with cognitive processing capacity`
      ];
    }

    // Design Consistency insights
    if (highConsistency.length > 0) {
      insights.consistency.confidence = Math.round((highConsistency.length / goodSlides.length) * 100);
      insights.consistency.guidelines = [
        `Maintain consistent alignment and spacing patterns`,
        `Use uniform style for similar content types`,
        `Apply grid-based layout for predictable structure`
      ];
    }

    // Visual Appeal insights
    if (highAppeal.length > 0) {
      insights.appeal.confidence = Math.round((highAppeal.length / goodSlides.length) * 100);
      insights.appeal.guidelines = [
        `Create visual interest through strategic use of color and imagery`,
        `Apply design principles that enhance rather than distract`,
        `Ensure aesthetic choices support content comprehension`
      ];
    }

    // Layout effectiveness patterns
    const layoutSuccess = this.analyzeLayoutEffectiveness(goodSlides);
    insights.layoutPatterns = layoutSuccess;

    return insights;
  }

  analyzeLayoutEffectiveness(goodSlides) {
    const patterns = [];
    
    // Analyze successful layout patterns
    const textChartSlides = goodSlides.filter(s => 
      s.slide.visualElements?.includes('charts') && s.slide.content.length > 100
    );
    
    if (textChartSlides.length > 0) {
      patterns.push(`Text-chart combination works best with ${Math.round(textChartSlides.reduce((sum, s) => sum + s.slide.content.length, 0) / textChartSlides.length)} character explanations`);
    }

    const minimalSlides = goodSlides.filter(s => 
      s.slide.content.length < 100 && !s.slide.visualElements?.includes('charts')
    );
    
    if (minimalSlides.length > 0) {
      patterns.push(`Minimal content slides (under 100 chars) achieve high impact through focus and whitespace`);
    }

    return patterns;
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
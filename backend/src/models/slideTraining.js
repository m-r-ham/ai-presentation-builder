// Slide Training Data Model
// This will store user feedback to train our AI slide design system

class SlideTrainingData {
  constructor() {
    // In production, this would connect to a database
    this.trainingData = [];
    this.slideDatabase = [];
  }

  // Store user feedback on slides with dimensional ratings
  async saveTrainingFeedback(slideData) {
    const trainingEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      slide: {
        title: slideData.title,
        content: slideData.content,
        imageUrl: slideData.imageUrl,
        layout: slideData.layout || 'unknown',
        visualElements: slideData.visualElements || []
      },
      feedback: {
        overall_rating: slideData.rating, // 1-5 stars overall
        dimensional_ratings: slideData.dimensionalRatings || {
          information_hierarchy: null,
          visual_balance: null,
          readability: null,
          content_density: null,
          design_consistency: null,
          visual_appeal: null
        },
        textFeedback: slideData.feedback,
        categories: this.categorizeSlide(slideData),
        effectivenessFactors: this.extractEffectivenessFactors(slideData.feedback)
      }
    };

    this.trainingData.push(trainingEntry);
    return trainingEntry;
  }

  // Categorize slides based on visual design patterns
  categorizeSlide(slideData) {
    const categories = [];
    
    // Layout pattern analysis
    if (slideData.has_chart && slideData.bullet_points && slideData.bullet_points.length >= 2) {
      categories.push('text-chart-split');
    }
    
    if (slideData.has_chart && slideData.content.length < 100) {
      categories.push('chart-dominant');
    }
    
    if (!slideData.has_chart && !slideData.has_image && slideData.content.length < 100) {
      categories.push('minimal-focused');
    }
    
    if (slideData.bullet_points && slideData.bullet_points.length > 5) {
      categories.push('information-dense');
    }
    
    // Visual complexity analysis
    if (slideData.shape_count > 6) {
      categories.push('complex-layout');
    } else if (slideData.shape_count <= 3) {
      categories.push('simple-layout');
    }
    
    // Content density analysis
    const totalText = (slideData.title || '').length + (slideData.content || '').length;
    if (totalText > 300) {
      categories.push('text-heavy');
    } else if (totalText < 100) {
      categories.push('text-light');
    }
    
    return categories;
  }

  // Extract design effectiveness factors from user feedback
  extractEffectivenessFactors(feedback) {
    const factors = [];
    const text = feedback.toLowerCase();
    
    // Visual design factors
    if (text.includes('clear') || text.includes('readable') || text.includes('legible')) factors.push('readability');
    if (text.includes('balanced') || text.includes('proportion') || text.includes('harmony')) factors.push('visual-balance');
    if (text.includes('simple') || text.includes('clean') || text.includes('minimal')) factors.push('simplicity');
    if (text.includes('organized') || text.includes('structured') || text.includes('hierarchy')) factors.push('organization');
    if (text.includes('space') || text.includes('breathing') || text.includes('whitespace')) factors.push('spacing');
    if (text.includes('aligned') || text.includes('consistent') || text.includes('neat')) factors.push('alignment');
    if (text.includes('contrast') || text.includes('stands out') || text.includes('pop')) factors.push('contrast');
    
    // Layout effectiveness factors
    if (text.includes('flow') || text.includes('logical') || text.includes('sequence')) factors.push('information-flow');
    if (text.includes('focus') || text.includes('attention') || text.includes('emphasis')) factors.push('focus-direction');
    if (text.includes('split') || text.includes('divided') || text.includes('sections')) factors.push('content-separation');
    if (text.includes('grid') || text.includes('columns') || text.includes('rows')) factors.push('grid-structure');
    
    // Negative design factors
    if (text.includes('cluttered') || text.includes('busy') || text.includes('crowded')) factors.push('clutter-negative');
    if (text.includes('dense') || text.includes('overwhelming') || text.includes('too much')) factors.push('density-negative');
    if (text.includes('unbalanced') || text.includes('lopsided') || text.includes('uneven')) factors.push('balance-negative');
    if (text.includes('hard to read') || text.includes('difficult') || text.includes('unclear')) factors.push('readability-negative');
    if (text.includes('boring') || text.includes('plain') || text.includes('uninspiring')) factors.push('engagement-negative');
    
    return factors;
  }

  // Get training data for AI model
  async getTrainingDataset() {
    return {
      goodSlides: this.trainingData.filter(entry => entry.feedback.rating >= 4),
      badSlides: this.trainingData.filter(entry => entry.feedback.rating <= 2),
      patterns: this.analyzePatterns(),
      effectivenessRules: this.generateEffectivenessRules()
    };
  }

  // Analyze patterns in good vs bad slides
  analyzePatterns() {
    const goodSlides = this.trainingData.filter(entry => entry.feedback.rating >= 4);
    const badSlides = this.trainingData.filter(entry => entry.feedback.rating <= 2);
    
    return {
      goodPatterns: this.extractPatterns(goodSlides),
      badPatterns: this.extractPatterns(badSlides),
      commonFactors: this.findCommonFactors(goodSlides, badSlides)
    };
  }

  extractPatterns(slides) {
    const patterns = {
      averageTextLength: 0,
      commonCategories: {},
      frequentFactors: {}
    };
    
    if (slides.length === 0) return patterns;
    
    // Calculate average text length
    patterns.averageTextLength = slides.reduce((sum, slide) => 
      sum + slide.slide.content.length, 0) / slides.length;
    
    // Count category frequencies
    slides.forEach(slide => {
      slide.feedback.categories.forEach(category => {
        patterns.commonCategories[category] = (patterns.commonCategories[category] || 0) + 1;
      });
      
      slide.feedback.effectivenessFactors.forEach(factor => {
        patterns.frequentFactors[factor] = (patterns.frequentFactors[factor] || 0) + 1;
      });
    });
    
    return patterns;
  }

  findCommonFactors(goodSlides, badSlides) {
    // Find factors that appear more in good slides vs bad slides
    const goodFactors = {};
    const badFactors = {};
    
    goodSlides.forEach(slide => {
      slide.feedback.effectivenessFactors.forEach(factor => {
        goodFactors[factor] = (goodFactors[factor] || 0) + 1;
      });
    });
    
    badSlides.forEach(slide => {
      slide.feedback.effectivenessFactors.forEach(factor => {
        badFactors[factor] = (badFactors[factor] || 0) + 1;
      });
    });
    
    return { goodFactors, badFactors };
  }

  // Generate rules for AI slide creation
  generateEffectivenessRules() {
    const patterns = this.analyzePatterns();
    const rules = [];
    
    // Text length rules
    if (patterns.goodPatterns.averageTextLength < patterns.badPatterns.averageTextLength) {
      rules.push({
        type: 'text-length',
        rule: 'Keep slide content concise',
        recommendation: `Aim for ${Math.round(patterns.goodPatterns.averageTextLength)} characters or less`,
        confidence: 0.8
      });
    }
    
    // Visual appeal rules
    if (patterns.commonFactors.goodFactors.clarity > (patterns.commonFactors.badFactors.clarity || 0)) {
      rules.push({
        type: 'clarity',
        rule: 'Prioritize clear, readable content',
        recommendation: 'Use high contrast, clear fonts, and logical hierarchy',
        confidence: 0.9
      });
    }
    
    return rules;
  }
}

module.exports = SlideTrainingData;
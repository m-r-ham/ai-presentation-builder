// Slide Training Data Model
// This will store user feedback to train our AI slide design system

class SlideTrainingData {
  constructor() {
    // In production, this would connect to a database
    this.trainingData = [];
    this.slideDatabase = [];
  }

  // Store user feedback on slides
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
        rating: slideData.rating, // 1-5 stars
        textFeedback: slideData.feedback,
        categories: this.categorizeSlide(slideData),
        effectivenessFactors: this.extractEffectivenessFactors(slideData.feedback)
      }
    };

    this.trainingData.push(trainingEntry);
    return trainingEntry;
  }

  // Categorize slides based on content and structure
  categorizeSlide(slideData) {
    const categories = [];
    
    // Content type analysis
    if (slideData.title.toLowerCase().includes('chart') || 
        slideData.title.toLowerCase().includes('graph') ||
        slideData.title.toLowerCase().includes('data')) {
      categories.push('data-visualization');
    }
    
    if (slideData.title.toLowerCase().includes('title') ||
        slideData.title.toLowerCase().includes('intro')) {
      categories.push('title-slide');
    }
    
    if (slideData.content.length > 200) {
      categories.push('text-heavy');
    } else if (slideData.content.length < 50) {
      categories.push('minimal-text');
    }
    
    return categories;
  }

  // Extract effectiveness factors from user feedback
  extractEffectivenessFactors(feedback) {
    const factors = [];
    const text = feedback.toLowerCase();
    
    // Positive factors
    if (text.includes('clear') || text.includes('readable')) factors.push('clarity');
    if (text.includes('visual') || text.includes('image')) factors.push('visual-appeal');
    if (text.includes('simple') || text.includes('clean')) factors.push('simplicity');
    if (text.includes('balanced') || text.includes('layout')) factors.push('layout');
    
    // Negative factors
    if (text.includes('cluttered') || text.includes('busy')) factors.push('clutter-negative');
    if (text.includes('text') && text.includes('too much')) factors.push('text-overload');
    if (text.includes('boring') || text.includes('dull')) factors.push('engagement-issues');
    
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
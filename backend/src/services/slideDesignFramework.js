/**
 * Proprietary Slide Design Framework (SDF)
 * LLM-optimized system for mapping PowerPoint designs to AI-readable JSON
 */

class SlideDesignFramework {
  constructor() {
    this.designPatterns = this.initializeDesignPatterns();
    this.layoutTypes = this.initializeLayoutTypes();
    this.visualElements = this.initializeVisualElements();
  }

  // Initialize comprehensive design patterns based on consultant templates
  initializeDesignPatterns() {
    return {
      // Strategic Frameworks
      'matrix-2x2': {
        name: '2x2 Matrix',
        description: 'Four-quadrant analysis framework',
        use_cases: ['BCG Matrix', 'Eisenhower Matrix', 'Risk Assessment'],
        optimal_content: 'Short labels, clear quadrant names',
        ai_prompt_template: 'Create a 2x2 matrix showing {axis_x} vs {axis_y} with {item_count} items positioned in quadrants',
        effectiveness_score: 0.9
      },
      'matrix-3x3': {
        name: '3x3 Matrix',
        description: 'Nine-cell strategic framework',
        use_cases: ['GE McKinsey Matrix', 'Strategic Options'],
        optimal_content: 'Minimal text, focus on positioning',
        ai_prompt_template: 'Design a 3x3 matrix analyzing {dimension_1} vs {dimension_2}',
        effectiveness_score: 0.85
      },
      'porter-five-forces': {
        name: "Porter's Five Forces",
        description: 'Industry analysis framework',
        use_cases: ['Market Analysis', 'Competitive Strategy'],
        optimal_content: 'Brief force descriptions, impact ratings',
        ai_prompt_template: 'Create Porter Five Forces analysis for {industry} with emphasis on {primary_force}',
        effectiveness_score: 0.95
      },
      'value-chain': {
        name: 'Value Chain Analysis',
        description: 'Business process optimization framework',
        use_cases: ['Process Improvement', 'Cost Analysis'],
        optimal_content: 'Process steps, value-add indicators',
        ai_prompt_template: 'Design value chain for {business_type} highlighting {optimization_area}',
        effectiveness_score: 0.88
      },
      'hypothesis-tree': {
        name: 'Hypothesis Tree',
        description: 'Problem decomposition framework',
        use_cases: ['Problem Solving', 'Root Cause Analysis'],
        optimal_content: 'Clear hypotheses, logical branching',
        ai_prompt_template: 'Build hypothesis tree for {problem_statement} with {branch_count} main branches',
        effectiveness_score: 0.92
      },
      'issue-tree': {
        name: 'Issue Tree',
        description: 'MECE problem breakdown',
        use_cases: ['Consulting Analysis', 'Project Planning'],
        optimal_content: 'MECE categories, actionable issues',
        ai_prompt_template: 'Create issue tree for {main_issue} using MECE principle',
        effectiveness_score: 0.94
      }
    };
  }

  // Initialize layout types based on extracted data
  initializeLayoutTypes() {
    return {
      'title-slide': {
        name: 'Title Slide',
        pattern: 'Large title, subtitle, minimal graphics',
        text_ratio: 0.3,
        recommended_fonts: ['Calibri', 'Arial', 'Helvetica'],
        ai_guidance: 'Keep title under 8 words, subtitle under 12 words'
      },
      'content-heavy': {
        name: 'Content Slide',
        pattern: 'Title + bullet points or paragraphs',
        text_ratio: 0.7,
        max_bullets: 5,
        ai_guidance: 'Use parallel structure, start bullets with action verbs'
      },
      'visual-dominant': {
        name: 'Visual Slide',
        pattern: 'Large image/chart with minimal text',
        text_ratio: 0.2,
        image_ratio: 0.6,
        ai_guidance: 'Let visuals tell the story, use captions not descriptions'
      },
      'data-visualization': {
        name: 'Data Slide',
        pattern: 'Charts, graphs, tables with insights',
        text_ratio: 0.3,
        chart_types: ['bar', 'line', 'pie', 'scatter', 'heatmap'],
        ai_guidance: 'Highlight key insights, use consistent color coding'
      },
      'framework-diagram': {
        name: 'Framework Slide',
        pattern: 'Strategic frameworks and models',
        text_ratio: 0.4,
        complexity_level: 'medium',
        ai_guidance: 'Balance information density with clarity'
      },
      'quote-testimonial': {
        name: 'Quote Slide',
        pattern: 'Large quote with attribution',
        text_ratio: 0.5,
        typography_focus: 'high',
        ai_guidance: 'Use typography hierarchy, consider pull quotes'
      }
    };
  }

  // Initialize visual elements catalog
  initializeVisualElements() {
    return {
      'icons': {
        usage: 'Concept representation, navigation, emphasis',
        best_practices: ['Consistent style', 'Appropriate size', 'Meaningful context'],
        ai_selection_criteria: 'Match concept metaphor, maintain visual consistency'
      },
      'color-coding': {
        usage: 'Categorization, hierarchy, branding',
        best_practices: ['Accessibility compliant', 'Cultural sensitivity', 'Brand alignment'],
        ai_selection_criteria: 'Logical grouping, sufficient contrast, emotional appropriateness'
      },
      'whitespace': {
        usage: 'Visual breathing room, focus direction',
        best_practices: ['30-40% of slide area', 'Consistent margins', 'Purposeful placement'],
        ai_selection_criteria: 'Balance information density with readability'
      },
      'typography-hierarchy': {
        usage: 'Information organization, reading flow',
        best_practices: ['Maximum 3 font sizes', 'Consistent spacing', 'High contrast'],
        ai_selection_criteria: 'Guide eye movement, emphasize key points'
      }
    };
  }

  // Convert extracted PowerPoint slide to SDF format
  convertToSDF(rawSlide) {
    const sdf = {
      slide_id: rawSlide.id,
      metadata: {
        source: 'consultant_template',
        extraction_confidence: this.calculateExtractionConfidence(rawSlide),
        complexity_score: this.calculateComplexityScore(rawSlide)
      },
      design_analysis: {
        layout_type: this.identifyLayoutType(rawSlide),
        design_patterns: this.identifyDesignPatterns(rawSlide),
        visual_elements: this.analyzeVisualElements(rawSlide),
        text_analysis: this.analyzeTextContent(rawSlide)
      },
      ai_optimization: {
        prompt_template: this.generatePromptTemplate(rawSlide),
        improvement_suggestions: this.generateImprovementSuggestions(rawSlide),
        effectiveness_prediction: this.predictEffectiveness(rawSlide)
      },
      training_value: {
        pattern_clarity: this.assessPatternClarity(rawSlide),
        reusability_score: this.calculateReusabilityScore(rawSlide),
        learning_potential: this.assessLearningPotential(rawSlide)
      }
    };

    return sdf;
  }

  // Identify the primary layout type
  identifyLayoutType(slide) {
    const textRatio = this.calculateTextRatio(slide);
    const hasVisuals = slide.has_image || slide.has_chart || slide.has_table;
    
    if (slide.slide_number === 1 || slide.title.toLowerCase().includes('title')) {
      return 'title-slide';
    }
    
    if (slide.layout_name && slide.layout_name.includes('Matrix')) {
      return 'framework-diagram';
    }
    
    if (slide.has_chart || slide.has_table) {
      return 'data-visualization';
    }
    
    if (hasVisuals && textRatio < 0.3) {
      return 'visual-dominant';
    }
    
    if (slide.title.toLowerCase().includes('quote') || slide.content.includes('"')) {
      return 'quote-testimonial';
    }
    
    return 'content-heavy';
  }

  // Identify design patterns used in the slide
  identifyDesignPatterns(slide) {
    const patterns = [];
    const title = slide.title.toLowerCase();
    const content = slide.content.toLowerCase();
    
    // Matrix patterns
    if (title.includes('2x2') || title.includes('matrix')) {
      patterns.push('matrix-2x2');
    }
    if (title.includes('3x3')) {
      patterns.push('matrix-3x3');
    }
    
    // Strategic frameworks
    if (title.includes('porter') || title.includes('five forces')) {
      patterns.push('porter-five-forces');
    }
    if (title.includes('value chain')) {
      patterns.push('value-chain');
    }
    if (title.includes('hypothesis tree')) {
      patterns.push('hypothesis-tree');
    }
    if (title.includes('issue tree')) {
      patterns.push('issue-tree');
    }
    
    return patterns;
  }

  // Analyze visual elements present
  analyzeVisualElements(slide) {
    const elements = [];
    
    if (slide.has_image) elements.push('images');
    if (slide.has_chart) elements.push('charts');
    if (slide.has_table) elements.push('tables');
    if (slide.bullet_points.length > 0) elements.push('bullet-lists');
    if (slide.shape_count > 5) elements.push('complex-layout');
    
    return elements;
  }

  // Analyze text content for AI optimization
  analyzeTextContent(slide) {
    return {
      title_length: slide.title.length,
      content_length: slide.content.length,
      bullet_count: slide.bullet_points.length,
      readability_score: this.calculateReadabilityScore(slide),
      keyword_density: this.extractKeywords(slide),
      action_verbs: this.countActionVerbs(slide)
    };
  }

  // Generate AI prompt template for reproducing this slide type
  generatePromptTemplate(slide) {
    const layoutType = this.identifyLayoutType(slide);
    const patterns = this.identifyDesignPatterns(slide);
    
    let template = `Create a ${layoutType} slide with the following characteristics:\n`;
    template += `- Title: ${slide.title.length < 50 ? 'Concise' : 'Detailed'} (${slide.title.length} chars)\n`;
    template += `- Content: ${slide.content.length < 100 ? 'Brief' : 'Comprehensive'} (${slide.content.length} chars)\n`;
    
    if (patterns.length > 0) {
      template += `- Framework: ${patterns[0]}\n`;
    }
    
    if (slide.bullet_points.length > 0) {
      template += `- Bullet points: ${slide.bullet_points.length} items\n`;
    }
    
    template += `- Visual elements: ${this.analyzeVisualElements(slide).join(', ')}\n`;
    
    return template;
  }

  // Generate improvement suggestions
  generateImprovementSuggestions(slide) {
    const suggestions = [];
    
    if (slide.title.length > 60) {
      suggestions.push('Consider shortening title for better impact');
    }
    
    if (slide.content.length > 300) {
      suggestions.push('Break content into multiple slides or use bullet points');
    }
    
    if (slide.bullet_points.length > 7) {
      suggestions.push('Reduce bullet points to maximum 5-7 for better retention');
    }
    
    if (!slide.has_image && !slide.has_chart && slide.content.length > 200) {
      suggestions.push('Consider adding visual elements to support text');
    }
    
    return suggestions;
  }

  // Helper methods
  calculateTextRatio(slide) {
    const totalChars = slide.title.length + slide.content.length + 
                     slide.bullet_points.join(' ').length;
    return Math.min(totalChars / 500, 1.0); // Normalize to 0-1
  }

  calculateExtractionConfidence(slide) {
    let confidence = 0.5; // Base confidence
    
    if (slide.title && slide.title.length > 0) confidence += 0.2;
    if (slide.content && slide.content.length > 0) confidence += 0.2;
    if (slide.layout_name) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  calculateComplexityScore(slide) {
    let complexity = 0;
    
    complexity += slide.shape_count * 0.1;
    complexity += slide.bullet_points.length * 0.05;
    complexity += (slide.has_chart ? 0.3 : 0);
    complexity += (slide.has_table ? 0.2 : 0);
    complexity += (slide.has_image ? 0.1 : 0);
    
    return Math.min(complexity, 1.0);
  }

  calculateReadabilityScore(slide) {
    // Simple readability based on sentence length and complexity
    const text = slide.title + ' ' + slide.content;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    
    return Math.max(0, 1 - (avgSentenceLength - 10) / 20); // Optimal around 10 words per sentence
  }

  extractKeywords(slide) {
    const text = (slide.title + ' ' + slide.content).toLowerCase();
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = text.split(/\W+/).filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    // Count word frequency
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }

  countActionVerbs(slide) {
    const actionVerbs = ['create', 'develop', 'implement', 'analyze', 'evaluate', 'design', 'build', 'execute', 'manage', 'optimize'];
    const text = (slide.title + ' ' + slide.content + ' ' + slide.bullet_points.join(' ')).toLowerCase();
    
    return actionVerbs.filter(verb => text.includes(verb)).length;
  }

  assessPatternClarity(slide) {
    const patterns = this.identifyDesignPatterns(slide);
    return patterns.length > 0 ? 0.8 : 0.4;
  }

  calculateReusabilityScore(slide) {
    let score = 0.5;
    
    // Framework slides are more reusable
    if (this.identifyDesignPatterns(slide).length > 0) score += 0.3;
    
    // Clear structure increases reusability
    if (slide.bullet_points.length > 0) score += 0.1;
    
    // Visual elements add reusability
    if (slide.has_chart || slide.has_image) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  assessLearningPotential(slide) {
    const complexity = this.calculateComplexityScore(slide);
    const clarity = this.assessPatternClarity(slide);
    
    // Medium complexity with high clarity = high learning potential
    return (1 - Math.abs(complexity - 0.5)) * clarity;
  }

  predictEffectiveness(slide) {
    const readability = this.calculateReadabilityScore(slide);
    const complexity = this.calculateComplexityScore(slide);
    const patterns = this.identifyDesignPatterns(slide);
    
    let effectiveness = readability * 0.4;
    effectiveness += (1 - complexity) * 0.3; // Lower complexity = higher effectiveness
    effectiveness += (patterns.length > 0 ? 0.3 : 0.1);
    
    return Math.min(effectiveness, 1.0);
  }
}

module.exports = SlideDesignFramework;
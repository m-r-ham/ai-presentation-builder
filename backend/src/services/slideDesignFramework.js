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

  // Initialize visual design patterns focused on layout and effectiveness
  initializeDesignPatterns() {
    return {
      // Layout & Composition Patterns
      'split-left-text-right-visual': {
        name: 'Left Text, Right Visual',
        description: 'Text content on left, chart/image on right',
        use_cases: ['Data presentation with context', 'Feature explanations', 'Before/after comparisons'],
        optimal_content: '2-4 bullet points, concise chart labels',
        design_principles: ['visual balance', 'logical reading flow', 'content separation'],
        ai_prompt_template: 'Create a slide with {bullet_count} key points on the left and {visual_type} on the right',
        effectiveness_score: 0.85
      },
      'split-right-text-left-visual': {
        name: 'Right Text, Left Visual',
        description: 'Chart/image on left, text content on right',
        use_cases: ['Image-first storytelling', 'Visual emphasis', 'Product showcases'],
        optimal_content: 'Supporting text, brief explanations',
        design_principles: ['visual priority', 'contextual support', 'hierarchy'],
        ai_prompt_template: 'Lead with {visual_type} on left, support with {text_elements} on right',
        effectiveness_score: 0.82
      },
      'chart-with-overlay-text': {
        name: 'Chart with Text Overlay',
        description: 'Text box positioned over chart in empty space',
        use_cases: ['Dense data visualization', 'Key insights highlight', 'Space-efficient design'],
        optimal_content: '2-3 key takeaways, minimal text',
        design_principles: ['space utilization', 'readability contrast', 'visual hierarchy'],
        ai_prompt_template: 'Position {insight_count} key insights over chart in areas with minimal data density',
        effectiveness_score: 0.88
      },
      'vertical-text-chart-stack': {
        name: 'Vertical Text-Chart Stack',
        description: 'Text above or below chart, full width',
        use_cases: ['Complex charts needing context', 'Timeline presentations', 'Process flows'],
        optimal_content: 'Brief intro/conclusion, detailed chart',
        design_principles: ['vertical flow', 'full-width utilization', 'clear separation'],
        ai_prompt_template: 'Stack {text_position} text with full-width {chart_type} below/above',
        effectiveness_score: 0.79
      },
      'center-focus-minimal': {
        name: 'Center Focus Minimal',
        description: 'Single central element with ample whitespace',
        use_cases: ['Key messages', 'Impact statements', 'Simple concepts'],
        optimal_content: 'One main idea, minimal supporting text',
        design_principles: ['whitespace utilization', 'focus attention', 'visual impact'],
        ai_prompt_template: 'Center {main_element} with generous whitespace for maximum impact',
        effectiveness_score: 0.92
      },
      'grid-layout-equal': {
        name: 'Equal Grid Layout',
        description: 'Multiple elements in balanced grid',
        use_cases: ['Feature comparisons', 'Team introductions', 'Product lineups'],
        optimal_content: 'Consistent formatting per grid item',
        design_principles: ['visual balance', 'consistent spacing', 'parallel structure'],
        ai_prompt_template: 'Arrange {item_count} elements in {grid_size} grid with consistent formatting',
        effectiveness_score: 0.81
      },
      'progressive-disclosure': {
        name: 'Progressive Information Disclosure',
        description: 'Information revealed in logical sequence',
        use_cases: ['Step-by-step processes', 'Learning materials', 'Complex explanations'],
        optimal_content: 'Hierarchical text structure, clear progression',
        design_principles: ['information hierarchy', 'cognitive load management', 'logical flow'],
        ai_prompt_template: 'Structure information in {hierarchy_levels} levels from general to specific',
        effectiveness_score: 0.86
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

  // Initialize visual design elements focused on layout effectiveness
  initializeVisualElements() {
    return {
      'spacing-rhythm': {
        usage: 'Consistent visual rhythm and breathing room',
        best_practices: ['8px grid system', 'Consistent margins', 'Proportional spacing'],
        ai_selection_criteria: 'Maintain visual harmony, improve readability, guide eye flow',
        quality_indicators: ['consistent margins', 'balanced proportions', 'purposeful gaps']
      },
      'visual-hierarchy': {
        usage: 'Guide attention through size, contrast, positioning',
        best_practices: ['Primary/secondary/tertiary levels', 'Strategic emphasis', 'Clear reading path'],
        ai_selection_criteria: 'Emphasize key information, create logical flow, avoid visual chaos',
        quality_indicators: ['clear priority levels', 'strategic emphasis', 'logical progression']
      },
      'content-density': {
        usage: 'Balance information load with comprehension',
        best_practices: ['7±2 rule for lists', 'Strategic whitespace', 'Progressive disclosure'],
        ai_selection_criteria: 'Optimize cognitive load, maintain engagement, ensure retention',
        quality_indicators: ['appropriate information load', 'readable text sizes', 'focused messaging']
      },
      'alignment-consistency': {
        usage: 'Create visual order and professional appearance',
        best_practices: ['Grid-based layout', 'Consistent alignment', 'Intentional positioning'],
        ai_selection_criteria: 'Improve perceived quality, reduce cognitive load, enhance trust',
        quality_indicators: ['clean edges', 'predictable placement', 'visual stability']
      },
      'contrast-legibility': {
        usage: 'Ensure readability and accessibility',
        best_practices: ['WCAG contrast ratios', 'Color-blind friendly', 'Size appropriateness'],
        ai_selection_criteria: 'Guarantee readability, support accessibility, maintain professionalism',
        quality_indicators: ['high readability', 'sufficient contrast', 'accessible design']
      },
      'visual-balance': {
        usage: 'Distribute visual weight for harmony',
        best_practices: ['Balanced composition', 'Strategic asymmetry', 'Proportional elements'],
        ai_selection_criteria: 'Create visual stability, guide attention, improve aesthetics',
        quality_indicators: ['harmonious composition', 'stable visual weight', 'intentional asymmetry']
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

  // Identify visual design patterns used in the slide
  identifyDesignPatterns(slide) {
    const patterns = [];
    const hasChart = slide.has_chart;
    const hasImage = slide.has_image;
    const hasTable = slide.has_table;
    const bulletCount = slide.bullet_points.length;
    const textRatio = this.calculateTextRatio(slide);
    const layoutName = slide.layout_name?.toLowerCase() || '';
    
    // Analyze layout patterns based on content distribution
    if (hasChart && bulletCount >= 2 && bulletCount <= 4) {
      // Likely text-chart split layout
      patterns.push('split-left-text-right-visual');
    }
    
    if (hasChart && textRatio < 0.2) {
      // Chart-dominant with minimal text - could be overlay
      patterns.push('chart-with-overlay-text');
    }
    
    if (hasChart && textRatio > 0.3 && slide.content.length > 100) {
      // Substantial text with chart - likely stacked
      patterns.push('vertical-text-chart-stack');
    }
    
    if (!hasChart && !hasImage && !hasTable && textRatio < 0.3) {
      // Minimal content, likely center focus
      patterns.push('center-focus-minimal');
    }
    
    if (slide.shape_count > 6 && bulletCount > 0) {
      // Multiple elements suggest grid layout
      patterns.push('grid-layout-equal');
    }
    
    if (bulletCount > 5 && slide.content.length > 200) {
      // Hierarchical information structure
      patterns.push('progressive-disclosure');
    }
    
    // Image-based patterns
    if (hasImage && bulletCount >= 2 && bulletCount <= 4) {
      patterns.push('split-right-text-left-visual');
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

  // Generate design-focused improvement suggestions
  generateImprovementSuggestions(slide) {
    const suggestions = [];
    const textRatio = this.calculateTextRatio(slide);
    const bulletCount = slide.bullet_points.length;
    
    // Content density suggestions
    if (slide.title.length > 60) {
      suggestions.push('Shorten title for better visual impact and readability');
    }
    
    if (slide.content.length > 300 && !slide.has_chart && !slide.has_image) {
      suggestions.push('Consider text-visual split layout to reduce cognitive load');
    }
    
    if (bulletCount > 7) {
      suggestions.push('Reduce to 5-7 bullet points for better comprehension (7±2 rule)');
    }
    
    // Layout and visual balance suggestions
    if (slide.has_chart && bulletCount >= 3 && bulletCount <= 5) {
      suggestions.push('Good candidate for left-text, right-chart layout pattern');
    }
    
    if (slide.has_chart && textRatio < 0.15) {
      suggestions.push('Consider overlay text box on chart for key insights');
    }
    
    if (!slide.has_image && !slide.has_chart && textRatio > 0.6) {
      suggestions.push('Add visual element to break up text density and improve engagement');
    }
    
    // Visual hierarchy suggestions
    if (slide.shape_count > 8) {
      suggestions.push('Simplify layout to reduce visual complexity and improve focus');
    }
    
    if (textRatio < 0.1 && !slide.has_chart && !slide.has_image) {
      suggestions.push('Perfect for center-focus minimal layout with ample whitespace');
    }
    
    // Design quality suggestions
    if (bulletCount > 3 && slide.content.length > 150) {
      suggestions.push('Consider progressive disclosure or grid layout for better organization');
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
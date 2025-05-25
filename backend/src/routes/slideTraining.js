const SlideTrainingData = require('../models/slideTraining');
const SlideDesignFramework = require('../services/slideDesignFramework');
const fs = require('fs');
const path = require('path');

// Initialize training data store and design framework
const trainingStore = new SlideTrainingData();
const designFramework = new SlideDesignFramework();

async function slideTrainingRoutes(fastify, options) {
  // Save user feedback on slides
  fastify.post('/training/feedback', async (request, reply) => {
    try {
      const { slideData, rating, feedback } = request.body;
      
      const trainingEntry = await trainingStore.saveTrainingFeedback({
        ...slideData,
        rating,
        feedback
      });
      
      return { 
        success: true, 
        message: 'Training feedback saved',
        entryId: trainingEntry.id
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to save training feedback' });
    }
  });

  // Get training dataset for analysis
  fastify.get('/training/dataset', async (request, reply) => {
    try {
      const dataset = await trainingStore.getTrainingDataset();
      return dataset;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve training dataset' });
    }
  });

  // Get effectiveness rules for AI slide generation
  fastify.get('/training/rules', async (request, reply) => {
    try {
      const rules = trainingStore.generateEffectivenessRules();
      return { rules };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to generate effectiveness rules' });
    }
  });

  // Get real slides from various sources
  fastify.get('/slides/real-examples', async (request, reply) => {
    try {
      const realSlides = await getRealSlideExamples();
      return { 
        slides: realSlides,
        total_count: realSlides.length,
        framework_version: '1.0.0'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch real slide examples' });
    }
  });

  // Get SDF framework data for AI training
  fastify.get('/slides/sdf-framework', async (request, reply) => {
    try {
      return {
        design_patterns: designFramework.designPatterns,
        layout_types: designFramework.layoutTypes,
        visual_elements: designFramework.visualElements,
        framework_version: '1.0.0',
        description: 'Proprietary Slide Design Framework for LLM optimization'
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch SDF framework data' });
    }
  });

  // Analyze a slide using SDF framework
  fastify.post('/slides/analyze', async (request, reply) => {
    try {
      const { slideData } = request.body;
      const sdfAnalysis = designFramework.convertToSDF(slideData);
      
      return {
        analysis: sdfAnalysis,
        recommendations: sdfAnalysis.ai_optimization.improvement_suggestions,
        effectiveness_score: sdfAnalysis.ai_optimization.effectiveness_prediction
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to analyze slide' });
    }
  });
}

// Function to get real slide examples from extracted PowerPoint
async function getRealSlideExamples() {
  try {
    // Load extracted consultant slides
    const consultantSlidesPath = path.join(__dirname, '../../data/consultant_slides.json');
    const consultantData = JSON.parse(fs.readFileSync(consultantSlidesPath, 'utf8'));
    
    // Convert to training format with SDF analysis
    const processedSlides = consultantData.slides
      .filter(slide => slide.title && slide.title !== 'Subtitle') // Filter out generic slides
      .slice(0, 50) // Limit to first 50 for better training experience
      .map(slide => {
        // Convert to SDF format
        const sdfAnalysis = designFramework.convertToSDF(slide);
        
        return {
          id: slide.id,
          title: slide.title,
          content: slide.content || 'Template slide for consulting presentations',
          imageUrl: slide.image_filename ? `http://localhost:3001/api/images/${slide.image_filename}` : `https://via.placeholder.com/600x400/${getColorForSlideType(sdfAnalysis.design_analysis.layout_type)}/ffffff?text=${encodeURIComponent(slide.title.substring(0, 20))}`,
          source: 'Consultant Template',
          category: sdfAnalysis.design_analysis.layout_type,
          designPatterns: sdfAnalysis.design_analysis.design_patterns,
          sdf_analysis: sdfAnalysis,
          layout_name: slide.layout_name,
          has_image: slide.has_image,
          has_chart: slide.has_chart,
          has_table: slide.has_table,
          bullet_points: slide.bullet_points,
          effectiveness_prediction: sdfAnalysis.ai_optimization.effectiveness_prediction
        };
      });

    // Add some placeholder slides to reach more variety
    const placeholderSlides = [
      {
        id: 'placeholder-1',
        title: 'Market Analysis Dashboard',
        content: 'Comprehensive market analysis showing growth trends, competitive positioning, and future opportunities.',
        imageUrl: 'https://via.placeholder.com/600x400/e74c3c/ffffff?text=Market+Analysis',
        source: 'Business Intelligence',
        category: 'data-visualization',
        designPatterns: ['data-focus', 'dashboard-layout'],
        effectiveness_prediction: 0.85
      },
      {
        id: 'placeholder-2',
        title: 'Team Performance Metrics',
        content: 'Q4 team performance showing 23% improvement in productivity and 95% goal achievement rate.',
        imageUrl: 'https://via.placeholder.com/600x400/27ae60/ffffff?text=Performance+Metrics',
        source: 'HR Dashboard',
        category: 'data-visualization',
        designPatterns: ['metrics-focus', 'achievement-highlight'],
        effectiveness_prediction: 0.78
      }
    ];

    return [...processedSlides, ...placeholderSlides];
    
  } catch (error) {
    console.error('Error loading consultant slides:', error);
    
    // Fallback to basic examples
    return [
      {
        id: 'fallback-1',
        title: 'Strategic Framework Template',
        content: 'Template slide for strategic analysis and planning frameworks.',
        imageUrl: 'https://via.placeholder.com/600x400/3498db/ffffff?text=Strategic+Framework',
        source: 'Fallback Template',
        category: 'framework-diagram',
        designPatterns: ['strategic-analysis'],
        effectiveness_prediction: 0.7
      }
    ];
  }
}

// Helper function to get color based on slide type
function getColorForSlideType(layoutType) {
  const colorMap = {
    'title-slide': '2c3e50',
    'content-heavy': '34495e',
    'visual-dominant': '9b59b6',
    'data-visualization': 'e74c3c',
    'framework-diagram': '3498db',
    'quote-testimonial': 'f39c12'
  };
  
  return colorMap[layoutType] || '95a5a6';
}

module.exports = slideTrainingRoutes;
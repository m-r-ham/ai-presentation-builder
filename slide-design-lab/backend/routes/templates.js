const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Database = require('../database/init');

const router = express.Router();
const db = new Database();

// Save slide as template
router.post('/save', async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const { name, slidevMarkdown, category, description } = req.body;
    
    if (!name || !slidevMarkdown) {
      return res.status(400).json({ error: 'Name and slidevMarkdown are required' });
    }

    const templateId = uuidv4();
    
    // Create templates directory structure
    const templatesBaseDir = path.join(__dirname, '../../templates');
    const categoryDir = path.join(templatesBaseDir, category || 'general');
    
    // Ensure directories exist
    fs.mkdirSync(templatesBaseDir, { recursive: true });
    fs.mkdirSync(categoryDir, { recursive: true });
    
    // Create safe filename from template name
    const safeFileName = name
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase()
      .substring(0, 50); // Limit length
    
    const fileName = `${safeFileName}-${templateId.substring(0, 8)}.md`;
    const filePath = path.join(categoryDir, fileName);
    
    // Create template metadata header
    const templateHeader = `---
# Template Metadata
template_id: ${templateId}
template_name: "${name}"
category: ${category || 'general'}
description: "${description || ''}"
created_at: ${new Date().toISOString()}
source: slide-design-lab
---

`;
    
    // Write markdown file
    const fullContent = templateHeader + slidevMarkdown;
    fs.writeFileSync(filePath, fullContent, 'utf8');
    
    // Create templates table if it doesn't exist
    db.db.run(`
      CREATE TABLE IF NOT EXISTS slide_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slidev_markdown TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        description TEXT,
        file_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        usage_count INTEGER DEFAULT 0
      )
    `);

    // Insert template with file path
    db.db.run(
      `INSERT INTO slide_templates (id, name, slidev_markdown, category, description, file_path) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [templateId, name, slidevMarkdown, category || 'general', description || '', filePath]
    );

    res.json({
      success: true,
      templateId,
      filePath: filePath,
      fileName: fileName,
      message: 'Template saved successfully as markdown file'
    });

  } catch (error) {
    console.error('Template save error:', error);
    res.status(500).json({ 
      error: 'Failed to save template',
      details: error.message 
    });
  }
});

// Get all templates
router.get('/list', (req, res) => {
  try {
    const templates = db.db.prepare(`
      SELECT * FROM slide_templates 
      ORDER BY created_at DESC
    `).all();

    res.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Template list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch templates',
      details: error.message 
    });
  }
});

// Use template (increment usage count)
router.post('/use/:templateId', (req, res) => {
  try {
    const { templateId } = req.params;

    // Get template
    const template = db.db.prepare('SELECT * FROM slide_templates WHERE id = ?').get(templateId);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Increment usage count
    db.db.run('UPDATE slide_templates SET usage_count = usage_count + 1 WHERE id = ?', [templateId]);

    res.json({
      success: true,
      template
    });

  } catch (error) {
    console.error('Template use error:', error);
    res.status(500).json({ 
      error: 'Failed to use template',
      details: error.message 
    });
  }
});

// Export templates for main system integration
router.get('/export-for-main-app', (req, res) => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const templatesBaseDir = path.join(__dirname, '../../templates');
    
    if (!fs.existsSync(templatesBaseDir)) {
      return res.json({
        success: true,
        templates: [],
        templateFiles: [],
        message: 'No templates directory found'
      });
    }
    
    // Get database records
    const templates = db.db.prepare(`
      SELECT * FROM slide_templates 
      ORDER BY usage_count DESC, created_at DESC
    `).all();
    
    // Scan file system for all markdown files
    const templateFiles = [];
    
    function scanDirectory(dir, category = '') {
      if (!fs.existsSync(dir)) return;
      
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          // Recursively scan subdirectories
          scanDirectory(itemPath, item);
        } else if (item.endsWith('.md')) {
          // Add markdown file info
          templateFiles.push({
            fileName: item,
            filePath: itemPath,
            relativePath: path.relative(templatesBaseDir, itemPath),
            category: category || 'general',
            size: stat.size,
            modified: stat.mtime.toISOString()
          });
        }
      }
    }
    
    scanDirectory(templatesBaseDir);
    
    res.json({
      success: true,
      templates: templates,
      templateFiles: templateFiles,
      templatesDirectory: templatesBaseDir,
      totalTemplates: templates.length,
      totalFiles: templateFiles.length,
      message: 'Templates exported successfully for main app integration'
    });

  } catch (error) {
    console.error('Template export error:', error);
    res.status(500).json({ 
      error: 'Failed to export templates',
      details: error.message 
    });
  }
});

module.exports = router;
const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Build Slidev presentation from markdown
router.post('/build', async (req, res) => {
  let tempDir = '';
  
  try {
    const { markdown, versionId } = req.body;
    
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown is required' });
    }

    // Create temporary directory for this build
    const buildId = versionId || uuidv4();
    tempDir = path.join(__dirname, '../temp', buildId);
    
    // Ensure temp directory exists
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Write markdown to slides.md
    const slidesPath = path.join(tempDir, 'slides.md');
    fs.writeFileSync(slidesPath, markdown);
    
    // Create package.json for Slidev
    const packageJson = {
      "name": `slide-${buildId}`,
      "type": "module",
      "scripts": {
        "build": "slidev build",
        "dev": "slidev --open",
        "export": "slidev export"
      },
      "dependencies": {
        "@slidev/cli": "^0.48.0",
        "@slidev/theme-default": "*"
      }
    };
    
    fs.writeFileSync(
      path.join(tempDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Install dependencies and build
    console.log(`Building Slidev in ${tempDir}`);
    
    // Install Slidev dependencies
    execSync('npm install', { 
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 30000 // 30 second timeout
    });
    
    // Build the presentation with correct base path
    execSync('npm run build -- --base /slides/' + buildId + '/', { 
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 60000 // 60 second timeout
    });
    
    // The built files should be in tempDir/dist
    const distDir = path.join(tempDir, 'dist');
    
    if (!fs.existsSync(distDir)) {
      throw new Error('Build failed - no dist directory created');
    }
    
    // Serve the built presentation statically
    const staticPath = `/slides/${buildId}`;
    
    // Make dist directory available as static files
    req.app.use(staticPath, express.static(distDir));
    
    // Return the URL to access the presentation
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${req.get('host')}` 
      : `http://localhost:${process.env.PORT || 3003}`;
    
    const slideUrl = `${baseUrl}${staticPath}`;
    
    res.json({
      success: true,
      url: slideUrl,
      buildId,
      message: 'Slidev presentation built successfully'
    });
    
  } catch (error) {
    console.error('Slidev build error:', error);
    
    // Clean up temp directory on error
    if (tempDir && fs.existsSync(tempDir)) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to build Slidev presentation',
      details: error.message 
    });
  }
});

// Clean up old builds (optional endpoint for maintenance)
router.delete('/cleanup', (req, res) => {
  try {
    const tempBaseDir = path.join(__dirname, '../temp');
    
    if (fs.existsSync(tempBaseDir)) {
      const dirs = fs.readdirSync(tempBaseDir);
      
      dirs.forEach(dir => {
        const dirPath = path.join(tempBaseDir, dir);
        const stats = fs.statSync(dirPath);
        
        // Remove directories older than 1 hour
        if (stats.isDirectory() && Date.now() - stats.mtime.getTime() > 3600000) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      });
    }
    
    res.json({ success: true, message: 'Cleanup completed' });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ 
      error: 'Failed to cleanup builds',
      details: error.message 
    });
  }
});

module.exports = router;
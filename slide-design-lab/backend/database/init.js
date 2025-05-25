const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    // Use environment variable for database path, fallback to local
    this.dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'slide_design_lab.db');
    
    // Ensure directory exists
    const dir = path.dirname(this.dbPath);
    if (!require('fs').existsSync(dir)) {
      require('fs').mkdirSync(dir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(this.dbPath);
    this.initializeTables();
  }

  initializeTables() {
    // Slide generation sessions
    this.db.run(`
      CREATE TABLE IF NOT EXISTS slide_sessions (
        id TEXT PRIMARY KEY,
        prompt TEXT NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_context TEXT
      )
    `);

    // Generated slide versions (3 per session)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS slide_versions (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        version_number INTEGER,
        slidev_markdown TEXT NOT NULL,
        ai_rationale TEXT,
        generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES slide_sessions (id)
      )
    `);

    // User ratings and feedback
    this.db.run(`
      CREATE TABLE IF NOT EXISTS slide_ratings (
        id TEXT PRIMARY KEY,
        version_id TEXT,
        session_id TEXT,
        
        -- Multi-dimensional ratings (1-5 scale)
        visual_hierarchy INTEGER,
        information_density INTEGER,
        readability INTEGER,
        visual_appeal INTEGER,
        layout_balance INTEGER,
        content_clarity INTEGER,
        
        -- Overall decision
        decision TEXT CHECK(decision IN ('keep', 'kill', 'revise')),
        
        -- Free-form feedback
        feedback_text TEXT,
        
        -- Additional metadata
        rating_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (version_id) REFERENCES slide_versions (id),
        FOREIGN KEY (session_id) REFERENCES slide_sessions (id)
      )
    `);

    // Design patterns learned (for main app integration)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS design_patterns (
        id TEXT PRIMARY KEY,
        pattern_name TEXT,
        pattern_description TEXT,
        success_rate REAL,
        avg_rating REAL,
        usage_count INTEGER DEFAULT 0,
        slidev_template TEXT,
        learned_from_sessions TEXT, -- JSON array of session IDs
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Training insights for export to main app
    this.db.run(`
      CREATE TABLE IF NOT EXISTS training_insights (
        id TEXT PRIMARY KEY,
        insight_type TEXT, -- 'layout_preference', 'content_density', 'visual_element'
        insight_data TEXT, -- JSON data
        confidence_score REAL,
        sample_size INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📊 Database initialized with training tables');
  }

  close() {
    this.db.close();
  }
}

module.exports = Database;
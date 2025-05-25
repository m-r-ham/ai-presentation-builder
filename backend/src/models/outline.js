class PresentationOutline {
  constructor() {
    this.metadata = {
      title: '',
      topics: [],
      goal: '',
      purpose: '',
      audience: '',
      deliveryMethod: '',
      duration: '',
      dateTime: '',
      context: ''
    };
    this.slides = [];
    this.status = 'draft';
    this.changelog = [];
    this.versions = [];
    this.currentVersion = 1;
    this.completionStatus = this.calculateCompletionStatus();
  }

  static PREDEFINED_GOALS = ['Inform', 'Persuade', 'Align', 'Educate', 'Decide', 'Update'];
  static PREDEFINED_DELIVERY_METHODS = ['Live', 'Async', 'Hybrid', 'Workshop'];

  calculateCompletionStatus() {
    // Core metadata fields (worth 70% of completion)
    const metadataFields = ['title', 'goal', 'purpose', 'audience', 'deliveryMethod', 'duration'];
    const completedMetadata = metadataFields.filter(field => 
      this.metadata[field] && this.metadata[field].trim() !== ''
    );
    
    // Slide outline (worth 30% of completion)
    const hasSlideOutline = this.slides.length >= 3; // Need at least 3 slides for a basic presentation
    
    // Calculate weighted completion
    const metadataWeight = 0.7;
    const slideWeight = 0.3;
    
    const metadataCompletion = (completedMetadata.length / metadataFields.length) * metadataWeight;
    const slideCompletion = hasSlideOutline ? slideWeight : 0;
    
    const totalCompletion = metadataCompletion + slideCompletion;
    const percentage = Math.round(totalCompletion * 100);
    
    return {
      completed: completedMetadata.length,
      total: metadataFields.length,
      percentage,
      metadataComplete: completedMetadata.length === metadataFields.length,
      hasSlideOutline,
      slideCount: this.slides.length,
      missing: metadataFields.filter(field => !this.metadata[field] || this.metadata[field].trim() === ''),
      status: percentage >= 90 ? 'ready' : percentage >= 70 ? 'nearly-ready' : 'in-progress'
    };
  }

  addSlide(slideData) {
    this.slides.push({
      id: this.slides.length + 1,
      title: slideData.title,
      type: slideData.type,
      description: slideData.description,
      keyPoints: slideData.keyPoints || [],
      notes: slideData.notes || ''
    });
    
    this.completionStatus = this.calculateCompletionStatus();
    this.createVersion('Added slide: ' + slideData.title);
  }

  updateMetadata(key, value) {
    const oldValue = this.metadata[key];
    this.metadata[key] = value;
    this.completionStatus = this.calculateCompletionStatus();
    
    if (oldValue !== value) {
      this.addToChangelog({
        action: 'update_metadata',
        data: { [key]: value },
        previousValue: oldValue
      });
    }
  }

  addTopic(topic) {
    if (!this.metadata.topics.includes(topic)) {
      this.metadata.topics.push(topic);
      this.completionStatus = this.calculateCompletionStatus();
    }
  }

  addToChangelog(update) {
    this.changelog.push({
      id: this.changelog.length + 1,
      timestamp: Date.now(),
      action: update.action,
      data: update.data,
      previousValue: update.previousValue || null
    });
  }

  createVersion(description) {
    this.versions.push({
      version: this.currentVersion,
      timestamp: Date.now(),
      description,
      snapshot: {
        metadata: { ...this.metadata },
        slides: [...this.slides],
        status: this.status
      }
    });
    this.currentVersion++;
  }

  revertToVersion(versionNumber) {
    const version = this.versions.find(v => v.version === versionNumber);
    if (version) {
      this.metadata = { ...version.snapshot.metadata };
      this.slides = [...version.snapshot.slides];
      this.status = version.snapshot.status;
      this.completionStatus = this.calculateCompletionStatus();
      
      this.addToChangelog({
        action: 'revert',
        data: { toVersion: versionNumber }
      });
    }
  }

  getCurrentState() {
    return `
Current Outline State:
- Title: ${this.metadata.title || 'Not set'}
- Topics: ${this.metadata.topics.join(', ') || 'Not set'}
- Goal: ${this.metadata.goal || 'Not set'}
- Purpose: ${this.metadata.purpose || 'Not set'}
- Audience: ${this.metadata.audience || 'Not set'}
- Delivery Method: ${this.metadata.deliveryMethod || 'Not set'}
- Duration: ${this.metadata.duration || 'Not set'}
- Date/Time: ${this.metadata.dateTime || 'Not set'}
- Slides: ${this.slides.length} (${this.completionStatus.hasSlideOutline ? 'Outline Complete' : 'Need at least 3 slides'})
- Overall Completion: ${this.completionStatus.percentage}% (${this.completionStatus.status})
`;
  }

  toJSON() {
    return {
      metadata: this.metadata,
      slides: this.slides,
      status: this.status,
      changelog: this.changelog,
      versions: this.versions,
      currentVersion: this.currentVersion,
      completionStatus: this.completionStatus,
      lastUpdated: Date.now()
    };
  }
}

module.exports = PresentationOutline;

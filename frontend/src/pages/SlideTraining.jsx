import { useState, useEffect } from 'react'
import { Star, Grid, List, ChevronLeft, ChevronRight, X, Heart, ThumbsUp, ThumbsDown } from 'lucide-react'

// Fetch real slides from API
const fetchRealSlides = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/slides/real-examples');
    const data = await response.json();
    return data.slides.map(slide => ({
      ...slide,
      rating: null,
      feedback: '',
      reviewed: false
    }));
  } catch (error) {
    console.error('Error fetching real slides:', error);
    // Fallback to some basic examples if API fails
    return [];
  }
}

function SlideTraining() {
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [slides, setSlides] = useState([])
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [reviewFeedback, setReviewFeedback] = useState('')
  const [reviewRating, setReviewRating] = useState(0)

  useEffect(() => {
    fetchRealSlides().then(realSlides => {
      setSlides(realSlides);
    });
  }, [])

  const unreviewed = slides.filter(slide => !slide.reviewed)
  const currentSlide = unreviewed[currentReviewIndex]

  const handleRating = async (slideId, rating, feedback) => {
    // Find the slide being rated
    const slide = slides.find(s => s.id === slideId);
    
    // Save training data to backend
    try {
      await fetch('http://localhost:3001/api/training/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slideData: slide,
          rating,
          feedback
        })
      });
      console.log('Training feedback saved successfully');
    } catch (error) {
      console.error('Error saving training feedback:', error);
    }
    
    // Update local state
    setSlides(prev => prev.map(s => 
      s.id === slideId 
        ? { ...s, rating, feedback, reviewed: true }
        : s
    ))
  }

  const handleSwipe = (direction, rating) => {
    if (!currentSlide || !reviewFeedback.trim()) return
    
    handleRating(currentSlide.id, rating, reviewFeedback)
    setReviewFeedback('')
    setReviewRating(0)
    
    if (currentReviewIndex < unreviewed.length - 1) {
      setCurrentReviewIndex(prev => prev + 1)
    }
  }

  const StarRating = ({ rating, onRatingChange, readonly = false }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            fill: star <= rating ? '#fbbf24' : 'none',
            stroke: star <= rating ? '#fbbf24' : '#d1d5db'
          }}
          onClick={() => !readonly && onRatingChange(star)}
        />
      ))}
    </div>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: '1px solid #e5e7eb', 
        backgroundColor: 'white',
        padding: '0 1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '1rem 0',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'all' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'all' ? '#3b82f6' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            All Slides ({slides.length})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            style={{
              padding: '1rem 0',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'review' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'review' ? '#3b82f6' : '#6b7280',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Review Queue ({unreviewed.length})
          </button>
        </div>
      </div>

      {/* All Slides Tab */}
      {activeTab === 'all' && (
        <div style={{ flex: 1, padding: '1.5rem' }}>
          {/* View Controls */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
              All Slides
            </h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: viewMode === 'grid' ? '#f3f4f6' : 'white',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  backgroundColor: viewMode === 'list' ? '#f3f4f6' : 'white',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Slides Display */}
          <div style={{ 
            height: 'calc(100vh - 200px)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
            {viewMode === 'grid' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1rem'
              }}>
                {slides.map(slide => (
                  <div key={slide.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: 'white'
                  }}>
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                        {slide.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
                        {slide.content}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <StarRating rating={slide.rating || 0} readonly />
                        <span style={{ 
                          fontSize: '0.75rem',
                          color: slide.reviewed ? '#10b981' : '#6b7280',
                          fontWeight: '500'
                        }}>
                          {slide.reviewed ? 'Reviewed' : 'Pending'}
                        </span>
                      </div>
                      {slide.feedback && (
                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: '#4b5563',
                          marginTop: '0.5rem',
                          fontStyle: 'italic'
                        }}>
                          "{slide.feedback}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {slides.map(slide => (
                  <div key={slide.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white'
                  }}>
                    <img 
                      src={slide.imageUrl} 
                      alt={slide.title}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                        {slide.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        {slide.content}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <StarRating rating={slide.rating || 0} readonly />
                      <span style={{ 
                        fontSize: '0.75rem',
                        color: slide.reviewed ? '#10b981' : '#6b7280',
                        fontWeight: '500',
                        minWidth: '60px'
                      }}>
                        {slide.reviewed ? 'Reviewed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Queue Tab */}
      {activeTab === 'review' && (
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '2rem',
          overflowY: 'auto'
        }}>
          {currentSlide ? (
            <div style={{
              maxWidth: '600px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2rem'
            }}>
              {/* Progress */}
              <div style={{ alignSelf: 'stretch', textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                  {currentReviewIndex + 1} of {unreviewed.length}
                </p>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentReviewIndex) / unreviewed.length) * 100}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Slide Card */}
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}>
                <img 
                  src={currentSlide.imageUrl} 
                  alt={currentSlide.title}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>
                    {currentSlide.title}
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0 }}>
                    {currentSlide.content}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Rate this slide:</p>
                <StarRating 
                  rating={reviewRating} 
                  onRatingChange={setReviewRating}
                />
              </div>

              {/* Feedback Input */}
              <div style={{ width: '100%' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}>
                  Why is this slide good or bad?
                </label>
                <textarea
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Explain what makes this slide effective or ineffective..."
                  style={{
                    width: '100%',
                    height: '100px',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button
                  onClick={() => handleSwipe('left', 1)}
                  disabled={!reviewFeedback.trim()}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: reviewFeedback.trim() ? '#ef4444' : '#f3f4f6',
                    color: reviewFeedback.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: reviewFeedback.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ThumbsDown size={20} />
                  Bad Slide
                </button>
                <button
                  onClick={() => handleSwipe('right', 5)}
                  disabled={!reviewFeedback.trim()}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: reviewFeedback.trim() ? '#10b981' : '#f3f4f6',
                    color: reviewFeedback.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: reviewFeedback.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <ThumbsUp size={20} />
                  Good Slide
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0 0 1rem 0' }}>
                🎉 All slides reviewed!
              </h2>
              <p style={{ color: '#6b7280' }}>
                You've completed reviewing all available slides.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SlideTraining
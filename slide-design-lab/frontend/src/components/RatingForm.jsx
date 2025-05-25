import { useState } from 'react'
import { Check, X, RotateCcw, ArrowLeft } from 'lucide-react'
import SlidePreview from './SlidePreview'

function RatingForm({ version, session, onSubmit, onCancel }) {
  const [ratings, setRatings] = useState({
    visual_hierarchy: 3,
    information_density: 3,
    readability: 3,
    visual_appeal: 3,
    layout_balance: 3,
    content_clarity: 3
  })
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const ratingDimensions = [
    {
      key: 'visual_hierarchy',
      label: 'Visual Hierarchy',
      description: 'Clear order and priority of information'
    },
    {
      key: 'information_density',
      label: 'Information Density',
      description: 'Appropriate amount of content (not too dense/sparse)'
    },
    {
      key: 'readability',
      label: 'Readability',
      description: 'Text is easy to read and understand'
    },
    {
      key: 'visual_appeal',
      label: 'Visual Appeal',
      description: 'Aesthetically pleasing and engaging design'
    },
    {
      key: 'layout_balance',
      label: 'Layout Balance',
      description: 'Well-distributed composition and white space'
    },
    {
      key: 'content_clarity',
      label: 'Content Clarity',
      description: 'Message is clear and easy to understand'
    }
  ]

  const handleRatingChange = (dimension, value) => {
    setRatings(prev => ({
      ...prev,
      [dimension]: parseInt(value)
    }))
  }

  const handleDecision = async (decision) => {
    setSubmitting(true)
    try {
      await onSubmit(decision, ratings, feedback)
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / 6

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onCancel}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            Rate Version {version.versionNumber}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>
            Provide feedback to improve AI slide generation
          </p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Slide Preview - Left */}
        <div style={{
          width: '50%',
          padding: '20px',
          borderRight: '1px solid #f1f5f9',
          overflow: 'auto'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            Slide Preview
          </h3>
          <SlidePreview markdown={version.slidevMarkdown} />
          
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
            <strong>AI Rationale:</strong> {version.aiRationale}
          </div>
        </div>

        {/* Rating Form - Right */}
        <div style={{
          width: '50%',
          padding: '20px',
          overflow: 'auto'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>
            Design Quality Ratings
          </h3>

          {/* Rating Dimensions */}
          <div style={{ marginBottom: '24px' }}>
            {ratingDimensions.map((dimension) => (
              <div key={dimension.key} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <label style={{ 
                    fontSize: '13px', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {dimension.label}
                  </label>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {ratings[dimension.key]}
                  </span>
                </div>
                
                <p style={{ 
                  fontSize: '11px', 
                  color: '#6b7280', 
                  marginBottom: '8px' 
                }}>
                  {dimension.description}
                </p>
                
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratings[dimension.key]}
                  onChange={(e) => handleRatingChange(dimension.key, e.target.value)}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: '#e2e8f0',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#9ca3af',
                  marginTop: '4px'
                }}>
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Rating Display */}
          <div style={{
            padding: '12px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              Average Rating
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
              {averageRating.toFixed(1)}/5.0
            </div>
          </div>

          {/* Free-form Feedback */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '13px', 
              fontWeight: '500',
              marginBottom: '6px',
              color: '#374151'
            }}>
              Additional Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What works well? What could be improved? Any specific suggestions?"
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '12px',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
          </div>

          {/* Decision Buttons */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '10px',
            marginTop: 'auto'
          }}>
            <button
              onClick={() => handleDecision('keep')}
              disabled={submitting}
              className="btn btn-success"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px'
              }}
            >
              <Check size={16} />
              Keep - Add to Pattern Library
            </button>

            <button
              onClick={() => handleDecision('revise')}
              disabled={submitting}
              className="btn btn-warning"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px'
              }}
            >
              <RotateCcw size={16} />
              Revise - Generate New Versions
            </button>

            <button
              onClick={() => handleDecision('kill')}
              disabled={submitting}
              className="btn btn-danger"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px'
              }}
            >
              <X size={16} />
              Kill - Discard This Approach
            </button>
          </div>

          {submitting && (
            <div style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              Saving your feedback...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RatingForm
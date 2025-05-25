import { useState } from 'react'
import { Check, X, RotateCcw, Star } from 'lucide-react'
import SlidePreview from './SlidePreview'
import RatingForm from './RatingForm'

function SlidePanel({ session, onRatingSubmit, isGenerating }) {
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [showRatingForm, setShowRatingForm] = useState(false)

  if (isGenerating) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            margin: '0 auto 16px' 
          }}></div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Generating 3 Slide Versions
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            AI is creating different design approaches...
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f1f5f9',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Star size={28} color="#6b7280" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Ready to Create Slides
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Enter a slide prompt in the chat panel to generate 3 versions for rating and feedback.
          </p>
        </div>
      </div>
    )
  }

  const handleVersionSelect = (version) => {
    setSelectedVersion(version)
    setShowRatingForm(true)
  }

  const handleRatingSubmit = (decision, ratings, feedback) => {
    const ratingData = {
      versionId: selectedVersion.id,
      sessionId: session.sessionId,
      ratings,
      decision,
      feedbackText: feedback
    }

    onRatingSubmit(ratingData)
    setSelectedVersion(null)
    setShowRatingForm(false)
  }

  return (
    <div style={{ height: '100%', backgroundColor: 'white' }}>
      {!showRatingForm ? (
        // 3-Version Display
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
              Rate These 3 Versions
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
              "{session.prompt}"
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {session.category}
              </span>
              <span style={{
                fontSize: '11px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {session.versions.length} versions
              </span>
            </div>
          </div>

          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            padding: '20px',
            overflow: 'auto'
          }}>
            {session.versions.map((version, index) => (
              <div
                key={version.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: 'white'
                }}
              >
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                    Version {version.versionNumber}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#6b7280' }}>
                    {version.aiRationale}
                  </p>
                </div>

                <div style={{ flex: 1, padding: '16px' }}>
                  <SlidePreview markdown={version.slidevMarkdown} />
                </div>

                <div style={{
                  padding: '12px',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handleVersionSelect(version)}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                  >
                    Rate This Version
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
              Click "Rate This Version" to provide detailed feedback on design quality
            </div>
          </div>
        </div>
      ) : (
        // Rating Form
        <RatingForm
          version={selectedVersion}
          session={session}
          onSubmit={handleRatingSubmit}
          onCancel={() => {
            setSelectedVersion(null)
            setShowRatingForm(false)
          }}
        />
      )}
    </div>
  )
}

export default SlidePanel
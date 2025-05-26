import { useState } from 'react'
import { ChevronLeft, ChevronRight, MessageCircle, Send, Sparkles, Star, RotateCcw, Check, X } from 'lucide-react'
import SlidePreview from './SlidePreview'
import RatingForm from './RatingForm'

function SlidePanel({ session, onRatingSubmit, isGenerating }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

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
            <Sparkles size={28} color="#6b7280" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Ready to Generate Slides
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '20px' }}>
            Describe the slide you want to create in the left panel. 
            AI will generate 3 versions that you can review and improve through chat feedback.
          </p>
        </div>
      </div>
    )
  }

  const currentSlide = session.versions[currentSlideIndex]

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev < session.versions.length - 1 ? prev + 1 : 0
    )
  }

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev > 0 ? prev - 1 : session.versions.length - 1
    )
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.trim()) return

    // Add user feedback to chat history
    const newChat = {
      type: 'user',
      message: feedback,
      timestamp: new Date().toISOString()
    }
    setChatHistory(prev => [...prev, newChat])
    setFeedback('')

    // Add typing indicator
    const typingIndicator = {
      type: 'ai',
      message: 'AI is analyzing your feedback...',
      timestamp: new Date().toISOString(),
      isTyping: true
    }
    setChatHistory(prev => [...prev, typingIndicator])

    try {
      // Send feedback to AI for analysis
      const response = await fetch('/api/generate/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedback: feedback.trim(),
          currentSlide: {
            markdown: currentSlide.slidevMarkdown,
            versionNumber: currentSlide.versionNumber
          },
          sessionId: session.sessionId
        })
      })

      const data = await response.json()
      
      // Remove typing indicator and add AI response
      setChatHistory(prev => {
        const withoutTyping = prev.filter(chat => !chat.isTyping)
        return [...withoutTyping, {
          type: 'ai',
          message: data.response || 'I understand your feedback. Would you like me to generate an improved version based on your suggestions?',
          timestamp: new Date().toISOString()
        }]
      })

    } catch (error) {
      console.error('Feedback error:', error)
      // Remove typing indicator and add error message
      setChatHistory(prev => {
        const withoutTyping = prev.filter(chat => !chat.isTyping)
        return [...withoutTyping, {
          type: 'ai',
          message: 'I understand your feedback. The system will incorporate these improvements in future generations.',
          timestamp: new Date().toISOString()
        }]
      })
    }
  }

  const handleSaveAsTemplate = async (slide) => {
    if (!slide) return

    try {
      const response = await fetch('/api/templates/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Template - ${session.prompt?.substring(0, 50) || 'Slide'}`,
          slidevMarkdown: slide.slidevMarkdown,
          category: session.category || 'general',
          description: `Template saved from: ${session.prompt}`
        })
      })

      if (response.ok) {
        alert('✅ Template saved successfully!')
      } else {
        throw new Error('Failed to save template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      alert('❌ Failed to save template. Please try again.')
    }
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      {/* Header with navigation */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {session.prompt}
          </h2>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Category: {session.category} • {session.versions.length} versions
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Carousel Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={prevSlide}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {currentSlideIndex + 1} / {session.versions.length}
            </span>
            
            <button
              onClick={nextSlide}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Rating Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setSelectedVersion(currentSlide)
                setShowRatingForm(true)
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Star size={12} />
              Rate
            </button>
            
            <button
              onClick={() => {
                // Quick Keep action
                onRatingSubmit({
                  versionId: currentSlide.id,
                  sessionId: session.sessionId,
                  decision: 'keep',
                  ratings: { overall: 5 }
                })
              }}
              style={{
                padding: '6px 8px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <Check size={12} />
            </button>
            
            <button
              onClick={() => {
                // Quick Revise action
                onRatingSubmit({
                  versionId: currentSlide.id,
                  sessionId: session.sessionId,
                  decision: 'revise',
                  ratings: { overall: 3 }
                })
              }}
              style={{
                padding: '6px 8px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} />
            </button>
            
            <button
              onClick={() => {
                // Quick Kill action
                onRatingSubmit({
                  versionId: currentSlide.id,
                  sessionId: session.sessionId,
                  decision: 'kill',
                  ratings: { overall: 1 }
                })
              }}
              style={{
                padding: '6px 8px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Preview - Takes available space */}
      <div style={{ 
        flex: 1,
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        minHeight: '300px'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          maxWidth: '800px',
          maxHeight: '500px',
          aspectRatio: '16/9',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          overflow: 'hidden'
        }}>
          <SlidePreview 
            slidevMarkdown={currentSlide.slidevMarkdown}
            versionNumber={currentSlide.versionNumber}
          />
        </div>
      </div>

      {/* Save as Template Button */}
      <div style={{
        padding: '15px 20px',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => handleSaveAsTemplate(currentSlide)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>💾</span>
          Save as Template
        </button>
      </div>

      {/* Chat Feedback Section - Higher up and scrollable */}
      <div style={{
        height: '280px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white'
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle size={16} color="#6b7280" />
            <h3 style={{ fontSize: '14px', fontWeight: '600' }}>
              Chat Feedback for Version {currentSlide.versionNumber}
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Provide specific feedback to improve this slide design
          </p>
        </div>

        {/* Chat Messages - Scrollable */}
        <div style={{
          flex: 1,
          padding: '12px 20px',
          overflowY: 'auto',
          backgroundColor: '#fafbfc'
        }}>
          {chatHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '13px',
              padding: '20px'
            }}>
              Start a conversation about this slide design...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatHistory.map((chat, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: chat.type === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      backgroundColor: chat.type === 'user' ? '#2563eb' : '#f1f5f9',
                      color: chat.type === 'user' ? 'white' : '#374151'
                    }}
                  >
                    {chat.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleFeedbackSubmit} style={{
          padding: '12px 20px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe what you'd like to improve about this slide..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '13px'
            }}
          />
          <button
            type="submit"
            disabled={!feedback.trim()}
            style={{
              padding: '8px 12px',
              backgroundColor: feedback.trim() ? '#2563eb' : '#e5e7eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: feedback.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && selectedVersion && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <RatingForm
              version={selectedVersion}
              session={session}
              onSubmit={(data) => {
                onRatingSubmit(data)
                setShowRatingForm(false)
                setSelectedVersion(null)
              }}
              onCancel={() => {
                setShowRatingForm(false)
                setSelectedVersion(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SlidePanel
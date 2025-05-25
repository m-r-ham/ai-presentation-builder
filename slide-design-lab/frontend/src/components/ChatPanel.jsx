import { useState, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

function ChatPanel({ onGenerateSlides, isGenerating, currentSession }) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('general')
  const [categories, setCategories] = useState({})
  const [recentSessions, setRecentSessions] = useState([])

  useEffect(() => {
    fetchCategories()
    fetchRecentSessions()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/generate/categories')
      const data = await response.json()
      setCategories(data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/training/recent-sessions?limit=5')
      const data = await response.json()
      setRecentSessions(data.recentSessions)
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerateSlides(prompt.trim(), category)
      setPrompt('')
    }
  }

  const examplePrompts = [
    "Create a slide showing Q4 revenue growth with key metrics",
    "Design a timeline slide for our product roadmap",
    "Make a comparison slide between two software solutions",
    "Create a title slide for a marketing strategy presentation",
    "Design a slide with key takeaways from user research"
  ]

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          Slide Generator
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280' }}>
          Describe the slide you want to create. AI will generate 3 versions for you to rate.
        </p>
      </div>

      {/* Generation Form */}
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              marginBottom: '6px',
              color: '#374151'
            }}>
              Slide Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: 'white'
              }}
            >
              <option value="general">General</option>
              {Object.entries(categories).map(([key, description]) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '13px', 
              fontWeight: '500', 
              marginBottom: '6px',
              color: '#374151'
            }}>
              Slide Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the slide you want to create..."
              rows="3"
              className="chat-input"
              style={{
                width: '100%',
                resize: 'vertical',
                minHeight: '70px'
              }}
              disabled={isGenerating}
            />
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px'
            }}
          >
            {isGenerating ? (
              <>
                <div className="spinner"></div>
                Generating 3 versions...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate 3 Slide Versions
              </>
            )}
          </button>
        </form>
      </div>

      {/* Current Session Info */}
      {currentSession && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
            Current Session
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            {currentSession.prompt}
          </p>
          <span style={{
            fontSize: '11px',
            backgroundColor: '#dbeafe',
            color: '#2563eb',
            padding: '2px 6px',
            borderRadius: '4px'
          }}>
            {currentSession.category}
          </span>
        </div>
      )}

      {/* Example Prompts */}
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          Example Prompts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isGenerating}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4b5563',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isGenerating) {
                  e.target.style.backgroundColor = '#f1f5f9'
                  e.target.style.borderColor = '#d1d5db'
                }
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.borderColor = '#e2e8f0'
              }}
            >
              {example}
            </button>
          ))}
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
              Recent Sessions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    padding: '8px 10px',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                    {session.prompt.length > 40 
                      ? session.prompt.substring(0, 40) + '...' 
                      : session.prompt
                    }
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    {session.ratingCount} ratings • {session.avgRating ? 
                      `${session.avgRating.toFixed(1)}/5` : 'No ratings'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPanel
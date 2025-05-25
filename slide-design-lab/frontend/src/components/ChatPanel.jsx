import { useState, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

function ChatPanel({ onGenerateSlides, isGenerating, currentSession }) {
  const [prompt, setPrompt] = useState('')
  // Removed category selection - AI will classify automatically
  const [recentSessions, setRecentSessions] = useState([])
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey)

  useEffect(() => {
    fetchRecentSessions()
  }, [])

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
    if (prompt.trim() && !isGenerating && apiKey.trim()) {
      onGenerateSlides(prompt.trim(), apiKey.trim())
      setPrompt('')
    }
  }

  const handleApiKeySubmit = (key) => {
    localStorage.setItem('openai_api_key', key)
    setApiKey(key)
    setShowApiKeyInput(false)
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

      {/* API Key Input */}
      {showApiKeyInput && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fef3c7', 
          borderBottom: '1px solid #f59e0b',
          border: '1px solid #f59e0b'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#92400e' }}>
            OpenAI API Key Required
          </h3>
          <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '12px' }}>
            Please enter your OpenAI API key to generate slides. Your key is stored locally in your browser only and is never saved on our servers - it's only used for your current session requests.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              placeholder="sk-..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #f59e0b',
                borderRadius: '6px',
                fontSize: '13px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleApiKeySubmit(e.target.value.trim())
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling
                if (input.value.trim()) {
                  handleApiKeySubmit(input.value.trim())
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#92400e', marginTop: '8px' }}>
            Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" style={{ color: '#92400e', textDecoration: 'underline' }}>OpenAI Platform</a>
          </p>
        </div>
      )}

      {/* Generation Form */}
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
        <form onSubmit={handleSubmit}>
          {/* Category selection removed - AI will classify automatically */}

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
            disabled={!prompt.trim() || isGenerating || !apiKey.trim()}
            className="btn btn-primary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              opacity: (!prompt.trim() || !apiKey.trim()) ? 0.5 : 1
            }}
          >
            {isGenerating ? (
              <>
                <div className="spinner"></div>
                Generating 3 versions...
              </>
            ) : !apiKey.trim() ? (
              <>
                <Sparkles size={16} />
                API Key Required
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate 3 Slide Versions
              </>
            )}
          </button>

          {apiKey && !showApiKeyInput && (
            <div style={{ 
              marginTop: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#6b7280'
            }}>
              <span>✓ API key configured (stored locally only)</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowApiKeyInput(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Change
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('openai_api_key')
                    setApiKey('')
                    setShowApiKeyInput(true)
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#dc2626',
                    fontSize: '11px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
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
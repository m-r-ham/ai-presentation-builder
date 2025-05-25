import { useState, useEffect } from 'react'
import ChatPanel from './components/ChatPanel'
import SlidePanel from './components/SlidePanel'
import Header from './components/Header'

function App() {
  const [currentSession, setCurrentSession] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [stats, setStats] = useState(null)

  // Load stats on startup
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/training/stats')
      const data = await response.json()
      setStats(data.trainingProgress)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleSlideGeneration = async (prompt, category, apiKey) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate/slide-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, apiKey })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCurrentSession(data)
      } else {
        console.error('Generation failed:', data.error)
        // Handle API key errors by clearing stored key
        if (response.status === 401 || data.error.includes('API key')) {
          localStorage.removeItem('openai_api_key')
          alert('Invalid API key. Please enter a valid OpenAI API key.')
        } else {
          alert(`Generation failed: ${data.error}`)
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRatingSubmit = async (ratingData) => {
    try {
      const response = await fetch('/api/training/rate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ratingData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh stats after rating
        fetchStats()
        
        // If revise was selected, generate new versions
        if (data.decision === 'revise' && currentSession) {
          const apiKey = localStorage.getItem('openai_api_key')
          if (apiKey) {
            await handleSlideGeneration(currentSession.prompt, currentSession.category, apiKey)
          }
        }
        
        // If keep or kill, ready for new prompt
        if (data.decision === 'keep' || data.decision === 'kill') {
          setCurrentSession(null)
        }
      }
    } catch (error) {
      console.error('Rating submission error:', error)
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header stats={stats} />
      
      <div style={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Chat Panel - Left Side */}
        <div style={{ 
          width: '400px',
          borderRight: '1px solid #e2e8f0',
          flexShrink: 0
        }}>
          <ChatPanel 
            onGenerateSlides={handleSlideGeneration}
            isGenerating={isGenerating}
            currentSession={currentSession}
          />
        </div>

        {/* Slide Panel - Right Side */}
        <div style={{ flex: 1 }}>
          <SlidePanel 
            session={currentSession}
            onRatingSubmit={handleRatingSubmit}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  )
}

export default App
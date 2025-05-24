import { useState } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import OutlinePanel from './OutlinePanel'

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: "Hi! I'm here to help you create a presentation. What type of presentation are we building today?",
      timestamp: Date.now()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [outline, setOutline] = useState(null)
  const [sessionId] = useState('session_' + Date.now())
  const [showOutline, setShowOutline] = useState(false)

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user', 
      content,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content, 
          messages,
          sessionId 
        })
      })
      
      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
      
      // Update outline and show it IMMEDIATELY when ANY data exists
      if (data.outline) {
        setOutline(data.outline)
        // Show outline as soon as we have ANY metadata or completion > 0
        if (data.outline.completionStatus.percentage > 0 || 
            data.outline.metadata.title || 
            data.outline.metadata.goal || 
            data.outline.metadata.purpose ||
            data.outline.slides.length > 0) {
          setShowOutline(true)
        }
      }
      
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOutlineUpdate = async (field, value) => {
    try {
      const response = await fetch('http://localhost:3001/api/outline/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          field,
          value
        })
      })
      
      const data = await response.json()
      if (data.outline) {
        setOutline(data.outline)
      }
    } catch (error) {
      console.error('Error updating outline:', error)
    }
  }

  const hasOutlineContent = outline && (
    outline.slides.length > 0 || 
    outline.completionStatus.percentage > 0 ||
    outline.metadata.title ||
    outline.metadata.goal ||
    outline.metadata.purpose
  )

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Chat Panel - Left Side */}
      <div style={{ 
        width: '400px',
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRight: '1px solid #e0e0e0'
      }}>
        {/* Chat Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>AI Presentation Coach</h2>
        </div>

        {/* Messages Area */}
        <div style={{ 
          flex: 1, 
          padding: '1rem', 
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start',
              marginBottom: '1rem' 
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '0.75rem 1rem',
                borderRadius: '1rem',
                backgroundColor: '#f1f1f1',
                color: '#666',
                borderBottomLeftRadius: '0.25rem'
              }}>
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {/* Right Panel - Split between Outline and Presentation */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa'
      }}>
        {/* Toggle Controls */}
        <div style={{ 
          padding: '0.75rem 1.5rem', 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            {hasOutlineContent ? outline.metadata.title || 'Presentation' : 'Presentation Builder'}
          </h1>
          {hasOutlineContent && (
            <button
              onClick={() => setShowOutline(!showOutline)}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: showOutline ? '#3b82f6' : '#f3f4f6',
                color: showOutline ? 'white' : '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showOutline ? 'Hide Outline' : 'Show Outline'}
            </button>
          )}
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1,
          display: 'flex'
        }}>
          {/* Outline Panel (Auto-show when content exists) */}
          {hasOutlineContent && showOutline && (
            <div style={{ 
              width: '350px',
              borderRight: '1px solid #e0e0e0',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <OutlinePanel outline={outline} onUpdateOutline={handleOutlineUpdate} />
            </div>
          )}

          {/* Presentation Canvas */}
          <div style={{ 
            flex: 1,
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: hasOutlineContent && showOutline ? '600px' : '800px',
              aspectRatio: '16/9',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              color: '#666'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                  {hasOutlineContent ? 'Slides coming soon...' : 'No slides yet'}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  {hasOutlineContent ? 'Continue the conversation to generate slides' : 'Start a conversation to begin building your presentation'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface

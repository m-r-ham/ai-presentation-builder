import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MessageBubble from '../components/chat/MessageBubble'
import ChatInput from '../components/chat/ChatInput'
import OutlinePanel from '../components/chat/OutlinePanel'

function PresentationBuilder() {
  const { id } = useParams()
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
  const [sessionId] = useState(id === 'new' ? 'session_' + Date.now() : id)
  const [showOutline, setShowOutline] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  const [draftMessage, setDraftMessage] = useState('')

  const sendMessage = async (content) => {
    const userMessage = {
      id: Date.now(),
      role: 'user', 
      content,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setDraftMessage('') // Clear draft when sending

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
        // Much more aggressive outline showing
        const hasAnyData = data.outline.completionStatus.percentage > 0 || 
                          data.outline.metadata.title || 
                          data.outline.metadata.goal || 
                          data.outline.metadata.purpose ||
                          data.outline.metadata.audience ||
                          data.outline.slides.length > 0
        
        if (hasAnyData) {
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

  // Save draft message to localStorage for persistence
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft-${sessionId}`)
    if (savedDraft) {
      setDraftMessage(savedDraft)
    }
  }, [sessionId])

  const handleDraftChange = (value) => {
    setDraftMessage(value)
    localStorage.setItem(`draft-${sessionId}`, value)
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
        // Show outline when manually updated
        setShowOutline(true)
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
    outline.metadata.purpose ||
    outline.metadata.audience
  )

  const bottomTabs = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'templates', label: 'Templates', icon: '📑' },
    { id: 'pastSlides', label: 'Past Slides', icon: '📋' },
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'visualizations', label: 'Charts', icon: '📊' },
    { id: 'assets', label: 'Assets', icon: '🖼️' }
  ]

  return (
    <div style={{ 
      width: '100%',
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* Main Content Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Chat Panel - Left Side */}
        <div style={{ 
          width: '400px',
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'white',
          borderRight: '1px solid #e0e0e0',
          flexShrink: 0
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
            {activeTab === 'chat' && (
              <>
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
              </>
            )}
            
            {activeTab !== 'chat' && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {bottomTabs.find(tab => tab.id === activeTab)?.icon}
                </div>
                <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                  {bottomTabs.find(tab => tab.id === activeTab)?.label}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  Coming soon...
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Only show for chat */}
          {activeTab === 'chat' && (
            <ChatInput 
              onSend={sendMessage} 
              disabled={isLoading} 
              draftValue={draftMessage}
              onDraftChange={handleDraftChange}
            />
          )}
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
                flexDirection: 'column',
                flexShrink: 0
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

      {/* Bottom Navigation Tabs */}
      <div style={{
        height: '60px',
        backgroundColor: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 1rem',
        gap: '0.5rem',
        flexShrink: 0
      }}>
        {bottomTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              border: '1px solid',
              borderColor: activeTab === tab.id ? '#3b82f6' : '#e5e7eb',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PresentationBuilder

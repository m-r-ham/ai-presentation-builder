import { useState, useRef, useEffect } from 'react'

function ChatInput({ onSend, disabled, draftValue = '', onDraftChange }) {
  const [input, setInput] = useState(draftValue)
  const textareaRef = useRef(null)

  // Update input when draftValue changes (e.g., when switching presentations)
  useEffect(() => {
    setInput(draftValue)
  }, [draftValue])

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [input])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
      if (onDraftChange) {
        onDraftChange('') // Clear draft when sending
      }
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    if (onDraftChange) {
      onDraftChange(value) // Save draft as user types
    }
  }

  return (
    <div style={{ 
      padding: '1rem', 
      borderTop: '1px solid #e0e0e0',
      backgroundColor: 'white'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            resize: 'none',
            fontFamily: 'inherit',
            minHeight: '20px',
            maxHeight: '120px',
            overflowY: 'auto',
            lineHeight: '1.4'
          }}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            fontSize: '0.875rem',
            fontWeight: '500',
            height: 'fit-content'
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatInput

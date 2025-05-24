function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        backgroundColor: isUser ? '#007bff' : '#f1f1f1',
        color: isUser ? 'white' : '#333',
        borderBottomRightRadius: isUser ? '0.25rem' : '1rem',
        borderBottomLeftRadius: isUser ? '1rem' : '0.25rem',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.4'
      }}>
        {message.content}
      </div>
    </div>
  )
}

export default MessageBubble

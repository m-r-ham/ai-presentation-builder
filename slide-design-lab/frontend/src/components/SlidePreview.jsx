import { useState, useEffect } from 'react'

function SlidePreview({ slidevMarkdown, versionNumber }) {
  const [slideUrl, setSlideUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (slidevMarkdown) {
      buildSlidev(slidevMarkdown)
    }
  }, [slidevMarkdown])

  const buildSlidev = async (markdown) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Send markdown to backend to build Slidev presentation
      const response = await fetch('/api/slidev/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          markdown,
          versionId: `version-${versionNumber}-${Date.now()}`
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to build Slidev: ${response.status}`)
      }

      const result = await response.json()
      setSlideUrl(result.url)
      
    } catch (err) {
      console.error('Error building Slidev:', err)
      setError('Failed to render slide')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🎨</div>
          <div>Building slide...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  if (!slideUrl) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
          <div>No slide to display</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
    }}>
      <iframe
        src={slideUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px'
        }}
        title={`Slide Version ${versionNumber}`}
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  )
}

export default SlidePreview
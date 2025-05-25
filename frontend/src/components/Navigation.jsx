import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentPresentation, setCurrentPresentation] = useState(null)

  // Extract presentation info from URL or state
  useEffect(() => {
    if (location.pathname.startsWith('/presentation')) {
      // In a real app, this would fetch presentation data
      setCurrentPresentation({
        id: location.pathname.split('/')[2] || 'new',
        title: 'A/B Test Results and Next Steps' // Mock data for now
      })
    } else {
      setCurrentPresentation(null)
    }
  }, [location])

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div style={{
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Left: Logo + Main Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          Slidez
        </div>
        
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isActive('/') ? '#f3f4f6' : 'transparent',
              color: isActive('/') ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          
          <button
            onClick={() => navigate('/slide-training')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isActive('/slide-training') ? '#f3f4f6' : 'transparent',
              color: isActive('/slide-training') ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Slide Training
          </button>
          
          <button
            onClick={() => navigate('/settings')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: isActive('/settings') ? '#f3f4f6' : 'transparent',
              color: isActive('/settings') ? '#1f2937' : '#6b7280',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Center: Current Presentation (if in builder) */}
      {currentPresentation && (
        <div style={{ 
          flex: 1,
          textAlign: 'center',
          maxWidth: '400px',
          margin: '0 2rem'
        }}>
          <div style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#1f2937',
            truncate: true
          }}>
            {currentPresentation.title}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {currentPresentation.id === 'new' ? 'New Presentation' : `ID: ${currentPresentation.id}`}
          </div>
        </div>
      )}

      {/* Right: User Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {!location.pathname.startsWith('/presentation') && (
          <button
            onClick={() => navigate('/presentation/new')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + New Presentation
          </button>
        )}
        
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#f3f4f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#6b7280',
          cursor: 'pointer'
        }}>
          M
        </div>
      </div>
    </div>
  )
}

export default Navigation

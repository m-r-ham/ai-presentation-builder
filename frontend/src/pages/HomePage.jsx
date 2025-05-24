import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [presentations, setPresentations] = useState([])
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    setPresentations([
      {
        id: '1',
        title: 'A/B Test Results and Next Steps',
        lastModified: '2 hours ago',
        status: 'draft',
        completionPercentage: 67,
        slideCount: 0,
        thumbnail: '📊'
      },
      {
        id: '2', 
        title: 'Q2 Strategy Review',
        lastModified: '1 day ago',
        status: 'complete',
        completionPercentage: 100,
        slideCount: 12,
        thumbnail: '📈'
      },
      {
        id: '3',
        title: 'Client Onboarding Process',
        lastModified: '3 days ago', 
        status: 'draft',
        completionPercentage: 45,
        slideCount: 6,
        thumbnail: '🤝'
      }
    ])
  }, [])

  const PresentationCard = ({ presentation }) => (
    <div
      onClick={() => navigate(`/presentation/${presentation.id}`)}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: 'fit-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{
          fontSize: '2rem',
          width: '60px',
          height: '60px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {presentation.thumbnail}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            {presentation.title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {presentation.lastModified}
            </span>
            <span style={{
              fontSize: '0.75rem',
              padding: '0.125rem 0.5rem',
              backgroundColor: presentation.status === 'complete' ? '#d1fae5' : '#fef3c7',
              color: presentation.status === 'complete' ? '#065f46' : '#92400e',
              borderRadius: '12px'
            }}>
              {presentation.status}
            </span>
            {presentation.slideCount > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {presentation.slideCount} slides
              </span>
            )}
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${presentation.completionPercentage}%`,
                height: '100%',
                backgroundColor: presentation.completionPercentage >= 70 ? '#10b981' : '#f59e0b',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              {presentation.completionPercentage}% complete
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PresentationListItem = ({ presentation }) => (
    <div
      onClick={() => navigate(`/presentation/${presentation.id}`)}
      style={{
        backgroundColor: 'white',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #e5e7eb',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
    >
      <div style={{ fontSize: '1.5rem' }}>{presentation.thumbnail}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
          {presentation.title}
        </h3>
      </div>
      <div style={{ fontSize: '0.875rem', color: '#6b7280', width: '120px' }}>
        {presentation.lastModified}
      </div>
      <div style={{
        fontSize: '0.75rem',
        padding: '0.125rem 0.5rem',
        backgroundColor: presentation.status === 'complete' ? '#d1fae5' : '#fef3c7',
        color: presentation.status === 'complete' ? '#065f46' : '#92400e',
        borderRadius: '12px',
        width: '80px',
        textAlign: 'center'
      }}>
        {presentation.status}
      </div>
      <div style={{ fontSize: '0.75rem', color: '#6b7280', width: '80px', textAlign: 'right' }}>
        {presentation.completionPercentage}%
      </div>
    </div>
  )

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      overflow: 'auto',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1400px', 
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
              My Presentations
            </h1>
            <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
              {presentations.length} presentations
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* View Toggle */}
            <div style={{
              display: 'flex',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '2px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: viewMode === 'list' ? '#3b82f6' : 'transparent',
                  color: viewMode === 'list' ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                List
              </button>
            </div>

            <button
              onClick={() => navigate('/presentation/new')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1rem' }}>+</span>
              New Presentation
            </button>
          </div>
        </div>

        {/* Presentations */}
        {presentations.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              No presentations yet
            </h3>
            <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' }}>
              Create your first AI-powered presentation to get started
            </p>
            <button
              onClick={() => navigate('/presentation/new')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Create Presentation
            </button>
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' ? 'grid' : 'block',
            gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(400px, 1fr))' : undefined,
            gap: viewMode === 'grid' ? '1.5rem' : '0',
            border: viewMode === 'list' ? '1px solid #e5e7eb' : 'none',
            borderRadius: viewMode === 'list' ? '8px' : '0',
            overflow: 'hidden'
          }}>
            {presentations.map((presentation) => (
              viewMode === 'grid' 
                ? <PresentationCard key={presentation.id} presentation={presentation} />
                : <PresentationListItem key={presentation.id} presentation={presentation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage

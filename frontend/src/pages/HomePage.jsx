import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()
  const [presentations, setPresentations] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  useEffect(() => {
    // Load presentations from localStorage
    const savedPresentations = localStorage.getItem('presentations')
    if (savedPresentations) {
      setPresentations(JSON.parse(savedPresentations))
    }
  }, [])

  const savePresentations = (newPresentations) => {
    localStorage.setItem('presentations', JSON.stringify(newPresentations))
    setPresentations(newPresentations)
  }

  const createNewPresentation = () => {
    const newId = 'pres_' + Date.now()
    const newPresentation = {
      id: newId,
      title: 'New Presentation',
      lastModified: 'Just now',
      status: 'draft',
      completionPercentage: 0,
      slideCount: 0,
      thumbnail: '📄',
      created: Date.now(),
      archived: false
    }
    
    const updatedPresentations = [newPresentation, ...presentations]
    savePresentations(updatedPresentations)
    navigate(`/presentation/${newId}`)
  }

  const handleDeleteClick = (e, presentation) => {
    e.stopPropagation()
    setDeleteModal(presentation)
    setDeleteConfirmText('')
  }

  const handleArchive = () => {
    const updatedPresentations = presentations.map(p => 
      p.id === deleteModal.id ? { ...p, archived: true, lastModified: 'Archived' } : p
    )
    savePresentations(updatedPresentations)
    setDeleteModal(null)
  }

  const handleDelete = () => {
    if (deleteConfirmText === 'delete') {
      const updatedPresentations = presentations.filter(p => p.id !== deleteModal.id)
      savePresentations(updatedPresentations)
      setDeleteModal(null)
      setDeleteConfirmText('')
    }
  }

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
        height: 'fit-content',
        position: 'relative'
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
        
        {/* Delete Button */}
        <button
          onClick={(e) => handleDeleteClick(e, presentation)}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2rem',
            height: '2rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fee2e2'
            e.currentTarget.style.color = '#dc2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
            e.currentTarget.style.color = '#6b7280'
          }}
        >
          ×
        </button>
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
      <button
        onClick={(e) => handleDeleteClick(e, presentation)}
        style={{
          width: '2rem',
          height: '2rem',
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
          marginLeft: '1rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fee2e2'
          e.currentTarget.style.color = '#dc2626'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6'
          e.currentTarget.style.color = '#6b7280'
        }}
      >
        ×
      </button>
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
              {presentations.filter(p => !p.archived).length} presentations
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
              onClick={createNewPresentation}
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
        {presentations.filter(p => !p.archived).length === 0 ? (
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
              onClick={createNewPresentation}
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
            {presentations.filter(p => !p.archived).map((presentation) => (
              viewMode === 'grid' 
                ? <PresentationCard key={presentation.id} presentation={presentation} />
                : <PresentationListItem key={presentation.id} presentation={presentation} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600' }}>
              Delete "{deleteModal.title}"?
            </h3>
            
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', lineHeight: '1.5' }}>
              We recommend archiving instead of deleting. Archived presentations can be restored later.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={handleArchive}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Archive (Recommended)
              </button>
              
              <button
                onClick={() => setDeleteModal(null)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                To permanently delete, type "delete" below:
              </p>
              
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type 'delete' to confirm"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  boxSizing: 'border-box'
                }}
              />
              
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText !== 'delete'}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: deleteConfirmText === 'delete' ? '#dc2626' : '#f3f4f6',
                  color: deleteConfirmText === 'delete' ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: deleteConfirmText === 'delete' ? 'pointer' : 'not-allowed'
                }}
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage

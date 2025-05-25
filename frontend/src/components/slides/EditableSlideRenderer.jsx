import { useState, useRef, useCallback } from 'react'
import ComponentEditor from './ComponentEditor'

function EditableSlideRenderer({ outline, brandColors, onSlideUpdate }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [draggedComponent, setDraggedComponent] = useState(null)
  const slideRef = useRef(null)
  
  const { primaryColor = '#3b82f6', secondaryColor = '#6b7280', accentColor = '#10b981' } = brandColors || {};
  
  if (!outline || !outline.slides || outline.slides.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
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
            No slides yet
          </div>
          <div style={{ fontSize: '0.875rem' }}>
            Continue the conversation to generate slides
          </div>
        </div>
      </div>
    )
  }

  const currentSlide = outline.slides[currentSlideIndex]
  const totalSlides = outline.slides.length

  const componentTypes = [
    { type: 'text', icon: '📝', name: 'Text Block' },
    { type: 'title', icon: '📄', name: 'Title' },
    { type: 'image', icon: '🖼️', name: 'Image' },
    { type: 'chart', icon: '📊', name: 'Chart' },
    { type: 'list', icon: '📋', name: 'Bullet List' }
  ]

  const handleDragStart = (e, componentType) => {
    setDraggedComponent(componentType)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!draggedComponent) return

    const rect = slideRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newComponent = {
      id: Date.now(),
      type: draggedComponent.type,
      x: Math.max(0, Math.min(90, x)),
      y: Math.max(0, Math.min(90, y)),
      width: 40,
      height: 20,
      content: draggedComponent.type === 'text' ? 'New text block' : 
               draggedComponent.type === 'title' ? 'New title' :
               draggedComponent.type === 'list' ? ['Item 1', 'Item 2', 'Item 3'] :
               draggedComponent.type === 'image' ? { src: '', alt: 'Image placeholder' } :
               draggedComponent.type === 'chart' ? { type: 'bar', data: [] } : ''
    }

    // Add component to current slide
    const updatedSlide = {
      ...currentSlide,
      components: [...(currentSlide.components || []), newComponent]
    }

    if (onSlideUpdate) {
      onSlideUpdate(currentSlideIndex, updatedSlide)
    }

    setDraggedComponent(null)
    setSelectedComponent(newComponent.id)
  }

  const handleComponentUpdate = (updatedComponent) => {
    const updatedSlide = {
      ...currentSlide,
      components: (currentSlide.components || []).map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    }

    if (onSlideUpdate) {
      onSlideUpdate(currentSlideIndex, updatedSlide)
    }
  }

  const handleComponentDelete = (componentId) => {
    const updatedSlide = {
      ...currentSlide,
      components: (currentSlide.components || []).filter(comp => comp.id !== componentId)
    }

    if (onSlideUpdate) {
      onSlideUpdate(currentSlideIndex, updatedSlide)
    }
    
    setSelectedComponent(null)
  }

  const renderComponent = (component, index) => {
    const isSelected = selectedComponent === component.id
    
    return (
      <div
        key={component.id}
        onClick={() => setSelectedComponent(component.id)}
        style={{
          position: 'absolute',
          left: `${component.x}%`,
          top: `${component.y}%`,
          width: `${component.width}%`,
          height: `${component.height}%`,
          border: isSelected ? `2px solid ${primaryColor}` : '1px solid transparent',
          borderRadius: '4px',
          cursor: editMode ? 'move' : 'default',
          backgroundColor: component.type === 'image' ? '#f3f4f6' : 'transparent'
        }}
      >
        {component.type === 'text' && (
          <div style={{
            fontSize: '1rem',
            color: '#374151',
            padding: '0.5rem',
            lineHeight: '1.4',
            height: '100%',
            overflow: 'hidden'
          }}>
            {component.content}
          </div>
        )}
        
        {component.type === 'title' && (
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: primaryColor,
            margin: 0,
            padding: '0.5rem',
            lineHeight: '1.2'
          }}>
            {component.content}
          </h2>
        )}
        
        {component.type === 'list' && (
          <div style={{ padding: '0.5rem' }}>
            {(component.content || []).map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.9rem'
              }}>
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  backgroundColor: accentColor,
                  borderRadius: '50%'
                }} />
                {item}
              </div>
            ))}
          </div>
        )}
        
        {component.type === 'image' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#9ca3af'
          }}>
            🖼️
          </div>
        )}
        
        {component.type === 'chart' && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#9ca3af'
          }}>
            📊
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: editMode ? primaryColor : '#f3f4f6',
              color: editMode ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            {editMode ? 'Exit Edit' : 'Edit Mode'}
          </button>

          {editMode && (
            <>
              <button
                onClick={() => {
                  // Save current slide as template
                  const saveData = {
                    ...currentSlide,
                    thumbnail: '📄'
                  }
                  // Trigger save modal - this would be handled by a parent component
                  if (window.saveSlideTemplate) {
                    window.saveSlideTemplate(saveData)
                  }
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Save Template
              </button>

              {selectedComponent && (
                <button
                  onClick={() => {
                    const component = (currentSlide.components || []).find(c => c.id === selectedComponent)
                    if (component && window.saveComponent) {
                      window.saveComponent(component)
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Save Component
                </button>
              )}
            </>
          )}
          
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Slide {currentSlideIndex + 1} of {totalSlides}
          </span>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
            disabled={currentSlideIndex === 0}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentSlideIndex === 0 ? 0.5 : 1
            }}
          >
            ←
          </button>
          <button
            onClick={() => setCurrentSlideIndex(Math.min(totalSlides - 1, currentSlideIndex + 1))}
            disabled={currentSlideIndex === totalSlides - 1}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: currentSlideIndex === totalSlides - 1 ? 'not-allowed' : 'pointer',
              opacity: currentSlideIndex === totalSlides - 1 ? 0.5 : 1
            }}
          >
            →
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Component Palette */}
        {editMode && (
          <div style={{
            width: '200px',
            backgroundColor: '#f9fafb',
            borderRight: '1px solid #e5e7eb',
            padding: '1rem',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
              Components
            </h3>
            {componentTypes.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => handleDragStart(e, comp)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'grab',
                  fontSize: '0.875rem'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{comp.icon}</span>
                {comp.name}
              </div>
            ))}
          </div>
        )}

        {/* Slide Canvas */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            ref={slideRef}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: '16/9',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Default slide content */}
            {!editMode && (
              <>
                {/* Header */}
                <div style={{
                  borderBottom: `3px solid ${primaryColor}`,
                  paddingBottom: '1rem',
                  marginBottom: '2rem',
                  padding: '2rem 2rem 1rem 2rem'
                }}>
                  <h2 style={{
                    fontSize: currentSlideIndex === 0 ? '2.5rem' : '2rem',
                    fontWeight: '600',
                    color: primaryColor,
                    margin: 0,
                    textAlign: currentSlideIndex === 0 ? 'center' : 'left'
                  }}>
                    {currentSlide.title}
                  </h2>
                  {currentSlide.description && (
                    <p style={{
                      fontSize: '1rem',
                      color: secondaryColor,
                      marginTop: '0.5rem',
                      margin: '0.5rem 0 0 0',
                      textAlign: currentSlideIndex === 0 ? 'center' : 'left'
                    }}>
                      {currentSlide.description}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '0 2rem 2rem 2rem', flex: 1 }}>
                  {currentSlide.keyPoints && currentSlide.keyPoints.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {currentSlide.keyPoints.map((point, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem'
                        }}>
                          <div style={{
                            width: '2rem',
                            height: '2rem',
                            backgroundColor: accentColor,
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            flexShrink: 0,
                            marginTop: '0.125rem'
                          }}>
                            {index + 1}
                          </div>
                          <p style={{
                            fontSize: '1.125rem',
                            color: '#374151',
                            margin: 0,
                            lineHeight: '1.5',
                            flex: 1
                          }}>
                            {point}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Editable components overlay */}
            {editMode && (currentSlide.components || []).map(renderComponent)}

            {/* Footer */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              right: '2rem',
              fontSize: '0.875rem',
              color: secondaryColor
            }}>
              {currentSlideIndex + 1} / {totalSlides}
            </div>
          </div>
        </div>

        {/* Component Editor */}
        {editMode && (
          <ComponentEditor
            component={selectedComponent ? (currentSlide.components || []).find(c => c.id === selectedComponent) : null}
            onUpdate={handleComponentUpdate}
            onDelete={handleComponentDelete}
          />
        )}
      </div>
    </div>
  )
}

export default EditableSlideRenderer
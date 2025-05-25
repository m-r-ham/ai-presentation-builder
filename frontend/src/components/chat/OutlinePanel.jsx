import { useState } from 'react'

function OutlinePanel({ outline, onUpdateOutline }) {
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const [showVersions, setShowVersions] = useState(false)
  const [savingField, setSavingField] = useState(null)
  const [savedField, setSavedField] = useState(null)
  const { metadata, slides, completionStatus, versions } = outline
  

  const handleFieldEdit = (field, value) => {
    setEditingField(field)
    setTempValue(value || '')
  }

  const handleFieldSave = async (field) => {
    setSavingField(field)
    try {
      if (onUpdateOutline) {
        await onUpdateOutline(field, tempValue)
      }
      setEditingField(null)
      setTempValue('')
      setSavedField(field)
      setTimeout(() => setSavedField(null), 2000) // Clear success indicator after 2 seconds
    } catch (error) {
      console.error('Error saving field:', error)
    } finally {
      setSavingField(null)
    }
  }

  const handleFieldCancel = () => {
    setEditingField(null)
    setTempValue('')
  }

  const getFieldStatus = (fieldName, value) => {
    if (!value || value.trim() === '') {
      return 'missing'
    }
    return 'complete'
  }

  const FieldEditor = ({ field, value, placeholder, options = null }) => {
    const status = getFieldStatus(field, value)
    
    if (editingField === field) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
          {options ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              style={{
                flex: 1,
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}
            >
              <option value="">Select...</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              style={{
                flex: 1,
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.75rem'
              }}
              autoFocus
            />
          )}
          <button
            onClick={() => handleFieldSave(field)}
            disabled={savingField === field}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: savingField === field ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '0.625rem',
              cursor: savingField === field ? 'not-allowed' : 'pointer'
            }}
          >
            {savingField === field ? '⏳' : '✓'}
          </button>
          <button
            onClick={handleFieldCancel}
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '0.625rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>
      )
    }

    return (
      <div
        onClick={() => handleFieldEdit(field, value)}
        style={{
          padding: '0.375rem',
          marginTop: '0.25rem',
          border: savedField === field ? '2px solid #10b981' : '1px solid transparent',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          backgroundColor: savedField === field ? '#ecfdf5' : 
                          status === 'missing' ? '#fef2f2' : '#f0fdf4',
          color: savedField === field ? '#047857' :
                 status === 'missing' ? '#991b1b' : '#166534',
          minHeight: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onMouseEnter={(e) => {
          if (savedField !== field) {
            e.target.style.backgroundColor = status === 'missing' ? '#fee2e2' : '#dcfce7'
          }
        }}
        onMouseLeave={(e) => {
          if (savedField !== field) {
            e.target.style.backgroundColor = status === 'missing' ? '#fef2f2' : '#f0fdf4'
          }
        }}
      >
        <span>
          {value || <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>{placeholder}</span>}
        </span>
        {savedField === field && (
          <span style={{ color: '#10b981', fontSize: '0.75rem', marginLeft: '0.5rem' }}>✓ Saved</span>
        )}
      </div>
    )
  }

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0
    }}>
      {/* Header with Progress */}
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Outline
        </div>
        <div style={{ 
          width: '100%', 
          height: '6px', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${completionStatus.percentage}%`,
            height: '100%',
            backgroundColor: completionStatus.percentage >= 90 ? '#10b981' : completionStatus.percentage >= 70 ? '#f59e0b' : '#ef4444',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          fontSize: '0.6rem', 
          color: '#6b7280', 
          marginTop: '0.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            Metadata: {completionStatus.completed}/{completionStatus.total} • 
            Slides: {completionStatus.slideCount} ({completionStatus.hasSlideOutline ? '✓' : '✗'}) • 
            {completionStatus.percentage}%
          </span>
          {versions && versions.length > 0 && (
            <button
              onClick={() => setShowVersions(!showVersions)}
              style={{
                fontSize: '0.6rem',
                padding: '0.125rem 0.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              v{outline.currentVersion - 1}
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0.75rem',
        minHeight: 0,
        maxHeight: 'calc(100vh - 250px)'
      }}>
        {/* Status indicators */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.625rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: completionStatus.metadataComplete ? '#d1fae5' : '#fef3c7',
              color: completionStatus.metadataComplete ? '#065f46' : '#92400e',
              borderRadius: '12px'
            }}>
              {completionStatus.metadataComplete ? '✓ Metadata Complete' : '⏳ Gathering Info'}
            </span>
            <span style={{
              fontSize: '0.625rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: completionStatus.hasSlideOutline ? '#d1fae5' : '#fef3c7',
              color: completionStatus.hasSlideOutline ? '#065f46' : '#92400e',
              borderRadius: '12px'
            }}>
              {completionStatus.hasSlideOutline ? '✓ Slide Outline Ready' : '⏳ Need Slide Structure'}
            </span>
          </div>
        </div>

        {/* Version History (if shown) */}
        {showVersions && versions && (
          <div style={{ marginBottom: '1rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>History</div>
            <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {versions.slice(-3).reverse().map((version) => (
                <div key={version.version} style={{
                  padding: '0.375rem',
                  marginBottom: '0.25rem',
                  backgroundColor: 'white',
                  borderRadius: '3px',
                  fontSize: '0.625rem'
                }}>
                  <div style={{ fontWeight: '500' }}>
                    v{version.version} • {new Date(version.timestamp).toLocaleTimeString()}
                  </div>
                  <div style={{ color: '#6b7280' }}>{version.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
            Basic Information
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Title</label>
            <FieldEditor 
              field="title" 
              value={metadata.title} 
              placeholder="Click to add presentation title"
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Goal</label>
            <FieldEditor 
              field="goal" 
              value={metadata.goal} 
              placeholder="Click to set presentation goal"
              options={['Inform', 'Persuade', 'Align', 'Educate', 'Decide', 'Update']}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Purpose</label>
            <FieldEditor 
              field="purpose" 
              value={metadata.purpose} 
              placeholder="Click to add detailed purpose"
            />
          </div>
        </div>

        {/* Audience & Delivery */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>
            Audience & Delivery
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Audience</label>
            <FieldEditor 
              field="audience" 
              value={metadata.audience} 
              placeholder="Click to define audience"
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Delivery Method</label>
            <FieldEditor 
              field="deliveryMethod" 
              value={metadata.deliveryMethod} 
              placeholder="Click to set delivery method"
              options={['Live', 'Async', 'Hybrid', 'Workshop']}
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Duration</label>
            <FieldEditor 
              field="duration" 
              value={metadata.duration} 
              placeholder="Click to set duration"
            />
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '500', color: '#374151' }}>Date & Time</label>
            <FieldEditor 
              field="dateTime" 
              value={metadata.dateTime} 
              placeholder="Click to set date & time"
            />
          </div>
        </div>

        {/* Topics */}
        {metadata.topics && metadata.topics.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Topics
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {metadata.topics.map((topic, index) => (
                <span 
                  key={index}
                  style={{
                    fontSize: '0.625rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderRadius: '12px'
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE OUTLINE - The Key Component */}
        <div>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '600', 
            marginBottom: '0.5rem', 
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Slide Outline
            {completionStatus.hasSlideOutline && (
              <span style={{ fontSize: '0.6rem', color: '#10b981' }}>✓</span>
            )}
          </div>
          
          {slides.length > 0 ? (
            slides.map((slide, index) => (
              <div 
                key={slide.id} 
                style={{ 
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '0.5rem' 
                }}>
                  <div style={{ 
                    width: '1.5rem', 
                    height: '1.5rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.675rem',
                    fontWeight: '600',
                    marginRight: '0.75rem'
                  }}>
                    {slide.id}
                  </div>
                  <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>
                    {slide.title}
                  </div>
                  <div style={{ 
                    marginLeft: 'auto',
                    fontSize: '0.625rem',
                    padding: '0.125rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '4px'
                  }}>
                    {slide.type}
                  </div>
                </div>
                {slide.description && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    marginLeft: '2.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    {slide.description}
                  </div>
                )}
                {slide.keyPoints && slide.keyPoints.length > 0 && (
                  <div style={{ marginLeft: '2.25rem' }}>
                    {slide.keyPoints.map((point, pointIndex) => (
                      <div 
                        key={pointIndex}
                        style={{ 
                          fontSize: '0.675rem', 
                          color: '#9ca3af',
                          marginBottom: '0.25rem'
                        }}
                      >
                        • {point}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{
              padding: '1.5rem',
              textAlign: 'center',
              border: '2px dashed #d1d5db',
              borderRadius: '6px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                No slide outline yet
              </div>
              <div style={{ fontSize: '0.675rem' }}>
                Need at least 3 slides to complete the outline
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OutlinePanel

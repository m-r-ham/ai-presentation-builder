import { useState } from 'react'

function OutlinePanel({ outline, onUpdateOutline }) {
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const { metadata, slides, completionStatus } = outline

  const handleFieldEdit = (field, value) => {
    setEditingField(field)
    setTempValue(value || '')
  }

  const handleFieldSave = (field) => {
    if (onUpdateOutline) {
      onUpdateOutline(field, tempValue)
    }
    setEditingField(null)
    setTempValue('')
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
              <option value="_custom">Custom...</option>
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
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '0.625rem',
              cursor: 'pointer'
            }}
          >
            ✓
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
          border: '1px solid transparent',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          backgroundColor: status === 'missing' ? '#fef2f2' : '#f0fdf4',
          color: status === 'missing' ? '#991b1b' : '#166534',
          minHeight: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          ':hover': {
            backgroundColor: status === 'missing' ? '#fee2e2' : '#dcfce7'
          }
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = status === 'missing' ? '#fee2e2' : '#dcfce7'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = status === 'missing' ? '#fef2f2' : '#f0fdf4'
        }}
      >
        {value || <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>{placeholder}</span>}
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Progress */}
      <div style={{ 
        padding: '1rem', 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
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
            backgroundColor: completionStatus.percentage >= 70 ? '#10b981' : '#f59e0b',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ 
          fontSize: '0.6rem', 
          color: '#6b7280', 
          marginTop: '0.25rem' 
        }}>
          {completionStatus.completed}/{completionStatus.total} fields complete ({completionStatus.percentage}%)
        </div>
      </div>

      {/* Editable Fields */}
      <div style={{ 
        flex: 1,
        padding: '0.75rem',
        overflowY: 'auto'
      }}>
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

        {/* Slides */}
        {slides.length > 0 && (
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
              Slides ({slides.length})
            </div>
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                style={{ 
                  padding: '0.5rem',
                  border: '1px solid #f3f4f6',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  fontSize: '0.75rem'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '0.25rem' 
                }}>
                  <div style={{ 
                    width: '1.25rem', 
                    height: '1.25rem', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    marginRight: '0.5rem'
                  }}>
                    {slide.id}
                  </div>
                  <div style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.75rem' }}>
                    {slide.title}
                  </div>
                </div>
                {slide.description && (
                  <div style={{ 
                    fontSize: '0.625rem', 
                    color: '#6b7280', 
                    marginLeft: '1.75rem',
                    lineHeight: '1.3'
                  }}>
                    {slide.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OutlinePanel

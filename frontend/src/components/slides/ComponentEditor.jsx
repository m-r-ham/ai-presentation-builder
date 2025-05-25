import { useState, useEffect } from 'react'

function ComponentEditor({ component, onUpdate, onDelete }) {
  const [content, setContent] = useState('')
  const [properties, setProperties] = useState({})

  useEffect(() => {
    if (component) {
      setContent(component.content || '')
      setProperties({
        x: component.x || 0,
        y: component.y || 0,
        width: component.width || 40,
        height: component.height || 20
      })
    }
  }, [component])

  if (!component) {
    return (
      <div style={{
        padding: '1rem',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.875rem'
      }}>
        Select a component to edit its properties
      </div>
    )
  }

  const handleContentUpdate = (newContent) => {
    setContent(newContent)
    onUpdate({
      ...component,
      content: newContent
    })
  }

  const handlePropertyUpdate = (prop, value) => {
    const newProps = { ...properties, [prop]: value }
    setProperties(newProps)
    onUpdate({
      ...component,
      x: newProps.x,
      y: newProps.y,
      width: newProps.width,
      height: newProps.height
    })
  }

  const handleListItemUpdate = (index, value) => {
    const newList = [...(component.content || [])]
    newList[index] = value
    handleContentUpdate(newList)
  }

  const addListItem = () => {
    const newList = [...(component.content || []), 'New item']
    handleContentUpdate(newList)
  }

  const removeListItem = (index) => {
    const newList = (component.content || []).filter((_, i) => i !== index)
    handleContentUpdate(newList)
  }

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#f9fafb',
      borderLeft: '1px solid #e5e7eb',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          Edit {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
        </h3>
        <button
          onClick={() => onDelete(component.id)}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>

      {/* Content Editor */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          Content
        </label>

        {(component.type === 'text' || component.type === 'title') && (
          <textarea
            value={content}
            onChange={(e) => handleContentUpdate(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            placeholder={`Enter ${component.type} content...`}
          />
        )}

        {component.type === 'list' && (
          <div>
            {(component.content || []).map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                marginBottom: '0.5rem',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListItemUpdate(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.375rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  onClick={() => removeListItem(index)}
                  style={{
                    padding: '0.375rem',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addListItem}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              + Add Item
            </button>
          </div>
        )}

        {component.type === 'image' && (
          <div>
            <input
              type="text"
              value={component.content?.src || ''}
              onChange={(e) => handleContentUpdate({ ...component.content, src: e.target.value })}
              placeholder="Image URL"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                boxSizing: 'border-box'
              }}
            />
            <input
              type="text"
              value={component.content?.alt || ''}
              onChange={(e) => handleContentUpdate({ ...component.content, alt: e.target.value })}
              placeholder="Alt text"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        {component.type === 'chart' && (
          <div>
            <select
              value={component.content?.type || 'bar'}
              onChange={(e) => handleContentUpdate({ ...component.content, type: e.target.value })}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                boxSizing: 'border-box'
              }}
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
            <textarea
              value={JSON.stringify(component.content?.data || [], null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value)
                  handleContentUpdate({ ...component.content, data })
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              placeholder="Chart data (JSON format)"
              style={{
                width: '100%',
                height: '100px',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>

      {/* Position & Size */}
      <div>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
          Position & Size
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>X (%)</label>
            <input
              type="number"
              value={properties.x}
              onChange={(e) => handlePropertyUpdate('x', Number(e.target.value))}
              min="0"
              max="100"
              style={{
                width: '100%',
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Y (%)</label>
            <input
              type="number"
              value={properties.y}
              onChange={(e) => handlePropertyUpdate('y', Number(e.target.value))}
              min="0"
              max="100"
              style={{
                width: '100%',
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Width (%)</label>
            <input
              type="number"
              value={properties.width}
              onChange={(e) => handlePropertyUpdate('width', Number(e.target.value))}
              min="10"
              max="100"
              style={{
                width: '100%',
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: '0.75rem', color: '#6b7280' }}>Height (%)</label>
            <input
              type="number"
              value={properties.height}
              onChange={(e) => handlePropertyUpdate('height', Number(e.target.value))}
              min="10"
              max="100"
              style={{
                width: '100%',
                padding: '0.375rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.875rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentEditor
import { useState, useEffect } from 'react'

function TemplateManager({ onLoadTemplate, onLoadComponent }) {
  const [templates, setTemplates] = useState([])
  const [components, setComponents] = useState([])
  const [activeTab, setActiveTab] = useState('templates')
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveType, setSaveType] = useState('template')
  const [saveName, setSaveName] = useState('')
  const [saveDescription, setSaveDescription] = useState('')

  useEffect(() => {
    // Load templates and components from localStorage
    const savedTemplates = localStorage.getItem('slide-templates')
    const savedComponents = localStorage.getItem('slide-components')
    
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates))
    }
    
    if (savedComponents) {
      setComponents(JSON.parse(savedComponents))
    }
  }, [])

  const saveTemplates = (newTemplates) => {
    localStorage.setItem('slide-templates', JSON.stringify(newTemplates))
    setTemplates(newTemplates)
  }

  const saveComponents = (newComponents) => {
    localStorage.setItem('slide-components', JSON.stringify(newComponents))
    setComponents(newComponents)
  }

  const handleSaveTemplate = (slide) => {
    setSaveType('template')
    setShowSaveModal(true)
    // Store the slide to be saved
    window.pendingSave = slide
  }

  const handleSaveComponent = (component) => {
    setSaveType('component')
    setShowSaveModal(true)
    // Store the component to be saved
    window.pendingSave = component
  }

  const confirmSave = () => {
    if (!saveName.trim()) return

    const saveData = {
      id: Date.now(),
      name: saveName,
      description: saveDescription,
      data: window.pendingSave,
      created: new Date().toISOString()
    }

    if (saveType === 'template') {
      const newTemplates = [...templates, saveData]
      saveTemplates(newTemplates)
    } else {
      const newComponents = [...components, saveData]
      saveComponents(newComponents)
    }

    setShowSaveModal(false)
    setSaveName('')
    setSaveDescription('')
    window.pendingSave = null
  }

  const deleteTemplate = (id) => {
    const newTemplates = templates.filter(t => t.id !== id)
    saveTemplates(newTemplates)
  }

  const deleteComponent = (id) => {
    const newComponents = components.filter(c => c.id !== id)
    saveComponents(newComponents)
  }

  return (
    <div style={{
      width: '300px',
      backgroundColor: '#f9fafb',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
          Templates & Components
        </h3>
        
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          padding: '2px'
        }}>
          <button
            onClick={() => setActiveTab('templates')}
            style={{
              flex: 1,
              padding: '0.375rem 0.75rem',
              backgroundColor: activeTab === 'templates' ? '#3b82f6' : 'transparent',
              color: activeTab === 'templates' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('components')}
            style={{
              flex: 1,
              padding: '0.375rem 0.75rem',
              backgroundColor: activeTab === 'components' ? '#3b82f6' : 'transparent',
              color: activeTab === 'components' ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Components
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {activeTab === 'templates' ? (
          <div>
            {templates.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem',
                padding: '2rem'
              }}>
                No saved templates yet
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => onLoadTemplate && onLoadTemplate(template.data)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {template.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteTemplate(template.id)
                      }}
                      style={{
                        padding: '0.125rem 0.25rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '0.625rem',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {template.description && (
                    <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {template.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {components.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                fontSize: '0.875rem',
                padding: '2rem'
              }}>
                No saved components yet
              </div>
            ) : (
              components.map((component) => (
                <div
                  key={component.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => onLoadComponent && onLoadComponent(component.data)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.25rem'
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {component.name}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteComponent(component.id)
                      }}
                      style={{
                        padding: '0.125rem 0.25rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '0.625rem',
                        cursor: 'pointer'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    {component.data.type} component
                  </div>
                  {component.description && (
                    <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: '1.4'
                    }}>
                      {component.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Save Modal */}
      {showSaveModal && (
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
            padding: '1.5rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
              Save {saveType === 'template' ? 'Template' : 'Component'}
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Name
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder={`Enter ${saveType} name...`}
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                color: '#374151'
              }}>
                Description (optional)
              </label>
              <textarea
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                placeholder={`Describe this ${saveType}...`}
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
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                disabled={!saveName.trim()}
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  backgroundColor: saveName.trim() ? '#3b82f6' : '#f3f4f6',
                  color: saveName.trim() ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  cursor: saveName.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export functions to be used by parent components
TemplateManager.saveTemplate = (slide) => {
  if (window.templateManagerRef) {
    window.templateManagerRef.handleSaveTemplate(slide)
  }
}

TemplateManager.saveComponent = (component) => {
  if (window.templateManagerRef) {
    window.templateManagerRef.handleSaveComponent(component)
  }
}

export default TemplateManager
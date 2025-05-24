import { useState } from 'react'

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('brand')
  const [settings, setSettings] = useState({
    brand: {
      primaryColor: '#3b82f6',
      secondaryColor: '#6b7280',
      accentColor: '#10b981',
      fontFamily: 'Inter',
      logoUrl: ''
    },
    account: {
      name: 'Mitchell Hamilton',
      email: 'mitchell@example.com',
      company: 'Tech Startup Inc.'
    },
    dictionary: {
      customTerms: [
        { term: 'Q2', definition: 'Second Quarter (April-June)' },
        { term: 'A/B Test', definition: 'Split testing methodology' }
      ]
    }
  })

  const [newTerm, setNewTerm] = useState('')
  const [newDefinition, setNewDefinition] = useState('')

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const addCustomTerm = () => {
    if (newTerm.trim() && newDefinition.trim()) {
      setSettings(prev => ({
        ...prev,
        dictionary: {
          ...prev.dictionary,
          customTerms: [
            ...prev.dictionary.customTerms,
            { term: newTerm.trim(), definition: newDefinition.trim() }
          ]
        }
      }))
      setNewTerm('')
      setNewDefinition('')
    }
  }

  const removeCustomTerm = (index) => {
    setSettings(prev => ({
      ...prev,
      dictionary: {
        ...prev.dictionary,
        customTerms: prev.dictionary.customTerms.filter((_, i) => i !== index)
      }
    }))
  }

  const tabs = [
    { id: 'brand', label: 'Brand & Design', icon: '🎨' },
    { id: 'assets', label: 'Assets', icon: '📁' },
    { id: 'dictionary', label: 'Dictionary', icon: '📖' },
    { id: 'account', label: 'Account', icon: '👤' }
  ]

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      backgroundColor: '#f9fafb',
      overflow: 'hidden'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: 'white',
        borderRight: '1px solid #e5e7eb',
        padding: '2rem 0',
        flexShrink: 0
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
            Settings
          </h2>
        </div>
        
        <nav>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: activeTab === tab.id ? '#f3f4f6' : 'transparent',
                color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                border: 'none',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          {activeTab === 'brand' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                Brand & Design
              </h3>
              
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Brand Colors
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Primary Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={settings.brand.primaryColor}
                          onChange={(e) => updateSetting('brand', 'primaryColor', e.target.value)}
                          style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={settings.brand.primaryColor}
                          onChange={(e) => updateSetting('brand', 'primaryColor', e.target.value)}
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Secondary Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={settings.brand.secondaryColor}
                          onChange={(e) => updateSetting('brand', 'secondaryColor', e.target.value)}
                          style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={settings.brand.secondaryColor}
                          onChange={(e) => updateSetting('brand', 'secondaryColor', e.target.value)}
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                        Accent Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="color"
                          value={settings.brand.accentColor}
                          onChange={(e) => updateSetting('brand', 'accentColor', e.target.value)}
                          style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          type="text"
                          value={settings.brand.accentColor}
                          onChange={(e) => updateSetting('brand', 'accentColor', e.target.value)}
                          style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Typography
                  </h4>
                  
                  <div style={{ maxWidth: '300px' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Primary Font Family
                    </label>
                    <select
                      value={settings.brand.fontFamily}
                      onChange={(e) => updateSetting('brand', 'fontFamily', e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Save Brand Settings
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'assets' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                Assets
              </h3>
              
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '3rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                    Upload Assets
                  </h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                    Drag and drop images, icons, or click to browse
                  </p>
                  <button style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}>
                    Browse Files
                  </button>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Recent Assets
                  </h4>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    No assets uploaded yet
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'dictionary' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                Custom Dictionary
              </h3>
              
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                    Add custom terms and definitions to help the AI understand your company's vocabulary
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Term (e.g., 'Q2')"
                      value={newTerm}
                      onChange={(e) => setNewTerm(e.target.value)}
                      style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Definition"
                      value={newDefinition}
                      onChange={(e) => setNewDefinition(e.target.value)}
                      style={{ flex: 2, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                    />
                    <button 
                      onClick={addCustomTerm}
                      disabled={!newTerm.trim() || !newDefinition.trim()}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        opacity: (!newTerm.trim() || !newDefinition.trim()) ? 0.5 : 1
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Current Terms ({settings.dictionary.customTerms.length})
                  </h4>
                  {settings.dictionary.customTerms.length === 0 ? (
                    <div style={{ 
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#6b7280',
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px'
                    }}>
                      No custom terms yet. Add your first term above.
                    </div>
                  ) : (
                    <div style={{ space: '0.5rem' }}>
                      {settings.dictionary.customTerms.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                          backgroundColor: '#f9fafb'
                        }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: '600', color: '#1f2937' }}>{item.term}</span>
                            <span style={{ margin: '0 0.5rem', color: '#6b7280' }}>—</span>
                            <span style={{ color: '#6b7280' }}>{item.definition}</span>
                          </div>
                          <button 
                            onClick={() => removeCustomTerm(index)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              marginLeft: '1rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                Account Settings
              </h3>
              
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.account.name}
                    onChange={(e) => updateSetting('account', 'name', e.target.value)}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => updateSetting('account', 'email', e.target.value)}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={settings.account.company}
                    onChange={(e) => updateSetting('account', 'company', e.target.value)}
                    style={{ width: '100%', maxWidth: '400px', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.875rem' }}
                  />
                </div>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    Preferences
                  </h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input type="checkbox" id="emailNotifications" defaultChecked />
                    <label htmlFor="emailNotifications" style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Email notifications for presentation updates
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input type="checkbox" id="autoSave" defaultChecked />
                    <label htmlFor="autoSave" style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Auto-save presentations while editing
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="advancedFeatures" />
                    <label htmlFor="advancedFeatures" style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Enable advanced AI features (beta)
                    </label>
                  </div>
                </div>
                
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Save Account Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

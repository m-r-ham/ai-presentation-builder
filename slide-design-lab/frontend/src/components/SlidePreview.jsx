import { useState, useEffect } from 'react'

function SlidePreview({ markdown }) {
  const [renderedContent, setRenderedContent] = useState('')

  useEffect(() => {
    // Parse Slidev markdown and render a preview
    renderSlidePreview(markdown)
  }, [markdown])

  const renderSlidePreview = (markdown) => {
    try {
      // Extract frontmatter and content
      const parts = markdown.split('---')
      let content = ''
      let frontmatter = {}

      if (parts.length >= 3) {
        // Has frontmatter
        content = parts.slice(2).join('---').trim()
        try {
          // Parse frontmatter (simplified)
          const frontmatterText = parts[1]
          const lines = frontmatterText.split('\n')
          lines.forEach(line => {
            const [key, ...valueParts] = line.split(':')
            if (key && valueParts.length > 0) {
              frontmatter[key.trim()] = valueParts.join(':').trim()
            }
          })
        } catch (e) {
          console.warn('Could not parse frontmatter:', e)
        }
      } else {
        content = markdown
      }

      // Convert markdown to HTML (basic conversion)
      let html = content
        .replace(/^# (.*$)/gm, '<h1 class="slide-title">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="slide-subtitle">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="slide-heading">$1</h3>')
        .replace(/^- (.*$)/gm, '<li class="slide-bullet">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')

      // Wrap bullets in ul
      html = html.replace(/(<li class="slide-bullet">.*<\/li>)/gs, '<ul class="slide-list">$1</ul>')
      
      // Wrap content in paragraphs if needed
      if (!html.includes('<h1>') && !html.includes('<ul>')) {
        html = `<p>${html}</p>`
      }

      // Apply layout-specific styling
      const layout = frontmatter.layout || 'default'
      const layoutClass = getLayoutClass(layout)

      setRenderedContent(`
        <div class="slide-preview-container ${layoutClass}">
          ${html}
        </div>
      `)

    } catch (error) {
      console.error('Error rendering slide preview:', error)
      setRenderedContent(`
        <div class="slide-preview-container error">
          <h3>Preview Error</h3>
          <p>Could not render slide preview</p>
          <pre style="font-size: 10px; color: #666;">${markdown.substring(0, 200)}...</pre>
        </div>
      `)
    }
  }

  const getLayoutClass = (layout) => {
    const layoutClasses = {
      'default': 'layout-default',
      'cover': 'layout-cover',
      'center': 'layout-center',
      'two-cols': 'layout-two-cols',
      'image-right': 'layout-image-right',
      'image-left': 'layout-image-left',
      'quote': 'layout-quote'
    }
    return layoutClasses[layout] || 'layout-default'
  }

  return (
    <div style={{
      minHeight: '200px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      <div 
        style={{
          padding: '16px',
          fontSize: '12px',
          lineHeight: '1.4',
          height: '100%',
          overflow: 'auto'
        }}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      <style>{`
        .slide-preview-container {
          min-height: 150px;
          font-family: 'Inter', sans-serif;
        }
        
        .slide-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #1e293b;
          line-height: 1.2;
        }
        
        .slide-subtitle {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #475569;
          line-height: 1.3;
        }
        
        .slide-heading {
          font-size: 12px;
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #64748b;
          line-height: 1.3;
        }
        
        .slide-list {
          margin: 8px 0;
          padding-left: 16px;
        }
        
        .slide-bullet {
          margin: 4px 0;
          font-size: 11px;
          line-height: 1.4;
          color: #374151;
        }
        
        .layout-cover {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 150px;
        }
        
        .layout-center {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 150px;
        }
        
        .layout-two-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: start;
        }
        
        .layout-quote {
          font-style: italic;
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-left: 4px solid #3b82f6;
        }
        
        .error {
          color: #ef4444;
          padding: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
        }
        
        p {
          margin: 8px 0;
          font-size: 11px;
          line-height: 1.4;
          color: #374151;
        }
        
        strong {
          font-weight: 600;
          color: #1e293b;
        }
        
        em {
          font-style: italic;
          color: #6b7280;
        }
        
        code {
          background: #f1f5f9;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 10px;
          font-family: 'Monaco', monospace;
        }
      `}</style>
    </div>
  )
}

export default SlidePreview
import { useState } from 'react'

function SlideRenderer({ outline, brandColors }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  
  const { primaryColor = '#3b82f6', secondaryColor = '#6b7280', accentColor = '#10b981' } = brandColors;
  
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

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Slide Content */}
      <div style={{
        width: '100%',
        height: '100%',
        aspectRatio: '16/9',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: `3px solid ${primaryColor}`,
          paddingBottom: '1rem',
          marginBottom: '2rem'
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
              margin: 0,
              textAlign: currentSlideIndex === 0 ? 'center' : 'left'
            }}>
              {currentSlide.description}
            </p>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
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

        {/* Footer */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '3rem',
          fontSize: '0.875rem',
          color: secondaryColor
        }}>
          {currentSlideIndex + 1} / {totalSlides}
        </div>
      </div>

      {/* Navigation Controls */}
      {totalSlides > 1 && (
        <>
          {/* Previous Button */}
          {currentSlideIndex > 0 && (
            <button
              onClick={() => setCurrentSlideIndex(currentSlideIndex - 1)}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3rem',
                height: '3rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ←
            </button>
          )}

          {/* Next Button */}
          {currentSlideIndex < totalSlides - 1 && (
            <button
              onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3rem',
                height: '3rem',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              →
            </button>
          )}

          {/* Slide Indicators */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '0.5rem',
            borderRadius: '1rem',
            zIndex: 10
          }}>
            {outline.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentSlideIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SlideRenderer

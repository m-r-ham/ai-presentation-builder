import { BarChart3, Zap, Target } from 'lucide-react'

function Header({ stats }) {
  return (
    <header style={{
      height: '60px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap size={18} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
            Slide Design Lab
          </h1>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Training slides for AI presentation builder integration
          </p>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} color="#6b7280" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                {stats.totalSessions}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Sessions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={16} color="#6b7280" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                {stats.keepRate}%
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Keep Rate
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#f1f5f9',
            borderRadius: '6px'
          }}>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>
              Avg Rating: {stats.avgRatings ? 
                Object.values(stats.avgRatings).reduce((a, b) => a + b, 0) / 6 : 0
              }/5
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
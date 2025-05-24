import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PresentationBuilder from './pages/PresentationBuilder'
import SettingsPage from './pages/SettingsPage'
import Navigation from './components/Navigation'

function App() {
  return (
    <Router>
      <div style={{ 
        width: '100vw',
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Navigation />
        <div style={{ 
          flex: 1, 
          width: '100%',
          overflow: 'hidden'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/presentation/:id?" element={<PresentationBuilder />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App

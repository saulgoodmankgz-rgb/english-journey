import { useStore } from './store/useStore'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Grammar from './pages/Grammar'
import Vocabulary from './pages/Vocabulary'
import MindMap from './pages/MindMap'
import Settings from './pages/Settings'

function App() {
  const currentPage = useStore((s) => s.currentPage)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />
      case 'grammar': return <Grammar />
      case 'vocabulary': return <Vocabulary />
      case 'mindmap': return <MindMap />
      case 'settings': return <Settings />
      default: return <Dashboard />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0d1117' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          overflowY: currentPage === 'mindmap' ? 'hidden' : 'auto',
          overflowX: 'hidden',
          height: '100vh',
        }}
      >
        {renderPage()}
      </main>
    </div>
  )
}

export default App

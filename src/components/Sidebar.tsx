import { useStore } from '../store/useStore'
import ProgressRing from './ProgressRing'
import { LayoutDashboard, BookOpen, Type, Network, Settings } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'grammar', label: 'Grammar', icon: BookOpen, color: '#bc8cff' },
  { id: 'vocabulary', label: 'Vocabulary', icon: Type, color: '#d29922' },
  { id: 'mindmap', label: 'Mind Map', icon: Network, color: '#58a6ff' },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, grammarTopics, vocabWords, settings } = useStore()

  const masteredGrammar = grammarTopics.filter((t) => t.status === 'mastered').length
  const totalGrammar = grammarTopics.length
  const masteredVocab = vocabWords.filter((w) => w.status === 'mastered').length
  const totalVocab = settings.targetVocabCount

  const grammarPct = totalGrammar > 0 ? Math.round((masteredGrammar / Math.max(totalGrammar, 50)) * 100) : 0
  const vocabPct = Math.round((masteredVocab / totalVocab) * 100)

  function getRingForPage(id: string) {
    if (id === 'grammar') {
      return { value: grammarPct, color: '#bc8cff' }
    }
    if (id === 'vocabulary') {
      return { value: vocabPct, color: '#d29922' }
    }
    return null
  }

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: '#161b22',
        borderRight: '1px solid #30363d',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #30363d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #58a6ff, #bc8cff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            📖
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
              english journey
            </div>
            <div style={{ fontSize: 11, color: '#8b949e', marginTop: 1 }}>
              personal tracker
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
        {navItems.map(({ id, label, icon: Icon, color }) => {
          const ring = getRingForPage(id)
          const active = currentPage === id

          return (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: 'none',
                background: active ? 'rgba(88,166,255,0.1)' : 'transparent',
                color: active ? '#e6edf3' : '#8b949e',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'rgba(139,148,158,0.08)'
                  el.style.color = '#e6edf3'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = '#8b949e'
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: '#58a6ff',
                  }}
                />
              )}

              <Icon
                size={18}
                style={{ flexShrink: 0, color: active ? color || '#58a6ff' : 'inherit' }}
              />
              <span style={{ flex: 1, fontSize: 14, fontWeight: active ? 600 : 400 }}>
                {label}
              </span>

              {ring && (
                <ProgressRing
                  value={ring.value}
                  size={28}
                  strokeWidth={3}
                  color={ring.color}
                  label={`${ring.value}%`}
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* Streak */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #30363d',
          background: '#161b22',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Current streak
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>
                {settings.currentStreak}
              </span>
              <span style={{ fontSize: 13, color: '#8b949e' }}>days</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4 }}>best</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#d29922' }}>
              {settings.longestStreak}d
            </div>
          </div>
        </div>

        {/* Mini streak dots */}
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const done = i < 5
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: done ? '#d29922' : '#30363d',
                    marginBottom: 4,
                  }}
                />
                <span style={{ fontSize: 9, color: '#484f58' }}>{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

import { useStore } from '../store/useStore'
import ProgressRing from './ProgressRing'
import { LayoutDashboard, BookOpen, Type, Network, Settings, Flame } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'grammar',   label: 'Grammar',   icon: BookOpen,  color: '#a78bfa', glow: 'rgba(167,139,250,0.1)' },
  { id: 'vocabulary',label: 'Vocabulary',icon: Type,      color: '#fbbf24', glow: 'rgba(251,191,36,0.1)' },
  { id: 'mindmap',   label: 'Mind Map',  icon: Network,   color: '#60a5fa', glow: 'rgba(96,165,250,0.1)'  },
  { id: 'settings',  label: 'Settings',  icon: Settings                                                  },
]

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const cefrDescriptions: Record<string, string> = {
  A1: 'beginner', A2: 'elementary', B1: 'intermediate',
  B2: 'upper-int', C1: 'advanced', C2: 'mastery',
}

export default function Sidebar() {
  const { currentPage, setCurrentPage, grammarTopics, vocabWords, settings } = useStore()

  const masteredGrammar = grammarTopics.filter(t => t.status === 'mastered').length
  const masteredVocab   = vocabWords.filter(w => w.status === 'mastered').length

  const grammarPct = Math.round((masteredGrammar / Math.max(grammarTopics.length, 50)) * 100)
  const vocabPct   = Math.min(100, Math.round((masteredVocab / settings.targetVocabCount) * 100))

  const cefrIdx = cefrLevels.indexOf(settings.cefrGoal)

  function getRing(id: string) {
    if (id === 'grammar')    return { value: grammarPct, color: '#a78bfa' }
    if (id === 'vocabulary') return { value: vocabPct,   color: '#fbbf24' }
    return null
  }

  // Last 7 days activity
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const todayIndex = (new Date().getDay() + 6) % 7 // Monday = 0
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const storeActivity = useStore(s => s.activity)
  const actMap = new Map(storeActivity.map(a => [a.date, a.count]))
  const week7Active = last7.map(date => (actMap.get(date) || 0) > 0)

  return (
    <aside style={{
      width: 252,
      flexShrink: 0,
      background: '#110e1c',
      borderRight: '1px solid #2e2846',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid #221d35' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #7c6af5 0%, #a78bfa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 19,
            flexShrink: 0,
            boxShadow: '0 4px 16px rgba(124,106,245,0.35)',
          }}>
            ✦
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>
              english journey
            </div>
            <div style={{ fontSize: 11, color: '#4d4468', marginTop: 1 }}>
              personal tracker
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '10px 8px', flex: 1, overflowY: 'auto' }}>
        {navItems.map(({ id, label, icon: Icon, color, glow }) => {
          const ring   = getRing(id)
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
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                background: active ? (glow || 'rgba(124,106,245,0.1)') : 'transparent',
                color: active ? '#ede8ff' : '#8b7fb5',
                cursor: 'pointer',
                textAlign: 'left',
                marginBottom: 2,
                transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#19152a'
                  el.style.color = '#ede8ff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'transparent'
                  el.style.color = '#8b7fb5'
                }
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 18,
                  background: color || '#a78bfa',
                  borderRadius: '0 2px 2px 0',
                }} />
              )}

              <Icon size={16} style={{ flexShrink: 0, color: active ? (color || '#a78bfa') : 'inherit' }} />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: active ? 600 : 400, letterSpacing: '-0.01em' }}>
                {label}
              </span>

              {ring && (
                <ProgressRing
                  value={ring.value}
                  size={26}
                  strokeWidth={2.5}
                  color={ring.color}
                  trackColor="#2e2846"
                />
              )}
            </button>
          )
        })}
      </nav>

      {/* CEFR Journey Path */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #221d35' }}>
        <div style={{ fontSize: 10.5, color: '#4d4468', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          cefr path
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
          {/* connector line */}
          <div style={{
            position: 'absolute',
            top: 9,
            left: 9,
            right: 9,
            height: 2,
            background: '#221d35',
            borderRadius: 1,
            zIndex: 0,
          }} />
          {/* fill */}
          <div style={{
            position: 'absolute',
            top: 9,
            left: 9,
            width: `calc(${(cefrIdx / (cefrLevels.length - 1)) * 100}% - 18px * ${cefrIdx / (cefrLevels.length - 1)})`,
            height: 2,
            background: 'linear-gradient(90deg, #7c6af5, #a78bfa)',
            borderRadius: 1,
            zIndex: 0,
            transition: 'width 0.5s ease',
          }} />

          {cefrLevels.map((level, i) => {
            const passed  = i < cefrIdx
            const current = i === cefrIdx
            const future  = i > cefrIdx

            return (
              <div
                key={level}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  zIndex: 1,
                  position: 'relative',
                }}
              >
                <div
                  className={current ? 'cefr-current-pulse' : ''}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: passed
                      ? 'linear-gradient(135deg, #7c6af5, #a78bfa)'
                      : current
                        ? '#a78bfa'
                        : '#19152a',
                    border: `2px solid ${future ? '#2e2846' : '#a78bfa'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    color: future ? '#4d4468' : '#fff',
                    transition: 'all 0.3s',
                    flexShrink: 0,
                  }}
                >
                  {passed ? '✓' : ''}
                </div>
                <span style={{
                  fontSize: 10,
                  fontWeight: current ? 700 : 500,
                  color: future ? '#4d4468' : current ? '#a78bfa' : '#8b7fb5',
                  letterSpacing: '0.02em',
                }}>
                  {level}
                </span>
              </div>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{
            fontSize: 10.5,
            color: '#8b7fb5',
          }}>
            goal: <span style={{ color: '#a78bfa', fontWeight: 600 }}>{settings.cefrGoal}</span>
            <span style={{ color: '#4d4468' }}> · {cefrDescriptions[settings.cefrGoal]}</span>
          </span>
        </div>
      </div>

      {/* Streak */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #221d35' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Flame size={15} style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>
              {settings.currentStreak}
            </span>
            <span style={{ fontSize: 12, color: '#8b7fb5' }}>day streak</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 11, color: '#4d4468' }}>best </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24' }}>{settings.longestStreak}d</span>
          </div>
        </div>

        {/* Week dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {weekDays.map((day, i) => {
            const active = week7Active[i]
            const isToday = i === todayIndex
            return (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 5,
                  borderRadius: 3,
                  background: active
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : '#221d35',
                  marginBottom: 4,
                  boxShadow: active ? '0 0 8px rgba(251,191,36,0.3)' : 'none',
                  border: isToday && !active ? '1px solid #2e2846' : 'none',
                  transition: 'all 0.2s',
                }} />
                <span style={{ fontSize: 9, color: isToday ? '#8b7fb5' : '#342f4a', fontWeight: isToday ? 600 : 400 }}>
                  {day}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

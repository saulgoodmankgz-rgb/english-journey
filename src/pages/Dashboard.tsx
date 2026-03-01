import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import ActivityHeatmap from '../components/ActivityHeatmap'
import { BookOpen, Type, Zap, Target } from 'lucide-react'

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export default function Dashboard() {
  const { grammarTopics, vocabWords, activity, settings, setCurrentPage } = useStore()

  const masteredGrammar = grammarTopics.filter((t) => t.status === 'mastered').length
  const inProgressGrammar = grammarTopics.filter((t) => t.status === 'in-progress').length
  const masteredVocab = vocabWords.filter((w) => w.status === 'mastered').length
  const learningVocab = vocabWords.filter((w) => w.status === 'learning').length
  const totalVocab = vocabWords.length

  const grammarPct = grammarTopics.length > 0
    ? Math.round((masteredGrammar / Math.max(grammarTopics.length, 50)) * 100)
    : 0
  const vocabPct = Math.round((masteredVocab / settings.targetVocabCount) * 100)

  const recentWords = [...vocabWords]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 5)

  const recentGrammar = [...grammarTopics]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, 3)

  const cefrIdx = cefrLevels.indexOf(settings.cefrGoal)

  const statusColor = {
    mastered: '#3fb950',
    'in-progress': '#58a6ff',
    'not-started': '#8b949e',
    new: '#58a6ff',
    learning: '#d29922',
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1100 }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#e6edf3' }}>
          good session. keep going. 🚀
        </h1>
        <p style={{ margin: 0, color: '#8b949e', fontSize: 15 }}>
          here's where your english journey stands today
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          {
            label: 'level goal',
            value: settings.cefrGoal,
            sub: cefrIdx > 0 ? `from ${cefrLevels[cefrIdx - 1]}` : 'starting level',
            icon: Target,
            color: '#58a6ff',
            bg: 'rgba(88,166,255,0.1)',
          },
          {
            label: 'words mastered',
            value: masteredVocab,
            sub: `${totalVocab} total · ${learningVocab} learning`,
            icon: Type,
            color: '#d29922',
            bg: 'rgba(210,153,34,0.1)',
          },
          {
            label: 'grammar mastered',
            value: masteredGrammar,
            sub: `${inProgressGrammar} in progress`,
            icon: BookOpen,
            color: '#bc8cff',
            bg: 'rgba(188,140,255,0.1)',
          },
          {
            label: 'streak',
            value: `${settings.currentStreak}d`,
            sub: `best ${settings.longestStreak} days`,
            icon: Zap,
            color: '#d29922',
            bg: 'rgba(210,153,34,0.1)',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div
            key={label}
            style={{
              background: '#1c2333',
              border: '1px solid #30363d',
              borderRadius: 12,
              padding: '18px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#8b949e', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
              {value}
            </div>
            <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, padding: '20px 24px', marginBottom: 28 }}>
        <ActivityHeatmap activity={activity} />
      </div>

      {/* Channel progress + recent feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Grammar channel card */}
        <div
          style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, padding: 20, cursor: 'pointer' }}
          onClick={() => setCurrentPage('grammar')}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#bc8cff40' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#30363d' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <ProgressRing
              value={grammarPct}
              size={64}
              strokeWidth={5}
              color="#bc8cff"
              label={`${masteredGrammar}`}
              sublabel="rules"
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3' }}>Grammar</div>
              <div style={{ fontSize: 13, color: '#8b949e', marginTop: 2 }}>
                {masteredGrammar} mastered · {inProgressGrammar} in progress
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(188,140,255,0.15)', color: '#bc8cff' }}>
                  {grammarPct}% complete
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #30363d', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              recent
            </div>
            {recentGrammar.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: statusColor[t.status as keyof typeof statusColor] || '#8b949e',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#c9d1d9', flex: 1 }}>{t.topic}</span>
                <span style={{ fontSize: 11, color: '#8b949e' }}>{t.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vocabulary channel card */}
        <div
          style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, padding: 20, cursor: 'pointer' }}
          onClick={() => setCurrentPage('vocabulary')}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#d2992240' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#30363d' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <ProgressRing
              value={vocabPct}
              size={64}
              strokeWidth={5}
              color="#d29922"
              label={`${masteredVocab}`}
              sublabel="words"
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3' }}>Vocabulary</div>
              <div style={{ fontSize: 13, color: '#8b949e', marginTop: 2 }}>
                {masteredVocab} mastered · {learningVocab} learning
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(210,153,34,0.15)', color: '#d29922' }}>
                  {masteredVocab}/{settings.targetVocabCount} target
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #30363d', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              recent words
            </div>
            {recentWords.map((w) => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: statusColor[w.status as keyof typeof statusColor] || '#8b949e',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: '#c9d1d9', flex: 1, fontWeight: 500 }}>{w.word}</span>
                <span style={{ fontSize: 11, color: '#8b949e' }}>{w.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

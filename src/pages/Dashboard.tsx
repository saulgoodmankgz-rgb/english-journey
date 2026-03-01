import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import ActivityHeatmap from '../components/ActivityHeatmap'
import { BookOpen, Type, Zap, ArrowRight } from 'lucide-react'

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const cefrFull: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
  B2: 'Upper-Intermediate', C1: 'Advanced', C2: 'Mastery',
}

const statusDot = (status: string) => {
  const m: Record<string, string> = {
    mastered: '#34d399', 'in-progress': '#60a5fa',
    'not-started': '#4d4468', new: '#60a5fa', learning: '#fbbf24',
  }
  return m[status] || '#4d4468'
}

export default function Dashboard() {
  const { grammarTopics, vocabWords, activity, settings, setCurrentPage } = useStore()

  const masteredGrammar   = grammarTopics.filter(t => t.status === 'mastered').length
  const inProgressGrammar = grammarTopics.filter(t => t.status === 'in-progress').length
  const masteredVocab     = vocabWords.filter(w => w.status === 'mastered').length
  const learningVocab     = vocabWords.filter(w => w.status === 'learning').length

  const grammarPct = Math.round((masteredGrammar / Math.max(grammarTopics.length, 50)) * 100)
  const vocabPct   = Math.min(100, Math.round((masteredVocab / settings.targetVocabCount) * 100))

  const recentWords   = [...vocabWords].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 5)
  const recentGrammar = [...grammarTopics].sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 3)

  const cefrIdx = cefrLevels.indexOf(settings.cefrGoal)

  // Greeting based on time
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'good morning' : hour < 18 ? 'good afternoon' : 'good evening'

  return (
    <div style={{ padding: '32px 36px', maxWidth: 1060 }} className="fade-up">

      {/* Hero — current level + greeting */}
      <div style={{
        background: '#19152a',
        border: '1px solid #2e2846',
        borderRadius: 18,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* bg glow */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, color: '#4d4468', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
              {greeting}, zhamin
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 30, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              your english is{' '}
              <span style={{ color: '#a78bfa' }}>
                {cefrFull[settings.cefrGoal] || 'growing'}
              </span>
            </h1>
            <p style={{ margin: 0, color: '#8b7fb5', fontSize: 14, lineHeight: 1.5 }}>
              {masteredGrammar} grammar rules mastered · {masteredVocab} words in your bank · {settings.currentStreak} day streak
            </p>
          </div>

          {/* Level badge */}
          <div style={{
            background: 'rgba(167,139,250,0.1)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 16,
            padding: '18px 24px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: 11, color: '#8b7fb5', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              current goal
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {settings.cefrGoal}
            </div>
            <div style={{ fontSize: 11, color: '#4d4468', marginTop: 4 }}>
              {cefrIdx > 0 ? `from ${cefrLevels[cefrIdx - 1]}` : 'starting point'}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          {
            label: 'words mastered',
            value: masteredVocab,
            sub: `${learningVocab} still learning · ${settings.targetVocabCount} target`,
            icon: Type,
            color: '#fbbf24',
            bg: 'rgba(251,191,36,0.08)',
            border: 'rgba(251,191,36,0.15)',
          },
          {
            label: 'grammar rules',
            value: masteredGrammar,
            sub: `${inProgressGrammar} in progress`,
            icon: BookOpen,
            color: '#a78bfa',
            bg: 'rgba(167,139,250,0.08)',
            border: 'rgba(167,139,250,0.15)',
          },
          {
            label: 'day streak',
            value: `${settings.currentStreak}`,
            sub: `personal best: ${settings.longestStreak} days`,
            icon: Zap,
            color: '#34d399',
            bg: 'rgba(52,211,153,0.07)',
            border: 'rgba(52,211,153,0.15)',
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} style={{
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 14,
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 11.5, color: '#8b7fb5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {label}
              </span>
              <Icon size={15} style={{ color }} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ fontSize: 12, color: '#4d4468', marginTop: 6, lineHeight: 1.4 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Activity heatmap */}
      <div style={{
        background: '#19152a',
        border: '1px solid #2e2846',
        borderRadius: 14,
        padding: '22px 26px',
        marginBottom: 24,
      }}>
        <ActivityHeatmap activity={activity} />
      </div>

      {/* Channel cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Grammar */}
        <div
          style={{
            background: '#19152a',
            border: '1px solid #2e2846',
            borderRadius: 14,
            padding: '20px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onClick={() => setCurrentPage('grammar')}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(167,139,250,0.3)'
            el.style.background = '#1e1a2e'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#2e2846'
            el.style.background = '#19152a'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <ProgressRing value={grammarPct} size={60} strokeWidth={5} color="#a78bfa" trackColor="#2e2846" label={`${grammarPct}%`} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>Grammar</div>
              <div style={{ fontSize: 12.5, color: '#8b7fb5', marginTop: 3 }}>
                {masteredGrammar} mastered · {inProgressGrammar} in progress
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                fontSize: 11,
                color: '#a78bfa',
                padding: '2px 8px',
                borderRadius: 20,
                background: 'rgba(167,139,250,0.1)',
              }}>
                <BookOpen size={10} /> grammar channel
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #221d35', paddingTop: 14 }}>
            <div style={{ fontSize: 10.5, color: '#4d4468', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              recent
            </div>
            {recentGrammar.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot(t.status), flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#c9c0e8', flex: 1, fontWeight: 500 }}>{t.topic}</span>
                <span style={{ fontSize: 11, color: '#4d4468' }}>{t.category}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12, color: '#a78bfa', fontWeight: 600 }}>
              open channel <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Vocabulary */}
        <div
          style={{
            background: '#19152a',
            border: '1px solid #2e2846',
            borderRadius: 14,
            padding: '20px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onClick={() => setCurrentPage('vocabulary')}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'rgba(251,191,36,0.3)'
            el.style.background = '#1e1a2e'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#2e2846'
            el.style.background = '#19152a'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <ProgressRing value={vocabPct} size={60} strokeWidth={5} color="#fbbf24" trackColor="#2e2846" label={`${vocabPct}%`} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>Vocabulary</div>
              <div style={{ fontSize: 12.5, color: '#8b7fb5', marginTop: 3 }}>
                {masteredVocab}/{settings.targetVocabCount} target · {learningVocab} learning
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 8,
                fontSize: 11,
                color: '#fbbf24',
                padding: '2px 8px',
                borderRadius: 20,
                background: 'rgba(251,191,36,0.1)',
              }}>
                <Type size={10} /> vocabulary channel
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #221d35', paddingTop: 14 }}>
            <div style={{ fontSize: 10.5, color: '#4d4468', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              recent words
            </div>
            {recentWords.map(w => (
              <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusDot(w.status), flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#c9c0e8', flex: 1, fontWeight: 600 }}>{w.word}</span>
                <span style={{ fontSize: 11, color: '#4d4468', fontStyle: 'italic' }}>{w.tags[0] || ''}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, fontSize: 12, color: '#fbbf24', fontWeight: 600 }}>
              open channel <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

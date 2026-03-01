import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Save, AlertTriangle } from 'lucide-react'

const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const cefrDescriptions: Record<string, string> = {
  A1: 'Beginner — basic phrases and expressions',
  A2: 'Elementary — familiar topics in simple terms',
  B1: 'Intermediate — clear standard language on familiar matters',
  B2: 'Upper Intermediate — complex texts, fluent interaction',
  C1: 'Advanced — flexible, effective language use',
  C2: 'Proficient — near-native mastery',
}

export default function Settings() {
  const { settings, updateSettings, resetData, grammarTopics, vocabWords } = useStore()
  const [localTarget, setLocalTarget] = useState(settings.targetVocabCount.toString())
  const [localCefr, setLocalCefr]     = useState(settings.cefrGoal)
  const [localTime, setLocalTime]     = useState(settings.reminderTime)
  const [saved, setSaved]             = useState(false)

  const masteredVocab    = vocabWords.filter(w => w.status === 'mastered').length
  const masteredGrammar  = grammarTopics.filter(t => t.status === 'mastered').length

  const handleSave = () => {
    const target = parseInt(localTarget)
    if (!isNaN(target) && target > 0) {
      updateSettings({ targetVocabCount: target, cefrGoal: localCefr, reminderTime: localTime })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleReset = () => {
    if (confirm('this will reset all your data to the seed content. are you sure?')) {
      resetData()
    }
  }

  const sectionStyle = {
    background: '#19152a',
    border: '1px solid #2e2846',
    borderRadius: 14,
    padding: '24px',
    marginBottom: 18,
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }} className="fade-up">
      <div style={{ marginBottom: 30 }}>
        <h1 style={{ margin: '0 0 5px', fontSize: 24, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em' }}>
          Settings
        </h1>
        <p style={{ margin: 0, color: '#8b7fb5', fontSize: 13.5 }}>
          configure your learning targets and preferences
        </p>
      </div>

      {/* Learning targets */}
      <div style={sectionStyle}>
        <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.01em' }}>
          learning targets
        </h2>

        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            vocabulary goal
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="number"
              className="input"
              style={{ maxWidth: 150 }}
              value={localTarget}
              onChange={e => setLocalTarget(e.target.value)}
              min="100" max="10000" step="100"
            />
            <span style={{ fontSize: 13, color: '#4d4468' }}>words to master</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
            {[500, 1000, 2000, 5000].map(n => (
              <button
                key={n}
                onClick={() => setLocalTarget(n.toString())}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${localTarget === n.toString() ? '#a78bfa' : '#2e2846'}`,
                  background: localTarget === n.toString() ? 'rgba(167,139,250,0.12)' : 'transparent',
                  color: localTarget === n.toString() ? '#a78bfa' : '#8b7fb5',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: localTarget === n.toString() ? 700 : 400,
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {n.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CEFR level goal
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {cefrLevels.map(level => (
              <button
                key={level}
                onClick={() => setLocalCefr(level)}
                style={{
                  padding: '12px 4px',
                  borderRadius: 10,
                  border: `1px solid ${localCefr === level ? '#a78bfa' : '#2e2846'}`,
                  background: localCefr === level ? 'rgba(167,139,250,0.12)' : 'transparent',
                  color: localCefr === level ? '#a78bfa' : '#8b7fb5',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 800,
                  transition: 'all 0.15s',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.01em',
                }}
              >
                {level}
              </button>
            ))}
          </div>
          {localCefr && (
            <div style={{ marginTop: 10, fontSize: 13, color: '#8b7fb5', padding: '9px 14px', background: 'rgba(167,139,250,0.07)', borderRadius: 9, borderLeft: '2px solid rgba(167,139,250,0.3)' }}>
              {cefrDescriptions[localCefr]}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            daily reminder time
          </label>
          <input
            type="time"
            className="input"
            style={{ maxWidth: 150 }}
            value={localTime}
            onChange={e => setLocalTime(e.target.value)}
          />
          <div style={{ marginTop: 6, fontSize: 11.5, color: '#342f4a', fontStyle: 'italic' }}>
            display only — actual reminders require a native app
          </div>
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ minWidth: 140 }}>
          {saved ? '✦ saved!' : <><Save size={14} /> save settings</>}
        </button>
      </div>

      {/* Progress snapshot */}
      <div style={sectionStyle}>
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.01em' }}>
          progress snapshot
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'current streak', value: `${settings.currentStreak} days`, icon: '🔥' },
            { label: 'longest streak', value: `${settings.longestStreak} days`, icon: '⭐' },
            { label: 'words mastered', value: `${masteredVocab} / ${settings.targetVocabCount}`, icon: '📚' },
            { label: 'grammar mastered', value: `${masteredGrammar} rules`, icon: '✦' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ padding: '14px 16px', background: '#110e1c', borderRadius: 10, border: '1px solid #221d35' }}>
              <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 11, color: '#4d4468', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.02em' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: '#19152a', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 14, padding: 24 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: '#f87171', letterSpacing: '-0.01em' }}>
          danger zone
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#8b7fb5', lineHeight: 1.6 }}>
          reset all vocabulary, grammar topics, and activity data back to the seed content. this cannot be undone.
        </p>
        <button
          onClick={handleReset}
          style={{
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
            color: '#f87171', borderRadius: 9, padding: '8px 16px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.15)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)' }}
        >
          <AlertTriangle size={14} /> reset all data
        </button>
      </div>
    </div>
  )
}

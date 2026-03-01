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
  const { settings, updateSettings, resetData } = useStore()
  const [localTarget, setLocalTarget] = useState(settings.targetVocabCount.toString())
  const [localCefr, setLocalCefr] = useState(settings.cefrGoal)
  const [localTime, setLocalTime] = useState(settings.reminderTime)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const target = parseInt(localTarget)
    if (!isNaN(target) && target > 0) {
      updateSettings({
        targetVocabCount: target,
        cefrGoal: localCefr,
        reminderTime: localTime,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleReset = () => {
    if (confirm('this will reset all your data to the seed content. are you sure?')) {
      resetData()
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ margin: 0, color: '#8b949e', fontSize: 14 }}>
          configure your learning targets and preferences
        </p>
      </div>

      {/* Learning targets */}
      <div style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>
          learning targets
        </h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            vocabulary goal
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="number"
              className="input"
              style={{ maxWidth: 160 }}
              value={localTarget}
              onChange={(e) => setLocalTarget(e.target.value)}
              min="100"
              max="10000"
              step="100"
            />
            <span style={{ fontSize: 13, color: '#8b949e' }}>words to master</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[500, 1000, 2000, 5000].map((n) => (
              <button
                key={n}
                onClick={() => setLocalTarget(n.toString())}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${localTarget === n.toString() ? '#58a6ff' : '#30363d'}`,
                  background: localTarget === n.toString() ? 'rgba(88,166,255,0.1)' : 'transparent',
                  color: localTarget === n.toString() ? '#58a6ff' : '#8b949e',
                  cursor: 'pointer',
                  fontSize: 12,
                  transition: 'all 0.15s',
                }}
              >
                {n.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CEFR level goal
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {cefrLevels.map((level) => (
              <button
                key={level}
                onClick={() => setLocalCefr(level)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 10,
                  border: `1px solid ${localCefr === level ? '#58a6ff' : '#30363d'}`,
                  background: localCefr === level ? 'rgba(88,166,255,0.12)' : 'transparent',
                  color: localCefr === level ? '#58a6ff' : '#8b949e',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 700,
                  transition: 'all 0.15s',
                  textAlign: 'center',
                }}
              >
                {level}
              </button>
            ))}
          </div>
          {localCefr && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#8b949e', padding: '8px 12px', background: 'rgba(88,166,255,0.06)', borderRadius: 8 }}>
              {cefrDescriptions[localCefr]}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            daily reminder time
          </label>
          <input
            type="time"
            className="input"
            style={{ maxWidth: 160 }}
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
          />
          <div style={{ marginTop: 6, fontSize: 12, color: '#484f58' }}>
            display only — actual reminders require a native app
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleSave}
          style={{ minWidth: 140 }}
        >
          {saved ? '✓ saved!' : <><Save size={16} /> save settings</>}
        </button>
      </div>

      {/* Stats summary */}
      <div style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>
          your progress
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { label: 'current streak', value: `${settings.currentStreak} days 🔥` },
            { label: 'longest streak', value: `${settings.longestStreak} days` },
            { label: 'level goal', value: settings.cefrGoal },
            { label: 'vocab target', value: settings.targetVocabCount.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '12px 16px', background: '#0d1117', borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#e6edf3' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ background: '#1c2333', border: '1px solid #f8514940', borderRadius: 12, padding: 24 }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#f85149' }}>
          danger zone
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#8b949e', lineHeight: 1.6 }}>
          this will reset all your vocabulary, grammar topics, and activity data back to the seed content. this action cannot be undone.
        </p>
        <button
          onClick={handleReset}
          style={{
            background: 'rgba(248,81,73,0.1)',
            border: '1px solid rgba(248,81,73,0.4)',
            color: '#f85149',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,81,73,0.2)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,81,73,0.1)' }}
        >
          <AlertTriangle size={15} /> reset all data
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import type { GrammarTopic, GrammarStatus } from '../types'
import { Plus, ChevronDown, ChevronRight, Trash2, X } from 'lucide-react'

const statusColors: Record<GrammarStatus, string> = {
  mastered: '#3fb950',
  'in-progress': '#58a6ff',
  'not-started': '#8b949e',
}

const statusLabels: Record<GrammarStatus, string> = {
  mastered: 'mastered',
  'in-progress': 'in progress',
  'not-started': 'not started',
}

interface AddTopicModalProps {
  onClose: () => void
  onAdd: (topic: Omit<GrammarTopic, 'id' | 'dateAdded'>) => void
  existingCategories: string[]
}

function AddTopicModal({ onClose, onAdd, existingCategories }: AddTopicModalProps) {
  const [category, setCategory] = useState('')
  const [topic, setTopic] = useState('')
  const [status, setStatus] = useState<GrammarStatus>('not-started')
  const [note, setNote] = useState('')
  const [customCategory, setCustomCategory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !topic) return
    onAdd({ category, topic, status, note })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e6edf3' }}>add grammar topic</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              category
            </label>
            {customCategory ? (
              <input
                className="input"
                placeholder="e.g. Passive Voice"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                autoFocus
              />
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="input"
                  style={{ flex: 1 }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category...</option>
                  {existingCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setCustomCategory(true)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  + new
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              topic name
            </label>
            <input
              className="input"
              placeholder="e.g. Future Perfect"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              status
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['not-started', 'in-progress', 'mastered'] as GrammarStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 8,
                    border: `1px solid ${status === s ? statusColors[s] : '#30363d'}`,
                    background: status === s ? `${statusColors[s]}20` : 'transparent',
                    color: status === s ? statusColors[s] : '#8b949e',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.15s',
                  }}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              notes (optional)
            </label>
            <textarea
              className="input"
              placeholder="Key rules, examples, patterns..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>
              cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>
              <Plus size={16} /> add topic
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Grammar() {
  const { grammarTopics, addGrammarTopic, updateGrammarTopic, deleteGrammarTopic } = useStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Tenses', 'Articles']))
  const [filter, setFilter] = useState<GrammarStatus | 'all'>('all')
  const [editingNote, setEditingNote] = useState<string | null>(null)

  const masteredCount = grammarTopics.filter((t) => t.status === 'mastered').length
  const totalTarget = Math.max(grammarTopics.length, 50)
  const pct = Math.round((masteredCount / totalTarget) * 100)

  const categories = Array.from(new Set(grammarTopics.map((t) => t.category)))

  const filtered = filter === 'all'
    ? grammarTopics
    : grammarTopics.filter((t) => t.status === filter)

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing
            value={pct}
            size={80}
            strokeWidth={6}
            color="#bc8cff"
            label={`${masteredCount}`}
            sublabel="mastered"
          />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
              Grammar
            </h1>
            <p style={{ margin: 0, color: '#8b949e', fontSize: 14 }}>
              {masteredCount} mastered · {grammarTopics.filter((t) => t.status === 'in-progress').length} in progress · {grammarTopics.filter((t) => t.status === 'not-started').length} not started
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> add topic
        </button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['all', 'mastered', 'in-progress', 'not-started'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: `1px solid ${filter === f ? '#58a6ff' : '#30363d'}`,
              background: filter === f ? 'rgba(88,166,255,0.1)' : 'transparent',
              color: filter === f ? '#58a6ff' : '#8b949e',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: filter === f ? 600 : 400,
              transition: 'all 0.15s',
            }}
          >
            {f === 'all' ? 'all' : statusLabels[f as GrammarStatus]}
          </button>
        ))}
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categories.map((cat) => {
          const topics = filtered.filter((t) => t.category === cat)
          if (filter !== 'all' && topics.length === 0) return null

          const allTopics = grammarTopics.filter((t) => t.category === cat)
          const catMastered = allTopics.filter((t) => t.status === 'mastered').length
          const isOpen = expandedCategories.has(cat)

          return (
            <div
              key={cat}
              style={{ background: '#1c2333', border: '1px solid #30363d', borderRadius: 12, overflow: 'hidden' }}
            >
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#e6edf3',
                  textAlign: 'left',
                }}
              >
                {isOpen ? <ChevronDown size={16} color="#8b949e" /> : <ChevronRight size={16} color="#8b949e" />}
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{cat}</span>
                <span style={{ fontSize: 12, color: '#8b949e' }}>
                  {catMastered}/{allTopics.length}
                </span>
                <ProgressRing
                  value={allTopics.length > 0 ? Math.round((catMastered / allTopics.length) * 100) : 0}
                  size={24}
                  strokeWidth={3}
                  color="#bc8cff"
                />
              </button>

              {/* Topics */}
              {isOpen && (
                <div style={{ borderTop: '1px solid #30363d' }}>
                  {topics.map((topic, i) => (
                    <div
                      key={topic.id}
                      style={{
                        padding: '12px 18px',
                        borderBottom: i < topics.length - 1 ? '1px solid #21262d' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Status selector */}
                        <select
                          value={topic.status}
                          onChange={(e) => updateGrammarTopic(topic.id, { status: e.target.value as GrammarStatus })}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: 16,
                            outline: 'none',
                          }}
                          title="change status"
                        >
                          <option value="not-started">⬜</option>
                          <option value="in-progress">🔵</option>
                          <option value="mastered">✅</option>
                        </select>

                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#e6edf3' }}>
                            {topic.topic}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: 11,
                            padding: '2px 8px',
                            borderRadius: 20,
                            background: `${statusColors[topic.status]}20`,
                            color: statusColors[topic.status],
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {statusLabels[topic.status]}
                        </span>

                        <button
                          onClick={() => deleteGrammarTopic(topic.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#484f58',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 4,
                            display: 'flex',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f85149' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#484f58' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Notes */}
                      {editingNote === topic.id ? (
                        <textarea
                          style={{
                            width: '100%',
                            marginTop: 8,
                            background: '#0d1117',
                            border: '1px solid #58a6ff',
                            borderRadius: 6,
                            padding: '8px 10px',
                            color: '#e6edf3',
                            fontSize: 13,
                            resize: 'vertical',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                          value={topic.note}
                          placeholder="Add notes..."
                          rows={2}
                          onChange={(e) => updateGrammarTopic(topic.id, { note: e.target.value })}
                          onBlur={() => setEditingNote(null)}
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => setEditingNote(topic.id)}
                          style={{
                            marginTop: topic.note ? 8 : 4,
                            marginLeft: 26,
                            fontSize: 13,
                            color: topic.note ? '#8b949e' : '#484f58',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            borderRadius: 4,
                            lineHeight: 1.5,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#21262d' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          {topic.note || 'click to add notes...'}
                        </div>
                      )}
                    </div>
                  ))}

                  {filter !== 'all' && topics.length === 0 && (
                    <div style={{ padding: '12px 18px', color: '#8b949e', fontSize: 13 }}>
                      no topics with this status
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showModal && (
        <AddTopicModal
          onClose={() => setShowModal(false)}
          onAdd={addGrammarTopic}
          existingCategories={categories}
        />
      )}
    </div>
  )
}

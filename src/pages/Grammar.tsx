import { useState } from 'react'
import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import type { GrammarTopic, GrammarStatus } from '../types'
import { Plus, ChevronDown, ChevronRight, Trash2, X } from 'lucide-react'

const statusColors: Record<GrammarStatus, string> = {
  mastered:      '#34d399',
  'in-progress': '#60a5fa',
  'not-started': '#4d4468',
}

const statusLabels: Record<GrammarStatus, string> = {
  mastered:      'mastered',
  'in-progress': 'in progress',
  'not-started': 'not started',
}

const statusEmoji: Record<GrammarStatus, string> = {
  mastered:      '✦',
  'in-progress': '◐',
  'not-started': '○',
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
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>
            add grammar topic
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b7fb5', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              category
            </label>
            {customCategory ? (
              <input className="input" placeholder="e.g. Passive Voice" value={category} onChange={e => setCategory(e.target.value)} autoFocus />
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="input" style={{ flex: 1, appearance: 'none' }} value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">select category...</option>
                  {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button type="button" className="btn-ghost" onClick={() => setCustomCategory(true)} style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                  + new
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              topic name
            </label>
            <input className="input" placeholder="e.g. Future Perfect" value={topic} onChange={e => setTopic(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              status
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['not-started', 'in-progress', 'mastered'] as GrammarStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  style={{
                    flex: 1,
                    padding: '9px 4px',
                    borderRadius: 9,
                    border: `1px solid ${status === s ? statusColors[s] : '#2e2846'}`,
                    background: status === s ? `${statusColors[s]}18` : 'transparent',
                    color: status === s ? statusColors[s] : '#8b7fb5',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {statusEmoji[s]} {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              notes
            </label>
            <textarea
              className="input"
              placeholder="key rules, examples, patterns..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>
              <Plus size={15} /> add topic
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Grammar() {
  const { grammarTopics, addGrammarTopic, updateGrammarTopic, deleteGrammarTopic } = useStore()
  const [showModal, setShowModal]         = useState(false)
  const [expandedCats, setExpandedCats]   = useState<Set<string>>(new Set(['Tenses', 'Articles']))
  const [filter, setFilter]               = useState<GrammarStatus | 'all'>('all')
  const [editingNote, setEditingNote]     = useState<string | null>(null)

  const masteredCount = grammarTopics.filter(t => t.status === 'mastered').length
  const totalTarget   = Math.max(grammarTopics.length, 50)
  const pct           = Math.round((masteredCount / totalTarget) * 100)

  const categories = Array.from(new Set(grammarTopics.map(t => t.category)))

  const filtered = filter === 'all' ? grammarTopics : grammarTopics.filter(t => t.status === filter)

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900 }} className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing value={pct} size={78} strokeWidth={6} color="#a78bfa" trackColor="#2e2846" label={`${masteredCount}`} sublabel="mastered" />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em' }}>
              Grammar
            </h1>
            <p style={{ margin: 0, color: '#8b7fb5', fontSize: 13.5 }}>
              {masteredCount} mastered · {grammarTopics.filter(t => t.status === 'in-progress').length} in progress · {grammarTopics.filter(t => t.status === 'not-started').length} not started
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> add topic
        </button>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 24 }}>
        {(['all', 'mastered', 'in-progress', 'not-started'] as const).map(f => {
          const isActive = filter === f
          const c = f === 'all' ? '#a78bfa' : statusColors[f as GrammarStatus]
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px',
                borderRadius: 20,
                border: `1px solid ${isActive ? c : '#2e2846'}`,
                background: isActive ? `${c}18` : 'transparent',
                color: isActive ? c : '#8b7fb5',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 400,
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {f === 'all' ? 'all' : statusLabels[f as GrammarStatus]}
            </button>
          )
        })}
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categories.map(cat => {
          const topics    = filtered.filter(t => t.category === cat)
          if (filter !== 'all' && topics.length === 0) return null

          const allTopics    = grammarTopics.filter(t => t.category === cat)
          const catMastered  = allTopics.filter(t => t.status === 'mastered').length
          const catProgress  = allTopics.filter(t => t.status === 'in-progress').length
          const isOpen       = expandedCats.has(cat)

          return (
            <div key={cat} style={{
              background: '#19152a',
              border: '1px solid #2e2846',
              borderRadius: 12,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              <button
                onClick={() => toggleCat(cat)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ede8ff',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                {isOpen
                  ? <ChevronDown size={14} color="#8b7fb5" />
                  : <ChevronRight size={14} color="#8b7fb5" />
                }
                <span style={{ flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>{cat}</span>
                <div style={{ display: 'flex', gap: 6, marginRight: 10 }}>
                  {catMastered > 0 && (
                    <span style={{ fontSize: 11, color: '#34d399', fontWeight: 600 }}>{catMastered} ✦</span>
                  )}
                  {catProgress > 0 && (
                    <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600 }}>{catProgress} ◐</span>
                  )}
                </div>
                <ProgressRing
                  value={allTopics.length > 0 ? Math.round((catMastered / allTopics.length) * 100) : 0}
                  size={22}
                  strokeWidth={2.5}
                  color="#a78bfa"
                  trackColor="#2e2846"
                />
              </button>

              {isOpen && (
                <div style={{ borderTop: '1px solid #221d35' }}>
                  {topics.map((topic, i) => (
                    <div
                      key={topic.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: i < topics.length - 1 ? '1px solid #1a1726' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Status picker */}
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                          {(['not-started', 'in-progress', 'mastered'] as GrammarStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={() => updateGrammarTopic(topic.id, { status: s })}
                              title={statusLabels[s]}
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: '50%',
                                border: `1.5px solid ${topic.status === s ? statusColors[s] : '#2e2846'}`,
                                background: topic.status === s ? `${statusColors[s]}22` : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 8,
                                color: statusColors[s],
                                transition: 'all 0.15s',
                                padding: 0,
                              }}
                            >
                              {topic.status === s ? statusEmoji[s] : ''}
                            </button>
                          ))}
                        </div>

                        <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: '#c9c0e8' }}>
                          {topic.topic}
                        </span>

                        <span style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 20,
                          background: `${statusColors[topic.status]}18`,
                          color: statusColors[topic.status],
                          fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          {statusEmoji[topic.status]} {statusLabels[topic.status]}
                        </span>

                        <button
                          onClick={() => deleteGrammarTopic(topic.id)}
                          style={{
                            background: 'none', border: 'none', color: '#342f4a',
                            cursor: 'pointer', padding: 4, borderRadius: 4,
                            display: 'flex', flexShrink: 0, transition: 'color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#342f4a' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      {/* Notes */}
                      {editingNote === topic.id ? (
                        <textarea
                          style={{
                            width: '100%', marginTop: 9, marginLeft: 28,
                            background: '#0b0914', border: '1px solid #7c6af5',
                            borderRadius: 8, padding: '8px 10px', color: '#ede8ff',
                            fontSize: 13, resize: 'vertical', outline: 'none',
                            fontFamily: 'inherit', lineHeight: 1.5, maxWidth: 'calc(100% - 28px)',
                            boxShadow: '0 0 0 3px rgba(124,106,245,0.1)',
                          }}
                          value={topic.note}
                          placeholder="add notes..."
                          rows={2}
                          onChange={e => updateGrammarTopic(topic.id, { note: e.target.value })}
                          onBlur={() => setEditingNote(null)}
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => setEditingNote(topic.id)}
                          style={{
                            marginTop: topic.note ? 8 : 4,
                            marginLeft: 28,
                            fontSize: 12.5,
                            color: topic.note ? '#8b7fb5' : '#342f4a',
                            cursor: 'text',
                            padding: '4px 6px',
                            borderRadius: 6,
                            lineHeight: 1.55,
                            transition: 'background 0.15s',
                            fontStyle: topic.note ? 'normal' : 'italic',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#211e2e' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          {topic.note || 'click to add notes...'}
                        </div>
                      )}
                    </div>
                  ))}
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

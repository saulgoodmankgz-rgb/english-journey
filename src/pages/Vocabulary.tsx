import { useState } from 'react'
import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import WordCard from '../components/WordCard'
import type { VocabWord, VocabStatus } from '../types'
import { Plus, Search, X, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

interface AddWordModalProps {
  onClose: () => void
  onAdd: (word: Omit<VocabWord, 'id' | 'dateAdded'>) => void
}

function AddWordModal({ onClose, onAdd }: AddWordModalProps) {
  const [word, setWord] = useState('')
  const [pronunciation, setPronunciation] = useState('')
  const [definition, setDefinition] = useState('')
  const [example, setExample] = useState('')
  const [tags, setTags] = useState('')
  const [status, setStatus] = useState<VocabStatus>('new')

  const statusColors = { new: '#60a5fa', learning: '#fbbf24', mastered: '#34d399' }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word || !definition) return
    onAdd({
      word,
      pronunciation,
      definition,
      example,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>add word</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b7fb5', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>word *</label>
              <input className="input" placeholder="eloquent" value={word} onChange={e => setWord(e.target.value)} required autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>pronunciation</label>
              <input className="input mono" placeholder="/ˈel.ə.kwənt/" value={pronunciation} onChange={e => setPronunciation(e.target.value)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>definition *</label>
            <input className="input" placeholder="Fluent or persuasive in speaking or writing" value={definition} onChange={e => setDefinition(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>example sentence</label>
            <input className="input" placeholder="She gave an eloquent speech..." value={example} onChange={e => setExample(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>tags (comma separated)</label>
            <input className="input" placeholder="adjective, formal, academic" value={tags} onChange={e => setTags(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#8b7fb5', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['new', 'learning', 'mastered'] as VocabStatus[]).map(s => {
                const c = statusColors[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1, padding: '9px 4px', borderRadius: 9,
                      border: `1px solid ${status === s ? c : '#2e2846'}`,
                      background: status === s ? `${c}18` : 'transparent',
                      color: status === s ? c : '#8b7fb5',
                      cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}><Plus size={15} /> add word</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReviewMode({ words, onClose }: { words: VocabWord[]; onClose: () => void }) {
  const [index, setIndex]   = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [order, setOrder]   = useState(() => words.map((_, i) => i))

  if (words.length === 0) return null

  const word = words[order[index]]

  const shuffle = () => {
    const shuffled = [...order].sort(() => Math.random() - 0.5)
    setOrder(shuffled)
    setIndex(0)
    setFlipped(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#ede8ff', letterSpacing: '-0.02em' }}>
            review mode
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={shuffle}
              style={{ background: 'none', border: 'none', color: '#8b7fb5', cursor: 'pointer', padding: 4, display: 'flex' }}
              title="shuffle"
            >
              <Shuffle size={15} />
            </button>
            <span style={{ fontSize: 12, color: '#4d4468', fontWeight: 600 }}>
              {index + 1} <span style={{ color: '#342f4a' }}>/</span> {words.length}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b7fb5', cursor: 'pointer', padding: 4 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: '#221d35', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((index + 1) / words.length) * 100}%`,
            background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>

        {/* Flip card */}
        <div
          className={`flip-card ${flipped ? 'flipped' : ''}`}
          style={{ height: 240, cursor: 'pointer' }}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front" style={{
              background: '#19152a',
              border: '1px solid #2e2846',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em' }}>
                {word.word}
              </div>
              {word.pronunciation && (
                <div className="mono" style={{ fontSize: 14, color: '#8b7fb5', fontFamily: "'JetBrains Mono', monospace" }}>
                  {word.pronunciation}
                </div>
              )}
              <div style={{ fontSize: 11.5, color: '#342f4a', marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 14 }}>✦</span> tap to reveal
              </div>
            </div>

            <div className="flip-card-back" style={{
              background: '#19152a',
              border: '1px solid rgba(251,191,36,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 28,
            }}>
              <div style={{ fontSize: 16, color: '#ede8ff', textAlign: 'center', fontWeight: 500, lineHeight: 1.55 }}>
                {word.definition}
              </div>
              {word.example && (
                <div style={{
                  fontSize: 13,
                  color: '#8b7fb5',
                  textAlign: 'center',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  borderTop: '1px solid #221d35',
                  paddingTop: 12,
                  width: '100%',
                }}>
                  "{word.example}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 20 }}>
          <button
            className="btn-ghost"
            onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false) }}
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn-ghost"
            onClick={() => { setIndex(Math.min(words.length - 1, index + 1)); setFlipped(false) }}
            disabled={index === words.length - 1}
            style={{ opacity: index === words.length - 1 ? 0.3 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Vocabulary() {
  const { vocabWords, settings, addVocabWord, updateVocabWord, deleteVocabWord } = useStore()
  const [showModal, setShowModal]     = useState(false)
  const [showReview, setShowReview]   = useState(false)
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState<VocabStatus | 'all'>('all')
  const [tagFilter, setTagFilter]     = useState<string>('all')

  const masteredCount = vocabWords.filter(w => w.status === 'mastered').length
  const learningCount = vocabWords.filter(w => w.status === 'learning').length
  const newCount      = vocabWords.filter(w => w.status === 'new').length
  const pct           = Math.min(100, Math.round((masteredCount / settings.targetVocabCount) * 100))

  const allTags = Array.from(new Set(vocabWords.flatMap(w => w.tags))).sort()

  const filtered = vocabWords.filter(w => {
    if (search && !w.word.toLowerCase().includes(search.toLowerCase()) && !w.definition.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && w.status !== statusFilter) return false
    if (tagFilter !== 'all' && !w.tags.includes(tagFilter)) return false
    return true
  })

  const statusColors = { new: '#60a5fa', learning: '#fbbf24', mastered: '#34d399' }

  return (
    <div style={{ padding: '32px 36px' }} className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing value={pct} size={78} strokeWidth={6} color="#fbbf24" trackColor="#2e2846" label={`${masteredCount}`} sublabel="words" />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em' }}>
              Vocabulary
            </h1>
            <p style={{ margin: 0, color: '#8b7fb5', fontSize: 13.5 }}>
              {masteredCount}/{settings.targetVocabCount} target · {learningCount} learning · {newCount} new
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setShowReview(true)}>
            <Shuffle size={14} /> review
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={15} /> add word
          </button>
        </div>
      </div>

      {/* Progress bar — 3-segment */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 0, height: 5, borderRadius: 4, overflow: 'hidden', background: '#1a1726', marginBottom: 8 }}>
          <div style={{ width: `${(masteredCount / Math.max(vocabWords.length, 1)) * 100}%`, background: '#34d399', transition: 'width 0.4s' }} />
          <div style={{ width: `${(learningCount / Math.max(vocabWords.length, 1)) * 100}%`, background: '#fbbf24', transition: 'width 0.4s' }} />
          <div style={{ width: `${(newCount / Math.max(vocabWords.length, 1)) * 100}%`, background: '#60a5fa', transition: 'width 0.4s' }} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { label: 'mastered', count: masteredCount, color: '#34d399' },
            { label: 'learning', count: learningCount, color: '#fbbf24' },
            { label: 'new',      count: newCount,      color: '#60a5fa' },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11.5, color: '#8b7fb5' }}>{count} {label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4d4468' }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="search words or definitions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'new', 'learning', 'mastered'] as const).map(s => {
            const active = statusFilter === s
            const c = s === 'all' ? '#a78bfa' : statusColors[s as VocabStatus]
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `1px solid ${active ? c : '#2e2846'}`,
                  background: active ? `${c}18` : 'transparent',
                  color: active ? c : '#8b7fb5',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  fontWeight: active ? 700 : 400,
                  transition: 'all 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                {s}
              </button>
            )
          })}
        </div>

        {allTags.length > 0 && (
          <select
            className="input"
            style={{ width: 'auto', minWidth: 120, fontSize: 12.5, appearance: 'none' }}
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
          >
            <option value="all">all tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {/* Word grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4d4468' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 16, color: '#8b7fb5', fontWeight: 600 }}>no words found</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>try a different search or filter</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(word => (
            <WordCard
              key={word.id}
              word={word}
              onStatusChange={(id, status) => updateVocabWord(id, { status })}
              onDelete={deleteVocabWord}
            />
          ))}
        </div>
      )}

      {showModal  && <AddWordModal onClose={() => setShowModal(false)} onAdd={addVocabWord} />}
      {showReview && <ReviewMode words={filtered.length > 0 ? filtered : vocabWords} onClose={() => setShowReview(false)} />}
    </div>
  )
}

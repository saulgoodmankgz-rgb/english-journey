import { useState } from 'react'
import { useStore } from '../store/useStore'
import ProgressRing from '../components/ProgressRing'
import WordCard from '../components/WordCard'
import type { VocabWord, VocabStatus } from '../types'
import { Plus, Search, X, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!word || !definition) return
    onAdd({
      word,
      pronunciation,
      definition,
      example,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      status,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e6edf3' }}>add word</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4 }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>word *</label>
              <input className="input" placeholder="eloquent" value={word} onChange={(e) => setWord(e.target.value)} required autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>pronunciation</label>
              <input className="input" placeholder="/ˈel.ə.kwənt/" value={pronunciation} onChange={(e) => setPronunciation(e.target.value)} />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>definition *</label>
            <input className="input" placeholder="Fluent or persuasive in speaking or writing" value={definition} onChange={(e) => setDefinition(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>example sentence</label>
            <input className="input" placeholder="She gave an eloquent speech..." value={example} onChange={(e) => setExample(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>tags (comma separated)</label>
            <input className="input" placeholder="adjective, formal, academic" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#8b949e', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['new', 'learning', 'mastered'] as VocabStatus[]).map((s) => {
                const colors = { new: '#58a6ff', learning: '#d29922', mastered: '#3fb950' }
                const c = colors[s]
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1, padding: '8px 4px', borderRadius: 8,
                      border: `1px solid ${status === s ? c : '#30363d'}`,
                      background: status === s ? `${c}20` : 'transparent',
                      color: status === s ? c : '#8b949e',
                      cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                    }}
                  >{s}</button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>cancel</button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}><Plus size={16} /> add word</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Flip card review mode
function ReviewMode({ words, onClose }: { words: VocabWord[]; onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (words.length === 0) return null

  const word = words[index]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 520, padding: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>
            review mode
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#8b949e' }}>{index + 1} / {words.length}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Flip card */}
        <div
          className={`flip-card ${flipped ? 'flipped' : ''}`}
          style={{ height: 240, cursor: 'pointer' }}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="flip-card-inner">
            {/* Front */}
            <div
              className="flip-card-front"
              style={{
                background: '#1c2333',
                border: '1px solid #30363d',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
                {word.word}
              </div>
              <div style={{ fontSize: 14, color: '#8b949e', fontFamily: 'monospace' }}>
                {word.pronunciation}
              </div>
              <div style={{ fontSize: 12, color: '#484f58', marginTop: 12 }}>tap to reveal</div>
            </div>
            {/* Back */}
            <div
              className="flip-card-back"
              style={{
                background: '#1c2333',
                border: '1px solid #58a6ff40',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: 24,
              }}
            >
              <div style={{ fontSize: 16, color: '#e6edf3', textAlign: 'center', fontWeight: 500, lineHeight: 1.5 }}>
                {word.definition}
              </div>
              {word.example && (
                <div style={{ fontSize: 13, color: '#8b949e', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.6, borderTop: '1px solid #30363d', paddingTop: 12 }}>
                  "{word.example}"
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          <button
            className="btn-ghost"
            onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false) }}
            disabled={index === 0}
            style={{ opacity: index === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn-ghost"
            onClick={() => { setFlipped(false); setTimeout(() => setFlipped(false), 0) }}
            style={{ padding: '8px' }}
          >
            <RotateCw size={16} />
          </button>
          <button
            className="btn-ghost"
            onClick={() => { setIndex(Math.min(words.length - 1, index + 1)); setFlipped(false) }}
            disabled={index === words.length - 1}
            style={{ opacity: index === words.length - 1 ? 0.4 : 1 }}
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
  const [showModal, setShowModal] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VocabStatus | 'all'>('all')
  const [tagFilter, setTagFilter] = useState<string>('all')

  const masteredCount = vocabWords.filter((w) => w.status === 'mastered').length
  const pct = Math.min(100, Math.round((masteredCount / settings.targetVocabCount) * 100))

  const allTags = Array.from(new Set(vocabWords.flatMap((w) => w.tags))).sort()

  const filtered = vocabWords.filter((w) => {
    if (search && !w.word.toLowerCase().includes(search.toLowerCase()) && !w.definition.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && w.status !== statusFilter) return false
    if (tagFilter !== 'all' && !w.tags.includes(tagFilter)) return false
    return true
  })

  const statusColors = { new: '#58a6ff', learning: '#d29922', mastered: '#3fb950' }

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ProgressRing
            value={pct}
            size={80}
            strokeWidth={6}
            color="#d29922"
            label={`${masteredCount}`}
            sublabel="words"
          />
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
              Vocabulary
            </h1>
            <p style={{ margin: 0, color: '#8b949e', fontSize: 14 }}>
              {masteredCount}/{settings.targetVocabCount} target · {vocabWords.filter((w) => w.status === 'learning').length} learning · {vocabWords.filter((w) => w.status === 'new').length} new
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setShowReview(true)}>
            <RotateCw size={16} /> review
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> add word
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8b949e' }} />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="search words..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'new', 'learning', 'mastered'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: `1px solid ${statusFilter === s ? (s === 'all' ? '#58a6ff' : statusColors[s as VocabStatus] || '#58a6ff') : '#30363d'}`,
                background: statusFilter === s ? `${s === 'all' ? '#58a6ff' : statusColors[s as VocabStatus] || '#58a6ff'}15` : 'transparent',
                color: statusFilter === s ? (s === 'all' ? '#58a6ff' : statusColors[s as VocabStatus] || '#58a6ff') : '#8b949e',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: statusFilter === s ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {allTags.length > 0 && (
          <select
            className="input"
            style={{ width: 'auto', minWidth: 120 }}
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          >
            <option value="all">all tags</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, height: 6, borderRadius: 4, overflow: 'hidden', background: '#21262d' }}>
        <div style={{ width: `${(masteredCount / vocabWords.length) * 100}%`, background: '#3fb950', transition: 'width 0.3s' }} />
        <div style={{ width: `${(vocabWords.filter((w) => w.status === 'learning').length / vocabWords.length) * 100}%`, background: '#d29922', transition: 'width 0.3s' }} />
        <div style={{ width: `${(vocabWords.filter((w) => w.status === 'new').length / vocabWords.length) * 100}%`, background: '#58a6ff', transition: 'width 0.3s' }} />
      </div>

      {/* Word grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8b949e' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 16 }}>no words found</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>try a different search or filter</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onStatusChange={(id, status) => updateVocabWord(id, { status })}
              onDelete={deleteVocabWord}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddWordModal onClose={() => setShowModal(false)} onAdd={addVocabWord} />
      )}

      {showReview && (
        <ReviewMode
          words={filtered.length > 0 ? filtered : vocabWords}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  )
}

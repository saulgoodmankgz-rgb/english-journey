import { useState } from 'react'
import type { VocabWord } from '../types'
import { Trash2, ChevronDown } from 'lucide-react'

interface WordCardProps {
  word: VocabWord
  onStatusChange: (id: string, status: VocabWord['status']) => void
  onDelete: (id: string) => void
}

const statusColors = { new: '#60a5fa', learning: '#fbbf24', mastered: '#34d399' }
const statusBg     = { new: 'rgba(96,165,250,0.1)', learning: 'rgba(251,191,36,0.1)', mastered: 'rgba(52,211,153,0.1)' }
const statusBorder = { new: 'rgba(96,165,250,0.25)', learning: 'rgba(251,191,36,0.25)', mastered: 'rgba(52,211,153,0.25)' }

export default function WordCard({ word, onStatusChange, onDelete }: WordCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background: '#19152a',
      border: `1px solid #2e2846`,
      borderRadius: 13,
      padding: '16px',
      position: 'relative',
      transition: 'border-color 0.15s, background 0.15s',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#3a3358'
      el.style.background = '#1e1a2e'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement
      el.style.borderColor = '#2e2846'
      el.style.background = '#19152a'
    }}>
      {/* Status indicator line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        borderRadius: '13px 13px 0 0',
        background: statusColors[word.status],
        opacity: 0.5,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: '#ede8ff', letterSpacing: '-0.03em' }}>
              {word.word}
            </span>
            {word.pronunciation && (
              <span style={{ fontSize: 12, color: '#8b7fb5', fontFamily: "'JetBrains Mono', monospace" }}>
                {word.pronunciation}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: '#8b7fb5', lineHeight: 1.55 }}>
            {word.definition}
          </p>
        </div>
      </div>

      {/* Tags */}
      {word.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
          {word.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10.5,
              padding: '2px 8px',
              borderRadius: 20,
              background: 'rgba(139,127,181,0.1)',
              color: '#8b7fb5',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      {word.example && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none', border: 'none', color: '#4d4468',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            marginTop: 10, fontSize: 12, padding: 0, transition: 'color 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ede8ff' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#4d4468' }}
        >
          <ChevronDown
            size={13}
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
          />
          {expanded ? 'hide example' : 'show example'}
        </button>
      )}

      {expanded && word.example && (
        <div style={{
          marginTop: 10,
          padding: '10px 12px',
          background: 'rgba(251,191,36,0.05)',
          borderRadius: 8,
          borderLeft: '2px solid rgba(251,191,36,0.3)',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#c9c0e8', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{word.example}"
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <select
          value={word.status}
          onChange={e => onStatusChange(word.id, e.target.value as VocabWord['status'])}
          onClick={e => e.stopPropagation()}
          style={{
            background: statusBg[word.status],
            color: statusColors[word.status],
            border: `1px solid ${statusBorder[word.status]}`,
            borderRadius: 7,
            padding: '4px 10px',
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit',
            appearance: 'none',
          }}
        >
          <option value="new">new</option>
          <option value="learning">learning</option>
          <option value="mastered">mastered</option>
        </select>

        <button
          onClick={e => { e.stopPropagation(); onDelete(word.id) }}
          style={{
            background: 'none', border: 'none', color: '#342f4a',
            cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f87171' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#342f4a' }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

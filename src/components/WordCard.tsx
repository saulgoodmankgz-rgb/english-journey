import { useState } from 'react'
import type { VocabWord } from '../types'
import { Trash2, ChevronDown } from 'lucide-react'

interface WordCardProps {
  word: VocabWord
  onStatusChange: (id: string, status: VocabWord['status']) => void
  onDelete: (id: string) => void
}

const statusColors = {
  new: '#58a6ff',
  learning: '#d29922',
  mastered: '#3fb950',
}

const statusBg = {
  new: 'rgba(88,166,255,0.12)',
  learning: 'rgba(210,153,34,0.12)',
  mastered: 'rgba(63,185,80,0.12)',
}

export default function WordCard({ word, onStatusChange, onDelete }: WordCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      style={{
        background: '#1c2333',
        border: `1px solid #30363d`,
        borderRadius: 12,
        padding: '16px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#484f58'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#30363d'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.02em' }}>
              {word.word}
            </span>
            <span style={{ fontSize: 12, color: '#8b949e', fontFamily: 'monospace' }}>
              {word.pronunciation}
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#8b949e', lineHeight: 1.5 }}>
            {word.definition}
          </p>
        </div>

        {/* Status dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: statusColors[word.status],
            flexShrink: 0,
            marginTop: 4,
          }}
          title={word.status}
        />
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
        {word.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 20,
              background: 'rgba(139,148,158,0.1)',
              color: '#8b949e',
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#8b949e',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 10,
          fontSize: 12,
          padding: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#e6edf3' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#8b949e' }}
      >
        <ChevronDown
          size={14}
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        />
        {expanded ? 'Hide' : 'Show example'}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: 'rgba(88,166,255,0.05)',
          borderRadius: 8,
          borderLeft: '3px solid rgba(88,166,255,0.4)',
        }}>
          <p style={{ margin: 0, fontSize: 13, color: '#c9d1d9', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{word.example}"
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <select
          value={word.status}
          onChange={(e) => onStatusChange(word.id, e.target.value as VocabWord['status'])}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: statusBg[word.status],
            color: statusColors[word.status],
            border: `1px solid ${statusColors[word.status]}40`,
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="new">new</option>
          <option value="learning">learning</option>
          <option value="mastered">mastered</option>
        </select>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(word.id) }}
          style={{
            background: 'none',
            border: 'none',
            color: '#484f58',
            cursor: 'pointer',
            padding: 4,
            borderRadius: 6,
            display: 'flex',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#f85149' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#484f58' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

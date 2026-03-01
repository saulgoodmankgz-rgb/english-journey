export type GrammarStatus = 'not-started' | 'in-progress' | 'mastered'
export type VocabStatus = 'new' | 'learning' | 'mastered'

export interface GrammarTopic {
  id: string
  category: string
  topic: string
  status: GrammarStatus
  note: string
  dateAdded: string
}

export interface VocabWord {
  id: string
  word: string
  pronunciation: string
  definition: string
  example: string
  tags: string[]
  status: VocabStatus
  dateAdded: string
}

export interface ActivityEntry {
  date: string // YYYY-MM-DD
  count: number
}

export interface Settings {
  targetVocabCount: number
  cefrGoal: string
  reminderTime: string
  currentStreak: number
  longestStreak: number
}

export interface MindMapNode {
  id: string
  type?: string
  position: { x: number; y: number }
  data: { label: string; color?: string }
}

export interface MindMapEdge {
  id: string
  source: string
  target: string
}

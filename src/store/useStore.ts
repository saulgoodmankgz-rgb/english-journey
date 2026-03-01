import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GrammarTopic, VocabWord, ActivityEntry, Settings, MindMapNode, MindMapEdge } from '../types'

const generateId = () => Math.random().toString(36).substr(2, 9)
const today = () => new Date().toISOString().split('T')[0]

const seedGrammar: GrammarTopic[] = [
  { id: generateId(), category: 'Tenses', topic: 'Present Simple', status: 'mastered', note: 'Use for habits and facts. She works, I go, He doesn\'t...', dateAdded: '2024-01-15' },
  { id: generateId(), category: 'Tenses', topic: 'Present Continuous', status: 'mastered', note: 'Use for actions happening right now. I am working...', dateAdded: '2024-01-18' },
  { id: generateId(), category: 'Tenses', topic: 'Past Simple', status: 'mastered', note: 'Completed actions in the past. I went, She said...', dateAdded: '2024-01-22' },
  { id: generateId(), category: 'Tenses', topic: 'Past Continuous', status: 'in-progress', note: 'Was/were + -ing for past ongoing actions', dateAdded: '2024-02-01' },
  { id: generateId(), category: 'Tenses', topic: 'Present Perfect', status: 'in-progress', note: 'Have/has + past participle. Links past to present', dateAdded: '2024-02-05' },
  { id: generateId(), category: 'Tenses', topic: 'Past Perfect', status: 'not-started', note: '', dateAdded: '2024-02-10' },
  { id: generateId(), category: 'Articles', topic: 'Definite Article (the)', status: 'mastered', note: 'Use when both speaker and listener know the thing', dateAdded: '2024-01-20' },
  { id: generateId(), category: 'Articles', topic: 'Indefinite Articles (a/an)', status: 'mastered', note: 'a before consonant sounds, an before vowel sounds', dateAdded: '2024-01-20' },
  { id: generateId(), category: 'Prepositions', topic: 'Prepositions of Time (at/in/on)', status: 'in-progress', note: 'at for specific times, in for months/years, on for days', dateAdded: '2024-02-08' },
  { id: generateId(), category: 'Conditionals', topic: 'Zero Conditional', status: 'not-started', note: '', dateAdded: '2024-02-15' },
  { id: generateId(), category: 'Conditionals', topic: 'First Conditional', status: 'not-started', note: '', dateAdded: '2024-02-15' },
]

const seedVocab: VocabWord[] = [
  { id: generateId(), word: 'eloquent', pronunciation: '/ˈel.ə.kwənt/', definition: 'Fluent or persuasive in speaking or writing', example: 'She gave an eloquent speech that moved the audience.', tags: ['adjective', 'formal'], status: 'mastered', dateAdded: '2024-01-16' },
  { id: generateId(), word: 'persevere', pronunciation: '/ˌpɜː.sɪˈvɪər/', definition: 'Continue despite difficulty or delay', example: 'You must persevere even when things get hard.', tags: ['verb', 'motivation'], status: 'learning', dateAdded: '2024-01-19' },
  { id: generateId(), word: 'meticulous', pronunciation: '/məˈtɪk.jʊ.ləs/', definition: 'Showing great attention to detail', example: 'He was meticulous in his preparation for the exam.', tags: ['adjective', 'formal'], status: 'mastered', dateAdded: '2024-01-23' },
  { id: generateId(), word: 'leverage', pronunciation: '/ˈlev.ər.ɪdʒ/', definition: 'Use something to maximum advantage', example: 'She used her skills to leverage a better opportunity.', tags: ['verb', 'business'], status: 'learning', dateAdded: '2024-02-02' },
  { id: generateId(), word: 'concise', pronunciation: '/kənˈsaɪs/', definition: 'Giving a lot of information clearly in few words', example: 'Keep your emails concise and to the point.', tags: ['adjective'], status: 'mastered', dateAdded: '2024-02-06' },
  { id: generateId(), word: 'nuance', pronunciation: '/ˈnjuː.ɑːns/', definition: 'A subtle difference in meaning, expression, or sound', example: 'Understanding nuance takes time in any language.', tags: ['noun', 'formal'], status: 'new', dateAdded: '2024-02-11' },
  { id: generateId(), word: 'ambiguous', pronunciation: '/æmˈbɪɡ.ju.əs/', definition: 'Open to more than one interpretation', example: 'The instructions were ambiguous and confusing.', tags: ['adjective'], status: 'learning', dateAdded: '2024-02-14' },
  { id: generateId(), word: 'diligent', pronunciation: '/ˈdɪl.ɪ.dʒənt/', definition: 'Having or showing careful and persistent effort', example: 'A diligent student always reviews their notes.', tags: ['adjective'], status: 'mastered', dateAdded: '2024-02-16' },
]

// Generate activity data for past 12 weeks
const generateActivity = (): ActivityEntry[] => {
  const entries: ActivityEntry[] = []
  const now = new Date()
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    // Simulate some activity
    const rand = Math.random()
    entries.push({
      date: dateStr,
      count: rand > 0.4 ? Math.floor(Math.random() * 8) + 1 : 0,
    })
  }
  // Ensure today has activity
  entries[entries.length - 1].count = Math.max(entries[entries.length - 1].count, 3)
  return entries
}

const seedMindMapNodes: MindMapNode[] = [
  { id: 'english', position: { x: 400, y: 300 }, data: { label: 'English', color: '#58a6ff' } },
  { id: 'grammar', position: { x: 150, y: 150 }, data: { label: 'Grammar', color: '#bc8cff' } },
  { id: 'vocabulary', position: { x: 650, y: 150 }, data: { label: 'Vocabulary', color: '#d29922' } },
  { id: 'speaking', position: { x: 650, y: 450 }, data: { label: 'Speaking', color: '#3fb950' } },
  { id: 'writing', position: { x: 150, y: 450 }, data: { label: 'Writing', color: '#3fb950' } },
  { id: 'reading', position: { x: 400, y: 520 }, data: { label: 'Reading', color: '#58a6ff' } },
  { id: 'tenses', position: { x: 0, y: 50 }, data: { label: 'Tenses', color: '#bc8cff' } },
  { id: 'present-simple', position: { x: -120, y: -50 }, data: { label: 'Present Simple', color: '#bc8cff' } },
  { id: 'past-simple', position: { x: -80, y: 100 }, data: { label: 'Past Simple', color: '#bc8cff' } },
  { id: 'articles', position: { x: 100, y: 0 }, data: { label: 'Articles', color: '#bc8cff' } },
  { id: 'formal-words', position: { x: 800, y: 80 }, data: { label: 'Formal Words', color: '#d29922' } },
  { id: 'phrasal-verbs', position: { x: 800, y: 220 }, data: { label: 'Phrasal Verbs', color: '#d29922' } },
]

const seedMindMapEdges: MindMapEdge[] = [
  { id: 'e1', source: 'english', target: 'grammar' },
  { id: 'e2', source: 'english', target: 'vocabulary' },
  { id: 'e3', source: 'english', target: 'speaking' },
  { id: 'e4', source: 'english', target: 'writing' },
  { id: 'e5', source: 'english', target: 'reading' },
  { id: 'e6', source: 'grammar', target: 'tenses' },
  { id: 'e7', source: 'grammar', target: 'articles' },
  { id: 'e8', source: 'tenses', target: 'present-simple' },
  { id: 'e9', source: 'tenses', target: 'past-simple' },
  { id: 'e10', source: 'vocabulary', target: 'formal-words' },
  { id: 'e11', source: 'vocabulary', target: 'phrasal-verbs' },
]

interface AppState {
  grammarTopics: GrammarTopic[]
  vocabWords: VocabWord[]
  activity: ActivityEntry[]
  settings: Settings
  mindMapNodes: MindMapNode[]
  mindMapEdges: MindMapEdge[]
  currentPage: string

  // Actions
  setCurrentPage: (page: string) => void
  addGrammarTopic: (topic: Omit<GrammarTopic, 'id' | 'dateAdded'>) => void
  updateGrammarTopic: (id: string, updates: Partial<GrammarTopic>) => void
  deleteGrammarTopic: (id: string) => void
  addVocabWord: (word: Omit<VocabWord, 'id' | 'dateAdded'>) => void
  updateVocabWord: (id: string, updates: Partial<VocabWord>) => void
  deleteVocabWord: (id: string) => void
  updateSettings: (updates: Partial<Settings>) => void
  recordActivity: () => void
  setMindMapNodes: (nodes: MindMapNode[]) => void
  setMindMapEdges: (edges: MindMapEdge[]) => void
  resetData: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set, _get) => ({
      grammarTopics: seedGrammar,
      vocabWords: seedVocab,
      activity: generateActivity(),
      settings: {
        targetVocabCount: 1000,
        cefrGoal: 'B2',
        reminderTime: '09:00',
        currentStreak: 7,
        longestStreak: 14,
      },
      mindMapNodes: seedMindMapNodes,
      mindMapEdges: seedMindMapEdges,
      currentPage: 'dashboard',

      setCurrentPage: (page) => set({ currentPage: page }),

      addGrammarTopic: (topic) =>
        set((state) => ({
          grammarTopics: [
            ...state.grammarTopics,
            { ...topic, id: generateId(), dateAdded: today() },
          ],
        })),

      updateGrammarTopic: (id, updates) =>
        set((state) => ({
          grammarTopics: state.grammarTopics.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteGrammarTopic: (id) =>
        set((state) => ({
          grammarTopics: state.grammarTopics.filter((t) => t.id !== id),
        })),

      addVocabWord: (word) =>
        set((state) => ({
          vocabWords: [
            ...state.vocabWords,
            { ...word, id: generateId(), dateAdded: today() },
          ],
        })),

      updateVocabWord: (id, updates) =>
        set((state) => ({
          vocabWords: state.vocabWords.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      deleteVocabWord: (id) =>
        set((state) => ({
          vocabWords: state.vocabWords.filter((w) => w.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      recordActivity: () => {
        const todayStr = today()
        set((state) => {
          const existing = state.activity.find((a) => a.date === todayStr)
          if (existing) {
            return {
              activity: state.activity.map((a) =>
                a.date === todayStr ? { ...a, count: a.count + 1 } : a
              ),
            }
          }
          return {
            activity: [...state.activity, { date: todayStr, count: 1 }],
          }
        })
      },

      setMindMapNodes: (nodes) => set({ mindMapNodes: nodes }),
      setMindMapEdges: (edges) => set({ mindMapEdges: edges }),

      resetData: () =>
        set({
          grammarTopics: seedGrammar,
          vocabWords: seedVocab,
          activity: generateActivity(),
          settings: {
            targetVocabCount: 1000,
            cefrGoal: 'B2',
            reminderTime: '09:00',
            currentStreak: 7,
            longestStreak: 14,
          },
          mindMapNodes: seedMindMapNodes,
          mindMapEdges: seedMindMapEdges,
        }),
    }),
    {
      name: 'english-journey-store',
    }
  )
)
